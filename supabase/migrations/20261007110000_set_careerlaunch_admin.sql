-- Promote the requested, existing account through a trusted database migration.
-- The profile role trigger remains enabled for all normal client requests.
DO $$
DECLARE role_guard_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgrelid = 'public.profiles'::regclass
      AND tgname = 'prevent_profile_role_change'
      AND NOT tgisinternal
  ) INTO role_guard_exists;

  IF role_guard_exists THEN
    ALTER TABLE public.profiles DISABLE TRIGGER prevent_profile_role_change;
  END IF;

  UPDATE public.profiles
  SET role = 'admin', updated_at = NOW()
  WHERE LOWER(email) = LOWER('nyaregat@gmail.com');

  IF role_guard_exists THEN
    ALTER TABLE public.profiles ENABLE TRIGGER prevent_profile_role_change;
  END IF;
END;
$$;
