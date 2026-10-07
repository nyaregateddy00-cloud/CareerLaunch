export type OpportunityType = 'Job' | 'Internship' | 'Attachment' | 'Scholarship' | 'Freelance' | 'Graduate Program' | 'Remote' | 'Competition' | 'Fellowship' | 'Hackathon' | 'Volunteering' | 'Event' | 'Apprenticeship' | 'Training' | 'Entrepreneurship';

export interface FeedSourceConfig {
  key: string;
  name: string;
  url: string;
  country?: string;
  category?: string;
  attribution: string;
  redistributionPermitted: boolean;
  enabled?: boolean;
}

export interface SourceOpportunity {
  externalId: string;
  title: string;
  organization: string;
  description: string;
  category: OpportunityType;
  location: string;
  country: string;
  workMode: 'On-site' | 'Hybrid' | 'Remote' | null;
  deadline?: string;
  postedAt?: string;
  isRolling?: boolean;
  sourceName: string;
  sourceKey: string;
  sourceUrl: string;
  applicationUrl?: string;
  skills: string[];
}

export interface OpportunitySourceAdapter {
  readonly sourceKey: string;
  fetch(source: FeedSourceConfig): Promise<SourceOpportunity[]>;
}

const MAX_FEED_BYTES = 2_000_000;
const MAX_ITEMS = 100;
const MAX_SOURCES = 20;

function decodeXml(value: string): string {
  return value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_match, code: string) => String.fromCodePoint(Number(code)))
    .replace(/\s+/g, ' ').trim();
}

function field(block: string, name: string, attribute?: string): string {
  if (attribute) {
    const tag = block.match(new RegExp(`<${name}\\b[^>]*${attribute}=["']([^"']+)["'][^>]*\\/?\\s*>`, 'i'));
    return tag?.[1]?.trim() ?? '';
  }
  const match = block.match(new RegExp(`<${name}\\b[^>]*>([\\s\\S]*?)<\\/${name}\\s*>`, 'i'));
  return match ? decodeXml(match[1]) : '';
}

function categorize(text: string, fallback?: string): OpportunityType {
  const value = text.toLowerCase();
  const mapping: Array<[RegExp, OpportunityType]> = [
    [/scholarship|bursary|tuition grant/, 'Scholarship'], [/fellowship/, 'Fellowship'], [/hackathon/, 'Hackathon'],
    [/graduate programme|graduate program|management trainee/, 'Graduate Program'], [/internship|intern\b/, 'Internship'],
    [/attachment|industrial placement/, 'Attachment'], [/apprentice/, 'Apprenticeship'], [/freelance|contractor gig/, 'Freelance'],
    [/volunteer/, 'Volunteering'], [/competition|challenge/, 'Competition'], [/training|bootcamp|course/, 'Training'],
    [/entrepreneurship|startup grant|business incubation/, 'Entrepreneurship'], [/remote/, 'Remote'],
  ];
  return mapping.find(([pattern]) => pattern.test(value))?.[1] ?? (fallback as OpportunityType | undefined) ?? 'Job';
}

function workMode(text: string): SourceOpportunity['workMode'] {
  if (/\bremote\b|work from anywhere/i.test(text)) return 'Remote';
  if (/\bhybrid\b/i.test(text)) return 'Hybrid';
  if (/\bon.?site\b|in.?person/i.test(text)) return 'On-site';
  return null;
}

function safeFeedUrl(raw: string): URL {
  const url = new URL(raw);
  if (url.protocol !== 'https:' || url.username || url.password) throw new Error('Feed URLs must use HTTPS and cannot include embedded credentials.');
  if (['localhost', '127.0.0.1', '0.0.0.0', '::1'].includes(url.hostname) || /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(url.hostname)) {
    throw new Error('Private and local feed hosts are not allowed.');
  }
  return url;
}

export class RssAtomOpportunityAdapter implements OpportunitySourceAdapter {
  readonly sourceKey = 'rss-atom';

  async fetch(source: FeedSourceConfig): Promise<SourceOpportunity[]> {
    const url = safeFeedUrl(source.url);
    const response = await fetch(url, {
      headers: { Accept: 'application/atom+xml, application/rss+xml, application/xml, text/xml' },
      signal: AbortSignal.timeout(15_000),
      redirect: 'error',
    });
    if (!response.ok) throw new Error(`Feed responded with HTTP ${response.status}.`);
    const declaredSize = Number(response.headers.get('content-length') ?? 0);
    if (declaredSize > MAX_FEED_BYTES) throw new Error('Feed exceeded the 2 MB size limit.');
    const xml = await response.text();
    if (Buffer.byteLength(xml, 'utf8') > MAX_FEED_BYTES) throw new Error('Feed exceeded the 2 MB size limit.');
    const blocks = [...xml.matchAll(/<(item|entry)\b[^>]*>[\s\S]*?<\/\1\s*>/gi)].slice(0, MAX_ITEMS).map((match) => match[0]);
    return blocks.flatMap((block, index) => {
      const title = field(block, 'title');
      const description = field(block, 'description') || field(block, 'summary') || field(block, 'content');
      const link = field(block, 'link', 'href') || field(block, 'link');
      const guid = field(block, 'guid') || field(block, 'id') || link || `${title}-${index}`;
      if (!title || !link) return [];
      let sourceUrl: string;
      try { sourceUrl = new URL(link, url).toString(); if (!['https:', 'http:'].includes(new URL(sourceUrl).protocol)) return []; }
      catch { return []; }
      const dateValue = field(block, 'pubDate') || field(block, 'published') || field(block, 'updated');
      const postedAt = dateValue && !Number.isNaN(Date.parse(dateValue)) ? new Date(dateValue).toISOString() : undefined;
      const closingValue = field(block, 'deadline') || field(block, 'closingDate');
      const deadlineParsed = closingValue && !Number.isNaN(Date.parse(closingValue)) ? new Date(closingValue).toISOString().slice(0, 10) : undefined;
      const searchable = `${title} ${description}`;
      return [{
        externalId: guid.slice(0, 500), title: title.slice(0, 300), organization: field(block, 'organization') || field(block, 'company') || 'Not provided',
        description: description || 'Description not provided by source.', category: categorize(searchable, source.category),
        location: source.country || 'Not provided', country: source.country || 'Not provided', workMode: workMode(searchable),
        deadline: deadlineParsed, isRolling: /rolling basis|open until filled|applications accepted on a rolling basis/i.test(searchable),
        postedAt, sourceName: source.attribution || source.name, sourceKey: source.key, sourceUrl,
        // RSS links usually point to an editorial listing, not a verified application form.
        skills: [],
      }];
    });
  }
}

export function normalizeFingerprint(item: Pick<SourceOpportunity, 'title' | 'organization' | 'location' | 'deadline'>): string {
  return `${item.title}|${item.organization}|${item.location}|${item.deadline ?? ''}`.toLowerCase().replace(/[^a-z0-9|]+/g, '');
}

export function parseFeedConfiguration(raw: string | undefined): FeedSourceConfig[] {
  if (!raw) return [];
  const parsed = JSON.parse(raw) as unknown;
  if (!Array.isArray(parsed)) throw new Error('OPPORTUNITY_FEEDS_JSON must be a JSON array.');
  if (parsed.length > MAX_SOURCES) throw new Error(`OPPORTUNITY_FEEDS_JSON supports at most ${MAX_SOURCES} source feeds per sync.`);
  return parsed.flatMap((value): FeedSourceConfig[] => {
    if (!value || typeof value !== 'object') return [];
    const item = value as Partial<FeedSourceConfig>;
    if (!item.key || !item.name || !item.url || !item.attribution || item.redistributionPermitted !== true || item.enabled === false) return [];
    safeFeedUrl(item.url);
    const categories: OpportunityType[] = ['Job','Internship','Attachment','Scholarship','Freelance','Graduate Program','Remote','Competition','Fellowship','Hackathon','Volunteering','Event','Apprenticeship','Training','Entrepreneurship'];
    const category = item.category && categories.includes(item.category as OpportunityType) ? item.category : undefined;
    return [{ key: item.key.slice(0, 80), name: item.name.slice(0, 150), url: item.url, country: item.country?.slice(0, 100), category, attribution: item.attribution.slice(0, 150), redistributionPermitted: true, enabled: true }];
  });
}
