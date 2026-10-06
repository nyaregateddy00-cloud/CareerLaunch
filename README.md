# CareerLaunch

CareerLaunch is a React, TypeScript, and Vite career workspace for early-career professionals. It includes profile, CV, portfolio, skills, opportunity, and application-tracking interfaces.

## Local development

1. Install Node.js (LTS).
2. Copy `.env.example` to `.env` and fill in the Supabase project URL and publishable/anon key.
3. Run `npm install`, then `npm run dev`.
4. Run `npm run build` before deploying.

Without Supabase configuration the app uses local preview data. Demo passwords are not verified or stored. The local workspace is not synchronized between devices.

## Supabase and Google sign-in

The login and registration screens include Google OAuth through Supabase Auth. To enable it for real users:

1. Create a Google OAuth 2.0 Web application client in [Google Cloud Console](https://console.cloud.google.com/apis/credentials). See the [Supabase Google provider guide](https://supabase.com/docs/guides/auth/social-login/auth-google).
2. In Supabase, open **Authentication → Providers → Google**, enable the provider, and add the Google client ID and client secret.
3. Copy the Supabase callback URL displayed on that provider settings page into the Google client's **Authorized redirect URIs**. It normally follows `https://<project-ref>.supabase.co/auth/v1/callback`; use the exact URL Supabase displays.
4. In Supabase **Authentication → URL Configuration**, set the site URL and allow the dashboard callback for local development (`http://localhost:5173/dashboard`) and your deployed app (`https://your-domain/dashboard`). Add any other exact return URLs you use.
5. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` (or `VITE_SUPABASE_ANON_KEY`) in the local and deployment environments. Never put the Google client secret or an AI provider secret in a `VITE_` variable.
6. Apply `supabase/schema.sql` to a new Supabase project before allowing sign-ups. For an existing project, apply only the reviewed files under `supabase/migrations/` in timestamp order. They enable safe public portfolio reads, expanded opportunity types, community discussions/moderation, and typed workspace tables/RPCs. Do not blindly rerun the base schema on a live project.

Google OAuth creates accounts with the default `job_seeker` role. Email/password registration also supports the listed early-career roles. Role selection for Google-created accounts should be completed in a future onboarding step.

## AI service

The Vercel function at `/api/career-ai` verifies the signed-in Supabase session, enforces an atomic per-user quota of 12 requests per minute through Supabase, and proxies to either an OpenAI-compatible chat endpoint (`CAREER_AI_API_URL`, `CAREER_AI_API_KEY`, `CAREER_AI_MODEL`) or the existing Gemini provider (`GEMINI_API_KEY`, optional `GEMINI_MODEL`). Apply the latest Supabase migration for quota enforcement. Configure secrets as server-side Vercel environment variables. Never prefix a provider key with `VITE_`. Without a provider key, the app reports that AI is unavailable. Users can opt in to sending saved career context in **Settings**; the prompt and answer entered for a requested AI task are sent to the configured provider.

## Current deployment limitations

- User profile, applications, saved opportunities, skills, education, experience, projects, certifications, CV, portfolio, notifications, learning progress, interview sessions, preferences, and career goals have owner-scoped relational persistence after the normalized workspace migration is applied. The app continues to mirror these records in the private `workspace_snapshots` table as a backward-compatible recovery copy while older clients are phased out.
- Opportunity listings are records entered by administrators; no external job feed or automatic verification pipeline is configured. Check each listing with its original publisher.
- Public portfolio reads use the `get_public_portfolio` RPC. Apply its migration before enabling portfolios; owners choose which profile sections and featured projects are public.
- Community posts/replies require the community foundation migration; reporting and admin hide actions require the later moderation migration. Community text is visible only to signed-in users, and report records are private to their reporter and admins.
- Pricing is a non-purchasable preview. Subscriptions, checkout, SMS/email delivery, and payment integrations are not enabled. Notification preferences can be saved, but delivery services must be configured separately.
- Google OAuth requires the external Google Cloud and Supabase settings above; code alone cannot provision OAuth credentials or change those dashboards.
