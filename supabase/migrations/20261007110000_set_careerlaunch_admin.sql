-- Promote the requested, existing account through a trusted database migration.
-- The profile role trigger remains enabled for all normal client requests.
DO $$
BEGIN
  ALTER TABLE public.profiles DISABLE TRIGGER prevent_profile_role_change;

  UPDATE public.profiles
  SET role = 'admin', updated_at = NOW()
  WHERE LOWER(email) = LOWER('nyaregat@gmail.com');

  ALTER TABLE public.profiles ENABLE TRIGGER prevent_profile_role_change;
END;
$$;
