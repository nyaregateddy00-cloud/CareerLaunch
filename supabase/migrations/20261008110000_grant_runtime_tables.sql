-- Make browser access explicit; row-level security remains the authorization layer.
GRANT SELECT, INSERT, UPDATE, DELETE ON public.opportunity_sources TO authenticated;
GRANT ALL ON public.opportunity_sources TO service_role;

GRANT SELECT ON public.opportunity_sync_runs TO authenticated;
GRANT ALL ON public.opportunity_sync_runs TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.saved_opportunity_searches TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_playbook_progress TO authenticated;

GRANT SELECT ON public.playbooks TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.playbooks TO authenticated;
