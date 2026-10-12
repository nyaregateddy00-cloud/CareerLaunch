# CareerLaunch

CareerLaunch is a React, TypeScript, and Vite career workspace for early-career professionals. It includes profile, CV, portfolio, skills, opportunity, and application-tracking interfaces.

## Local development

1. Install Node.js (LTS).
2. Copy `.env.example` to `.env` and fill in the Supabase project URL and publishable/anon key.
3. Run `npm install`, then `npm run dev`.
4. Run `npm run build` before deploying.

Without Supabase configuration the app uses a clearly labeled local demo mode. Demo passwords are not verified or stored. Most career records currently use browser storage and are not synchronized between devices.

## Supabase and Google sign-in

The login and registration screens include Google OAuth through Supabase Auth. To enable it for real users:

1. Create a Google OAuth 2.0 Web application client in [Google Cloud Console](https://console.cloud.google.com/apis/credentials). See the [Supabase Google provider guide](https://supabase.com/docs/guides/auth/social-login/auth-google).
2. In Supabase, open **Authentication → Providers → Google**, enable the provider, and add the Google client ID and client secret.
3. Copy the Supabase callback URL displayed on that provider settings page into the Google client's **Authorized redirect URIs**. It normally follows `https://<project-ref>.supabase.co/auth/v1/callback`; use the exact URL Supabase displays.
4. In Supabase **Authentication → URL Configuration**, set the site URL and allow the dashboard callback for local development (`http://localhost:5173/dashboard`) and your deployed app (`https://your-domain/dashboard`). Add any other exact return URLs you use.
5. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` (or `VITE_SUPABASE_ANON_KEY`) in the local and deployment environments. Never put the Google client secret or an AI provider secret in a `VITE_` variable.
6. Apply `supabase/schema.sql` to the Supabase project before allowing sign-ups. On an existing project, review and apply it as a migration; do not blindly rerun a schema containing non-idempotent policy creation statements.

Google OAuth creates accounts with the default `job_seeker` role. Email/password registration also supports the listed early-career roles. Role selection for Google-created accounts should be completed in a future onboarding step.

## AI service

The AI interface calls `VITE_AI_API_URL`, which must point to a secured server-side endpoint. Configure provider credentials on that server only. Without the endpoint, the UI should show that AI is unavailable.

## Current deployment limitations

- User profiles use Supabase when configured. Applications, saved opportunities, CVs, skills, projects, portfolio settings, and notifications use a browser cache backed by the private `workspace_snapshots` Supabase table. This is a transitional JSON snapshot, not normalized per-table CRUD, and requires the updated schema to be applied.
- The opportunity catalog and resources include sample content. Verify any listing directly with its source before applying; no live feed or verification pipeline is configured.
- Pricing is a non-purchasable preview. Subscriptions, checkout, SMS/email alerts, and payment integrations are not enabled.
- Google OAuth requires the external Google Cloud and Supabase settings above; code alone cannot provision OAuth credentials or change those dashboards.
