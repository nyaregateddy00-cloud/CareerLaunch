# CareerLaunch

CareerLaunch is a React, TypeScript, and Vite career workspace for early-career professionals. It includes profile, CV, portfolio, skills, opportunity, and application-tracking interfaces.

## Local development

1. Install Node.js (LTS).
2. Copy `.env.example` to `.env.local` and fill in the Supabase project URL and publishable key (or the legacy anon key, not both placeholders).
3. Run `npm install`, then `npm run dev`.
4. Run `npm run build` before deploying.

Without Supabase configuration the app uses local preview data only during local development. Demo passwords are not verified or stored, and demo data is not synchronized between devices. Production builds fail closed for account creation and sign-in when Supabase is not configured.

## Supabase and Google sign-in

The login and registration screens include Google OAuth through Supabase Auth. To enable it for real users:

1. Create a Google OAuth 2.0 Web application client in [Google Cloud Console](https://console.cloud.google.com/apis/credentials). See the [Supabase Google provider guide](https://supabase.com/docs/guides/auth/social-login/auth-google).
2. In Supabase, open **Authentication → Providers → Google**, enable the provider, and add the Google client ID and client secret.
3. Copy the Supabase callback URL displayed on that provider settings page into the Google client's **Authorized redirect URIs**. It normally follows `https://<project-ref>.supabase.co/auth/v1/callback`; use the exact URL Supabase displays.
4. In Supabase **Authentication → URL Configuration**, set the site URL and allow the dashboard callback for local development (`http://localhost:5173/dashboard`) and your deployed app (`https://your-domain/dashboard`). Add any other exact return URLs you use.
5. Set `VITE_SUPABASE_URL` and either `VITE_SUPABASE_PUBLISHABLE_KEY` or the legacy `VITE_SUPABASE_ANON_KEY` in local and Vercel environments. These are browser keys protected by RLS. Never put the Google client secret, AI provider secret, or service-role key in a `VITE_` variable.
6. Set the Supabase **Site URL** and exact allowed redirect URLs for the production domain and local development. Enable email confirmation before public launch and test the full sign-up, confirmation, sign-in, password reset, and sign-out flows. Configure a production SMTP provider for reliable confirmation and reset emails.
7. Apply `supabase/schema.sql` to a new Supabase project before allowing sign-ups. For an existing project, apply only migrations that are still pending, in timestamp order. Never blindly rerun the base schema on a live project. The current migration set is listed below.
8. Set Vercel's production `VITE_SUPABASE_URL` and publishable key, then redeploy; Vite embeds these values at build time. Add the server-only `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` only if using trusted API endpoints that need them. Keep the service-role key server-side.

The opportunity-intelligence migration also creates the shared-playbook and alert tables. The role-hardening migration installs a database trigger that prevents users from granting themselves admin privileges; apply it to existing projects before public launch. After the intended admin account exists, apply the admin-role migration to grant admin access.

Migrations, in order:

```text
supabase/migrations/20261006090000_public_portfolio_rpc.sql
supabase/migrations/20261006100000_expand_opportunity_types.sql
supabase/migrations/20261006110000_community_foundation.sql
supabase/migrations/20261006130000_community_moderation.sql
supabase/migrations/20261006140000_public_portfolio_project_allowlist.sql
supabase/migrations/20261006150000_normalized_workspace_core.sql
supabase/migrations/20261007100000_opportunity_intelligence_playbooks.sql
supabase/migrations/20261007110000_set_careerlaunch_admin.sql
supabase/migrations/20261008100000_lock_profile_roles.sql
supabase/migrations/20261008110000_grant_runtime_tables.sql
```

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
# Opportunity Intelligence and Career Playbooks

CareerLaunch keeps the existing `opportunities` table and public/admin opportunity pages. The new migration adds source lineage, a deduplication fingerprint, review status, quality metadata, saved searches, playbook progress, source configuration, and sync-run records:

```text
supabase/migrations/20261007100000_opportunity_intelligence_playbooks.sql
```

Apply the migration to the existing Supabase project before enabling account-synced playbook progress, saved searches, verification metadata, or the scheduled feed sync. Existing opportunity IDs and application references are retained. New source-fed listings are saved as `draft` and require administrator review before publication. Publishing a listing emits an in-app notification to users whose saved searches match. Email and push delivery are not configured.

## Opportunity feed sync

The server-only endpoint is `GET/POST /api/opportunities/sync`. It supports RSS and Atom feeds through a source adapter, limits each feed to 100 entries and 2 MB, rejects non-HTTPS/private-host feed URLs, uses source ID plus a normalized title/organization/location/deadline fingerprint for deduplication, and isolates failures by source. It expires published dated listings while retaining their records. It does not scrape job boards or bypass access controls.

Configure these server-side variables in Vercel (never use the `VITE_` prefix for secrets):

* `SUPABASE_URL` (or the existing `VITE_SUPABASE_URL`) and `SUPABASE_SERVICE_ROLE_KEY` for the trusted ingestion job.
* `CRON_SECRET` to authorize Vercel's daily 06:00 UTC schedule. The endpoint also accepts `OPPORTUNITY_SYNC_SECRET` for a manual authenticated POST; the two values may be the same.
* `OPPORTUNITY_FEEDS_JSON` as a JSON array of permitted feeds. Each object requires `key`, `name`, `url`, `attribution`, and `redistributionPermitted: true`; `country`, `category`, and `enabled` are optional. Do not configure a feed unless its terms permit automated retrieval and display, and only set a country when that scope is explicit.
* Optional `OPPORTUNITY_AI_ENRICH_LIMIT` (default `0`, maximum `5`) to cap server-side AI enrichment per sync. AI output is separately labelled and does not verify a listing. It uses the existing `CAREER_AI_*` or `GEMINI_*` provider configuration.

No live opportunity source is configured by default. With `OPPORTUNITY_FEEDS_JSON` unset or `[]`, the endpoint reports `liveSourcesConfigured: false`; existing manually managed listings continue to work. A Vercel schedule can be enabled after secrets, the Supabase migration, and at least one permitted source are configured.

## Career Playbooks

The 25 authored, task-based journeys are defined in `src/data/playbooks.ts` and served at `/playbooks` and `/playbooks/:slug` inside the existing authenticated application shell. Progress is stored per user in `user_playbook_progress` (with a browser-local fallback if Supabase is unavailable). “Personalize with CareerLaunch AI” is an explicit, user-initiated call to the existing authenticated `/api/career-ai` endpoint; the user's saved skills and education are sent only for that request. Opportunity links reuse the existing catalog and application tracker.
