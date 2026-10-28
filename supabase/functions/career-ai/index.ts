import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const taskGuidance: Record<string, string> = {
  improve_cv: 'Improve the user-provided CV wording. Preserve facts and never invent qualifications, employers, dates, or outcomes.',
  cover_letter: 'Help draft a role-specific cover letter using only facts the user provides. Clearly mark any missing details with placeholders.',
  interview_prep: 'Provide practical interview practice, ask one focused question at a time when simulating, and give constructive feedback grounded in the response.',
  career_path: 'Give a realistic, staged career plan with practical learning and portfolio steps. Distinguish general advice from verified current opportunities.',
  skill_gap: 'Compare only skills explicitly supplied by the user with their stated target role. Label unknown requirements as unknown instead of guessing.',
  general_advice: 'Give concise, practical career guidance and ask for missing context when it would materially change the advice.',
};

serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return respond({ error: 'Method not allowed.' }, 405);

  const authorization = request.headers.get('Authorization');
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
  const providerKey = Deno.env.get('GEMINI_API_KEY');
  if (!authorization || !supabaseUrl || !supabaseAnonKey) return respond({ error: 'Sign in to use CareerLaunch AI.' }, 401);
  if (!providerKey) return respond({ error: 'CareerLaunch AI is not configured yet. Please contact the platform administrator.' }, 503);

  // Verify the caller's Supabase session instead of trusting user context from the browser.
  const authResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: { apikey: supabaseAnonKey, Authorization: authorization },
  });
  if (!authResponse.ok) return respond({ error: 'Your session has expired. Sign in again to use CareerLaunch AI.' }, 401);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return respond({ error: 'Send a valid JSON request.' }, 400);
  }

  const prompt = typeof body.prompt === 'string' ? body.prompt.trim().slice(0, 6000) : '';
  if (!prompt) return respond({ error: 'Enter a message for your Career Coach.' }, 400);
  const task = typeof body.task === 'string' && taskGuidance[body.task] ? body.task : 'general_advice';
  const context = body.userContext && typeof body.userContext === 'object' ? body.userContext as Record<string, unknown> : {};
  const safeContext = [
    typeof context.headline === 'string' ? `Career headline: ${context.headline.slice(0, 200)}` : '',
    Array.isArray(context.skills) ? `Skills supplied by the user: ${context.skills.filter((skill): skill is string => typeof skill === 'string').slice(0, 30).map((skill) => skill.slice(0, 100)).join(', ')}` : '',
  ].filter(Boolean).join('\n');
  const history = Array.isArray(body.history) ? body.history.slice(-8).flatMap((item) => {
    if (!item || typeof item !== 'object') return [];
    const entry = item as Record<string, unknown>;
    if ((entry.role !== 'user' && entry.role !== 'assistant') || typeof entry.content !== 'string') return [];
    return [{ role: entry.role === 'assistant' ? 'model' : 'user', parts: [{ text: entry.content.slice(0, 4000) }] }];
  }) : [];

  const model = Deno.env.get('GEMINI_MODEL') || 'gemini-3.8-flash';
  const aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': providerKey },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: `You are CareerLaunch AI, a practical and supportive career coach for African students, graduates, job seekers, and early-career professionals. Focus on useful guidance for Kenya and Africa while welcoming global opportunities. Do not claim to have verified live data. Never invent personal facts or qualifications. ${taskGuidance[task]}${safeContext ? `\n\nUser-provided context:\n${safeContext}` : ''}` }] },
      contents: [...history, { role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.4, maxOutputTokens: 1400 },
    }),
  });

  if (!aiResponse.ok) {
    const error = await aiResponse.text();
    console.error('CareerLaunch AI provider error:', aiResponse.status, error.slice(0, 1000));
    return respond({ error: aiResponse.status === 429 ? 'CareerLaunch AI is busy. Please wait a moment and try again.' : 'CareerLaunch AI could not complete that request. Please try again.' }, aiResponse.status === 429 ? 429 : 502);
  }

  const result = await aiResponse.json();
  const content = result?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text || '').join('').trim();
  if (!content) return respond({ error: 'CareerLaunch AI did not return a response. Please try again.' }, 502);
  return respond({ content });
});

function respond(body: Record<string, string>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
