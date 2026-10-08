import { ExperienceLevel, Opportunity, WorkMode, UserProfile } from '../types';
import { isDevelopmentDemoMode, isSupabaseConfigured, supabase } from './supabase';
import { mockStorage } from './mockStorage';

const OPPORTUNITIES_CACHE_TTL = 30_000;
const OPPORTUNITIES_PAGE_SIZE = 500;
let publishedOpportunitiesCache: Opportunity[] | null = null;
let publishedOpportunitiesExpiresAt = 0;
let publishedOpportunitiesRequest: Promise<Opportunity[]> | null = null;
let adminOpportunitiesCache: Opportunity[] | null = null;
let adminOpportunitiesExpiresAt = 0;
let adminOpportunitiesRequest: Promise<Opportunity[]> | null = null;

type OpportunityRow = Record<string, any>;

function mapOpportunityRow(row: OpportunityRow): Opportunity {
  return {
    id: String(row.id),
    title: String(row.title ?? ''),
    company: String(row.company ?? ''),
    companyLogo: row.company_logo ?? undefined,
    location: String(row.location ?? ''),
    country: String(row.country ?? 'Kenya'),
    type: row.type as Opportunity['type'],
    workMode: (row.work_mode ?? null) as WorkMode | null,
    experienceLevel: (row.experience_level ?? 'Entry Level') as ExperienceLevel,
    salaryRange: row.salary_range ?? undefined,
    currency: (row.currency ?? 'KES') as Opportunity['currency'],
    deadline: row.deadline ?? undefined,
    description: String(row.description ?? ''),
    requirements: Array.isArray(row.requirements) ? row.requirements : [],
    tags: Array.isArray(row.tags) ? row.tags : [],
    applicationUrl: row.application_url ?? undefined,
    contactEmail: row.contact_email ?? undefined,
    source: row.source ?? 'Employer listing',
    status: row.status as Opportunity['status'],
    createdAt: String(row.created_at ?? new Date().toISOString()),
    updatedAt: row.updated_at ? String(row.updated_at) : undefined,
    sourceUrl: row.source_url ?? undefined,
    sourceAttributions: Array.isArray(row.source_attributions) ? row.source_attributions : [],
    discoveredAt: row.discovered_at ?? undefined,
    postedAt: row.posted_at ?? undefined,
    descriptionSummary: row.description_summary ?? undefined,
    lastCheckedAt: row.last_checked_at ?? undefined,
    verificationStatus: row.verification_status ?? undefined,
    qualityScore: typeof row.quality_score === 'number' ? row.quality_score : undefined,
    aiProcessedAt: row.ai_processed_at ?? undefined,
    whyThisMatters: row.why_this_matters ?? undefined,
    reviewNote: row.review_note ?? undefined,
    educationRequirements: Array.isArray(row.education_requirements) ? row.education_requirements : [],
    isRolling: Boolean(row.is_rolling),
    region: row.region ?? undefined,
    employmentType: row.employment_type ?? undefined,
    salaryMin: typeof row.salary_min === 'number' ? row.salary_min : undefined,
    salaryMax: typeof row.salary_max === 'number' ? row.salary_max : undefined,
  };
}

function toOpportunityRow(opportunity: Opportunity): OpportunityRow {
  const row: OpportunityRow = {
    title: opportunity.title,
    company: opportunity.company,
    company_logo: opportunity.companyLogo ?? null,
    location: opportunity.location,
    country: opportunity.country,
    type: opportunity.type,
    work_mode: opportunity.workMode,
    experience_level: opportunity.experienceLevel,
    salary_range: opportunity.salaryRange ?? null,
    currency: opportunity.currency,
    deadline: opportunity.deadline ?? null,
    description: opportunity.description,
    requirements: opportunity.requirements,
    tags: opportunity.tags,
    application_url: opportunity.applicationUrl ?? null,
    contact_email: opportunity.contactEmail ?? null,
    source: opportunity.source,
    status: opportunity.status,
  };
  if (opportunity.updatedAt !== undefined) row.updated_at = opportunity.updatedAt;
  if (opportunity.sourceUrl !== undefined) row.source_url = opportunity.sourceUrl;
  if (opportunity.sourceAttributions !== undefined) row.source_attributions = opportunity.sourceAttributions;
  if (opportunity.discoveredAt !== undefined) row.discovered_at = opportunity.discoveredAt;
  if (opportunity.postedAt !== undefined) row.posted_at = opportunity.postedAt;
  if (opportunity.descriptionSummary !== undefined) row.description_summary = opportunity.descriptionSummary;
  if (opportunity.lastCheckedAt !== undefined) row.last_checked_at = opportunity.lastCheckedAt;
  if (opportunity.verificationStatus !== undefined) row.verification_status = opportunity.verificationStatus;
  if (opportunity.qualityScore !== undefined) row.quality_score = opportunity.qualityScore;
  if (opportunity.aiProcessedAt !== undefined) row.ai_processed_at = opportunity.aiProcessedAt;
  if (opportunity.whyThisMatters !== undefined) row.why_this_matters = opportunity.whyThisMatters;
  if (opportunity.reviewNote !== undefined) row.review_note = opportunity.reviewNote;
  if (opportunity.educationRequirements !== undefined) row.education_requirements = opportunity.educationRequirements;
  if (opportunity.isRolling !== undefined) row.is_rolling = opportunity.isRolling;
  if (opportunity.region !== undefined) row.region = opportunity.region;
  if (opportunity.employmentType !== undefined) row.employment_type = opportunity.employmentType;
  if (opportunity.salaryMin !== undefined) row.salary_min = opportunity.salaryMin;
  if (opportunity.salaryMax !== undefined) row.salary_max = opportunity.salaryMax;
  // New browser-demo IDs are not UUIDs; let PostgreSQL generate a valid id.
  if (!/^opp-\d+$/.test(opportunity.id)) row.id = opportunity.id;
  return row;
}

function keepOpenListings(opportunities: Opportunity[]): Opportunity[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return opportunities.filter((opportunity) =>
    opportunity.status === 'published' &&
    (!opportunity.deadline || new Date(`${opportunity.deadline}T00:00:00`).getTime() >= today.getTime())
  );
}

/** Return cached data, including stale data, so route changes can render immediately. */
export function getCachedPublishedOpportunities(): Opportunity[] | null {
  return publishedOpportunitiesCache;
}

/** Mark cached results stale without discarding them; consumers can keep rendering them. */
export function invalidatePublishedOpportunitiesCache(): void {
  publishedOpportunitiesExpiresAt = 0;
}

async function fetchAllOpportunityRows(publishedOnly: boolean): Promise<Opportunity[]> {
  const rows: OpportunityRow[] = [];
  for (let start = 0; ; start += OPPORTUNITIES_PAGE_SIZE) {
    let query = supabase.from('opportunities').select('*').order('created_at', { ascending: false });
    if (publishedOnly) query = query.eq('status', 'published');
    const { data, error } = await query.range(start, start + OPPORTUNITIES_PAGE_SIZE - 1);
    if (error) throw error;
    const batch = (data ?? []) as OpportunityRow[];
    rows.push(...batch);
    if (batch.length < OPPORTUNITIES_PAGE_SIZE) break;
  }
  return rows.map(mapOpportunityRow);
}

/** Returns every open, published listing, paging through the complete Supabase result set. */
export async function getPublishedOpportunities(): Promise<Opportunity[]> {
  if (!isSupabaseConfigured) {
    if (isDevelopmentDemoMode) return keepOpenListings(mockStorage.getOpportunities());
    throw new Error('Opportunity listings are unavailable because Supabase is not configured.');
  }
  if (publishedOpportunitiesCache && Date.now() < publishedOpportunitiesExpiresAt) return publishedOpportunitiesCache;
  if (publishedOpportunitiesRequest) return publishedOpportunitiesRequest;

  publishedOpportunitiesRequest = (async () => {
    const opportunities = keepOpenListings(await fetchAllOpportunityRows(true));
    publishedOpportunitiesCache = opportunities;
    publishedOpportunitiesExpiresAt = Date.now() + OPPORTUNITIES_CACHE_TTL;
    return opportunities;
  })().finally(() => { publishedOpportunitiesRequest = null; });
  return publishedOpportunitiesRequest;
}

/** Admin listing source; demo mode keeps using the existing browser-backed storage. */
export async function getAdminOpportunities(): Promise<Opportunity[]> {
  if (!isSupabaseConfigured) {
    if (isDevelopmentDemoMode) return mockStorage.getOpportunities();
    throw new Error('Opportunity management requires Supabase configuration.');
  }
  if (adminOpportunitiesCache && Date.now() < adminOpportunitiesExpiresAt) return adminOpportunitiesCache;
  if (adminOpportunitiesRequest) return adminOpportunitiesRequest;
  adminOpportunitiesRequest = fetchAllOpportunityRows(false)
    .then((items) => {
      adminOpportunitiesCache = items;
      adminOpportunitiesExpiresAt = Date.now() + OPPORTUNITIES_CACHE_TTL;
      return items;
    })
    .finally(() => { adminOpportunitiesRequest = null; });
  return adminOpportunitiesRequest;
}

function invalidateAdminOpportunitiesCache(): void {
  adminOpportunitiesExpiresAt = 0;
}

/** Persist admin postings centrally so every user sees the same published catalog. */
export async function saveOpportunity(opportunity: Opportunity): Promise<Opportunity> {
  if (!isSupabaseConfigured && isDevelopmentDemoMode) {
    mockStorage.saveOpportunity(opportunity);
    return opportunity;
  }
  if (!isSupabaseConfigured) throw new Error('Saving opportunities requires Supabase configuration.');
  const { data, error } = await supabase.from('opportunities').upsert(toOpportunityRow(opportunity)).select('*').single();
  if (error) throw error;
  invalidatePublishedOpportunitiesCache();
  invalidateAdminOpportunitiesCache();
  return mapOpportunityRow(data as OpportunityRow);
}

export async function deleteOpportunity(id: string): Promise<void> {
  if (!isSupabaseConfigured && isDevelopmentDemoMode) {
    mockStorage.deleteOpportunity(id);
    return;
  }
  if (!isSupabaseConfigured) throw new Error('Deleting opportunities requires Supabase configuration.');
  const { error } = await supabase.from('opportunities').delete().eq('id', id);
  if (error) throw error;
  invalidatePublishedOpportunitiesCache();
  invalidateAdminOpportunitiesCache();
}

export interface OpportunityMatch {
  score: number;
  matchedSkills: string[];
  explanation: string;
  potentialGaps: string[];
  breakdown: { skills: number; careerFocus: number; location: number };
}

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9+#.]+/g, ' ').trim();

/** Lightweight, explainable matching from a user's saved skills, profile, and location. */
export function matchOpportunityToProfile(opportunity: Opportunity, user: UserProfile | null): OpportunityMatch | null {
  if (!user) return null;
  const skills = mockStorage.getUserSkills().filter((skill) => skill.userId === user.id);
  const experience = mockStorage.getExperience().filter((item) => item.userId === user.id);
  const education = mockStorage.getEducation().filter((item) => item.userId === user.id);
  const roleText = normalize([
    user.headline,
    user.bio,
    ...experience.flatMap((item) => [item.position, item.description]),
    ...education.map((item) => `${item.degree} ${item.fieldOfStudy}`),
  ].join(' '));
  const listingText = normalize([
    opportunity.title,
    opportunity.description,
    ...opportunity.tags,
    ...opportunity.requirements,
  ].join(' '));
  const signalsAvailable = skills.length > 0 || roleText.length > 0 || Boolean(user.location);
  if (!signalsAvailable) return null;

  const matchedSkills = skills
    .map((skill) => skill.skillName.trim())
    .filter((skill) => skill.length > 1 && listingText.includes(normalize(skill)));
  const skillScore = skills.length ? (matchedSkills.length / skills.length) * 60 : 0;
  const roleTerms = roleText.split(' ').filter((term) => term.length > 3);
  const uniqueRoleTerms = [...new Set(roleTerms)];
  const roleHits = uniqueRoleTerms.filter((term) => listingText.includes(term)).length;
  const roleScore = uniqueRoleTerms.length ? Math.min(roleHits / Math.min(uniqueRoleTerms.length, 8), 1) * 25 : 0;
  const userLocation = normalize(user.location);
  const listingLocation = normalize(`${opportunity.location} ${opportunity.country}`);
  const locationScore = !userLocation || opportunity.workMode === 'Remote' || /remote|anywhere|global/.test(listingLocation)
    ? 15
    : listingLocation.includes(userLocation) || userLocation.includes(listingLocation) ? 15 : 0;
  // Keep the denominator fixed so an incomplete profile cannot receive an
  // inflated match percentage from a single available signal (for example,
  // location alone). The visible score reflects all three match dimensions.
  const earned = skillScore + roleScore + (user.location ? locationScore : 0);
  const potentialGaps = opportunity.requirements
    .filter((requirement) => requirement.length > 4 && !roleText.includes(normalize(requirement)) && !matchedSkills.some((skill) => normalize(requirement).includes(normalize(skill))))
    .slice(0, 3);
  const explanation = matchedSkills.length
    ? `Related skills in your profile: ${matchedSkills.slice(0, 3).join(', ')}.`
    : roleScore > 0
      ? 'The role overlaps with your saved headline, education, or experience.'
      : user.location && locationScore > 0
        ? 'The listing location or work mode fits the location in your profile.'
        : 'Add more skills and career details to improve this estimate.';
  return {
    score: Math.max(0, Math.min(100, Math.round(earned))),
    matchedSkills,
    explanation,
    potentialGaps,
    breakdown: { skills: Math.round(skillScore), careerFocus: Math.round(roleScore), location: user.location ? Math.round(locationScore) : 0 },
  };
}

export function rankOpportunitiesForProfile(opportunities: Opportunity[], user: UserProfile | null): Opportunity[] {
  if (!user) return opportunities;
  return opportunities
    .map((opportunity, index) => ({ opportunity, index, score: matchOpportunityToProfile(opportunity, user)?.score ?? 0 }))
    .sort((left, right) => right.score - left.score || left.index - right.index)
    .map(({ opportunity }) => opportunity);
}
