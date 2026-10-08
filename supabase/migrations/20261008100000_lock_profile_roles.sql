-- Prevent users from assigning themselves privileged profile roles.
-- Normal signup may insert a non-admin role; only a trusted service-role
-- request may insert an admin profile or change an existing role.
CREATE OR REPLACE FUNCTION public.prevent_profile_role_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = pg_catalog, public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.role = 'admin' AND auth.role() IS DISTINCT FROM 'service_role' THEN
      RAISE EXCEPTION 'Administrator profiles can only be created by a trusted server administrator';
    END IF;
  ELSIF NEW.role IS DISTINCT FROM OLD.role AND auth.role() IS DISTINCT FROM 'service_role' THEN
    RAISE EXCEPTION 'Profile roles can only be changed by a trusted server administrator';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_profile_role_change ON public.profiles;
CREATE TRIGGER prevent_profile_role_change
  BEFORE INSERT OR UPDATE OF role ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_profile_role_change();
