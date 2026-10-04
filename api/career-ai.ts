type RequestShape = {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
};

type ResponseShape = {
  setHeader(name: string, value: string): void;
  status(code: number): ResponseShape;
  json(body: unknown): void;
};

type ChatItem = { role: 'user' | 'model'; parts: { text: string }[] };

const environment = (
  globalThis as typeof globalThis & {
    process?: { env?: Record<string, string | undefined> };
  }
).process?.env ?? {};

const requestBuckets = new Map<string, { startedAt: number; count: number }>();
const REQUEST_LIMIT = 12;
const WINDOW_MS = 60_000;
const MAX_PROMPT_LENGTH = 8_000;
const MAX_HISTORY_MESSAGES = 8;
const MAX_HISTORY_MESSAGE_LENGTH = 3_000;

function headerValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function responseError(res: ResponseShape, status: number, message: string): void {
  res.status(status).json({ error: { message } });
}

function allowRequest(origin: string | undefined): boolean {
  if (!origin) return true;
  return new Set([
    'https://careerlaunch-eight.vercel.app',
    'http://localhost:5173',
  ]).has(origin);
}

export default async function handler(req: RequestShape, res: ResponseShape): Promise<void> {
  res.setHeader('Cache-Control', 'no-store');

  const origin = headerValue(req.headers.origin);
  if (!allowRequest(origin)) {
    responseError(res, 403, 'This origin is not allowed.');
    return;
  }
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  }
  if (req.method === 'OPTIONS') {
    res.status(204).json({});
    return;
  }
  if (req.method !== 'POST') {
    responseError(res, 405, 'Use POST to send a message.');
    return;
  }

  const authorization = headerValue(req.headers.authorization);
  const accessToken = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  const supabaseUrl = environment.VITE_SUPABASE_URL;
  const supabaseKey = environment.VITE_SUPABASE_PUBLISHABLE_KEY || environment.VITE_SUPABASE_ANON_KEY;
  const geminiApiKey = environment.GEMINI_API_KEY;

  if (!supabaseUrl || !supabaseKey) {
    responseError(res, 503, 'The server authentication settings are incomplete.');
    return;
  }
  if (!accessToken) {
    responseError(res, 401, 'Sign in to use CareerLaunch AI.');
    return;
  }

  try {
    const authResponse = await fetch(`${supabaseUrl.replace(/\/$/, '')}/auth/v1/user`, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!authResponse.ok) {
      responseError(res, 401, 'Your sign-in session is invalid or expired. Sign in again.');
      return;
    }

    const user = await authResponse.json() as { id?: string };
    if (!user.id) {
      responseError(res, 401, 'Sign in to use CareerLaunch AI.');
      return;
    }

    const now = Date.now();
    const bucket = requestBuckets.get(user.id);
    if (bucket && now - bucket.startedAt < WINDOW_MS && bucket.count >= REQUEST_LIMIT) {
      responseError(res, 429, 'You have sent several messages recently. Wait a minute and try again.');
      return;
    }
    if (!bucket || now - bucket.startedAt >= WINDOW_MS) {
      requestBuckets.set(user.id, { startedAt: now, count: 1 });
    } else {
      bucket.count += 1;
    }

    if (!geminiApiKey) {
      responseError(res, 503, 'CareerLaunch AI needs its Gemini API key configured on the server.');
      return;
    }

    const body = (req.body && typeof req.body === 'object' ? req.body : {}) as {
      prompt?: unknown;
      history?: unknown;
      task?: unknown;
      userContext?: unknown;
    };
    const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
    if (!prompt || prompt.length > MAX_PROMPT_LENGTH) {
      responseError(res, 400, `Enter a message of up to ${MAX_PROMPT_LENGTH} characters.`);
      return;
    }

    const rawHistory = Array.isArray(body.history) ? body.history : [];
    const history: ChatItem[] = rawHistory
      .slice(-MAX_HISTORY_MESSAGES)
      .flatMap((item): ChatItem[] => {
        if (!item || typeof item !== 'object') return [];
        const message = item as { role?: unknown; content?: unknown };
        if (
          (message.role !== 'user' && message.role !== 'assistant') ||
          typeof message.content !== 'string' ||
          !message.content.trim()
        ) return [];
        return [{
          role: message.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: message.content.slice(0, MAX_HISTORY_MESSAGE_LENGTH) }],
        }];
      });

    const userContext = (body.userContext && typeof body.userContext === 'object' ? body.userContext : {}) as {
      headline?: unknown;
      skills?: unknown;
    };
    const headline = typeof userContext.headline === 'string' ? userContext.headline.slice(0, 300) : '';
    const skills = Array.isArray(userContext.skills)
      ? userContext.skills.filter((skill): skill is string => typeof skill === 'string').slice(0, 30).map(skill => skill.slice(0, 80))
      : [];
    const task = typeof body.task === 'string' ? body.task.slice(0, 80) : 'general career mentorship';

    const systemInstruction = [
      'You are CareerLaunch AI, a practical and supportive career coach for students, graduates, freelancers, and job seekers in Kenya and across Africa.',
      'Give concise, specific, actionable advice. Never invent job openings, employer requirements, salary figures, deadlines, or current market facts. You do not have live web access; say so when asked for current listings or changing facts, and direct the user to verify with the employer.',
      `Requested focus: ${task}.`,
      headline ? `User career headline: ${headline}.` : '',
      skills.length ? `User skills: ${skills.join(', ')}.` : '',
    ].filter(Boolean).join('\n');

    const geminiResponse = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': geminiApiKey,
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents: [
            ...history,
            { role: 'user', parts: [{ text: prompt }] },
          ],
          generationConfig: { maxOutputTokens: 900, temperature: 0.6 },
        }),
      }
    );

    const result = await geminiResponse.json() as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      error?: { message?: string };
    };
    if (!geminiResponse.ok) {
      responseError(res, 502, result.error?.message || 'The AI provider could not complete the request.');
      return;
    }

    const text = result.candidates?.[0]?.content?.parts
      ?.map(part => part.text || '')
      .join('')
      .trim();
    if (!text) {
      responseError(res, 502, 'The AI did not return a text response. Please try again.');
      return;
    }

    res.status(200).json({ success: true, content: text, isConfigured: true });
  } catch {
    responseError(res, 502, 'CareerLaunch AI could not be reached. Please try again shortly.');
  }
}
