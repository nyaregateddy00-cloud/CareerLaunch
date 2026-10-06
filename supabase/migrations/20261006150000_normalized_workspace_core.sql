-- Typed, owner-scoped persistence for the user records currently mirrored in
-- workspace_snapshots. Existing snapshot data is retained as a recovery copy.

ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS client_key TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS follow_up_date DATE;
ALTER TABLE public.user_skills ADD COLUMN IF NOT EXISTS client_key TEXT;
ALTER TABLE public.experience ADD COLUMN IF NOT EXISTS client_key TEXT;
ALTER TABLE public.education ADD COLUMN IF NOT EXISTS client_key TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS client_key TEXT;
ALTER TABLE public.certifications ADD COLUMN IF NOT EXISTS client_key TEXT;
ALTER TABLE public.cv_documents ADD COLUMN IF NOT EXISTS client_key TEXT;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS client_key TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS applications_user_client_key_idx ON public.applications(user_id, client_key) WHERE client_key IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS user_skills_user_client_key_idx ON public.user_skills(user_id, client_key) WHERE client_key IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS experience_user_client_key_idx ON public.experience(user_id, client_key) WHERE client_key IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS education_user_client_key_idx ON public.education(user_id, client_key) WHERE client_key IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS projects_user_client_key_idx ON public.projects(user_id, client_key) WHERE client_key IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS certifications_user_client_key_idx ON public.certifications(user_id, client_key) WHERE client_key IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS cv_documents_user_client_key_idx ON public.cv_documents(user_id, client_key) WHERE client_key IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS notifications_user_client_key_idx ON public.notifications(user_id, client_key) WHERE client_key IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.user_languages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_key TEXT NOT NULL,
  name TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  proficiency TEXT NOT NULL CHECK (proficiency IN ('Basic', 'Conversational', 'Fluent', 'Native')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, client_key)
);
CREATE TABLE IF NOT EXISTS public.user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  currency TEXT NOT NULL DEFAULT 'KES' CHECK (currency IN ('KES', 'USD', 'RWF', 'NGN')),
  email_alerts BOOLEAN NOT NULL DEFAULT TRUE,
  interview_reminders BOOLEAN NOT NULL DEFAULT TRUE,
  weekly_digest BOOLEAN NOT NULL DEFAULT FALSE,
  appearance TEXT NOT NULL DEFAULT 'light' CHECK (appearance IN ('light', 'dark')),
  share_career_context BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.user_career_goals (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  target_role TEXT NOT NULL DEFAULT '',
  target_role_skills TEXT[] NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.user_resource_progress (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_id TEXT NOT NULL,
  is_saved BOOLEAN NOT NULL DEFAULT FALSE,
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY(user_id, resource_id)
);
CREATE TABLE IF NOT EXISTS public.interview_practice_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_key TEXT NOT NULL,
  question TEXT NOT NULL CHECK (char_length(question) BETWEEN 1 AND 3000),
  answer TEXT NOT NULL CHECK (char_length(answer) BETWEEN 1 AND 10000),
  feedback TEXT NOT NULL CHECK (char_length(feedback) BETWEEN 1 AND 16000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, client_key)
);
CREATE TABLE IF NOT EXISTS public.career_ai_usage_buckets (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  bucket_started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  request_count INTEGER NOT NULL DEFAULT 0 CHECK (request_count >= 0)
);
ALTER TABLE public.career_ai_usage_buckets ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.career_ai_usage_buckets FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.consume_career_ai_quota()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE uid UUID := auth.uid(); used_count INTEGER;
BEGIN
  IF uid IS NULL THEN RETURN FALSE; END IF;
  INSERT INTO public.career_ai_usage_buckets(user_id,bucket_started_at,request_count)
  VALUES(uid,NOW(),1)
  ON CONFLICT(user_id) DO UPDATE SET
    bucket_started_at = CASE WHEN public.career_ai_usage_buckets.bucket_started_at <= NOW() - INTERVAL '60 seconds' THEN NOW() ELSE public.career_ai_usage_buckets.bucket_started_at END,
    request_count = CASE WHEN public.career_ai_usage_buckets.bucket_started_at <= NOW() - INTERVAL '60 seconds' THEN 1 ELSE public.career_ai_usage_buckets.request_count + 1 END
  RETURNING request_count INTO used_count;
  RETURN used_count <= 12;
END;
$$;
REVOKE ALL ON FUNCTION public.consume_career_ai_quota() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.consume_career_ai_quota() TO authenticated;
CREATE TABLE IF NOT EXISTS public.user_workspace_migrations (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  normalized_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.user_workspace_migrations ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.user_workspace_migrations FROM anon, authenticated;

ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE public.notifications ADD CONSTRAINT notifications_type_check CHECK (type IN (
  'info', 'success', 'warning', 'opportunity', 'application', 'interview',
  'learning', 'achievement', 'community', 'system'
));

DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['user_languages','user_preferences','user_career_goals','user_resource_progress','interview_practice_sessions'] LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('DROP POLICY IF EXISTS "Owners manage their %s" ON public.%I', t, t);
    EXECUTE format('CREATE POLICY "Owners manage their %s" ON public.%I FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)', t, t);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
  END LOOP;
END $$;

-- One authenticated RPC handles a single logical collection update at a time.
-- It only accepts allow-listed collection names and maps known fields into
-- typed columns; arbitrary JSON is never stored in these tables.
CREATE OR REPLACE FUNCTION public.save_workspace_records(
  p_collection TEXT,
  p_records JSONB,
  p_deleted_keys TEXT[] DEFAULT '{}'
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE uid UUID := auth.uid();
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
  IF p_records IS NULL THEN RAISE EXCEPTION 'Records are required'; END IF;

  IF p_collection = 'careerlaunch_applications' THEN
    INSERT INTO public.applications(user_id, client_key, opportunity_id, company, position, stage, date_applied, deadline, notes, salary, job_url, interview_date, follow_up_date, updated_at)
    SELECT uid, x.id, CASE WHEN x.opportunity_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN x.opportunity_id::uuid END,
      x.company, x.position, x.stage, COALESCE(NULLIF(x.date_applied, '')::date, CURRENT_DATE), NULLIF(x.deadline, '')::date,
      x.notes, x.salary, x.job_url, NULLIF(x.interview_date, '')::timestamptz, NULLIF(x.follow_up_date, '')::date, COALESCE(NULLIF(x.updated_at, '')::timestamptz, NOW())
    FROM jsonb_to_recordset(p_records) AS x(id text, opportunity_id text, company text, position text, stage text, date_applied text, deadline text, notes text, salary text, job_url text, interview_date text, follow_up_date text, updated_at text)
    WHERE NULLIF(x.id, '') IS NOT NULL AND NULLIF(x.company, '') IS NOT NULL AND NULLIF(x.position, '') IS NOT NULL
    ON CONFLICT (user_id, client_key) WHERE client_key IS NOT NULL DO UPDATE SET
      opportunity_id=EXCLUDED.opportunity_id, company=EXCLUDED.company, position=EXCLUDED.position, stage=EXCLUDED.stage,
      date_applied=EXCLUDED.date_applied, deadline=EXCLUDED.deadline, notes=EXCLUDED.notes, salary=EXCLUDED.salary,
      job_url=EXCLUDED.job_url, interview_date=EXCLUDED.interview_date, follow_up_date=EXCLUDED.follow_up_date, updated_at=EXCLUDED.updated_at;
    DELETE FROM public.applications WHERE user_id=uid AND client_key=ANY(COALESCE(p_deleted_keys,'{}'));

  ELSIF p_collection = 'careerlaunch_user_skills' THEN
    INSERT INTO public.user_skills(user_id, client_key, skill_name, category, proficiency_level, years_of_experience)
    SELECT uid, x.id, x.skill_name, x.category, x.proficiency_level, GREATEST(COALESCE(x.years_of_experience,0),0)
    FROM jsonb_to_recordset(p_records) AS x(id text, skill_name text, category text, proficiency_level text, years_of_experience numeric)
    WHERE NULLIF(x.id,'') IS NOT NULL AND NULLIF(x.skill_name,'') IS NOT NULL AND NULLIF(x.category,'') IS NOT NULL
    ON CONFLICT (user_id, client_key) WHERE client_key IS NOT NULL DO UPDATE SET skill_name=EXCLUDED.skill_name, category=EXCLUDED.category, proficiency_level=EXCLUDED.proficiency_level, years_of_experience=EXCLUDED.years_of_experience;
    DELETE FROM public.user_skills WHERE user_id=uid AND client_key=ANY(COALESCE(p_deleted_keys,'{}'));

  ELSIF p_collection = 'careerlaunch_experience' THEN
    INSERT INTO public.experience(user_id, client_key, company, position, employment_type, location, start_date, end_date, is_current, description)
    SELECT uid, x.id, x.company, x.position, COALESCE(x.employment_type,'Full-time'), x.location, COALESCE(NULLIF(x.start_date,'')::date,CURRENT_DATE), NULLIF(x.end_date,'')::date, COALESCE(x.is_current,false), x.description
    FROM jsonb_to_recordset(p_records) AS x(id text, company text, position text, employment_type text, location text, start_date text, end_date text, is_current boolean, description text)
    WHERE NULLIF(x.id,'') IS NOT NULL AND NULLIF(x.company,'') IS NOT NULL AND NULLIF(x.position,'') IS NOT NULL
    ON CONFLICT (user_id, client_key) WHERE client_key IS NOT NULL DO UPDATE SET company=EXCLUDED.company, position=EXCLUDED.position, employment_type=EXCLUDED.employment_type, location=EXCLUDED.location, start_date=EXCLUDED.start_date, end_date=EXCLUDED.end_date, is_current=EXCLUDED.is_current, description=EXCLUDED.description;
    DELETE FROM public.experience WHERE user_id=uid AND client_key=ANY(COALESCE(p_deleted_keys,'{}'));

  ELSIF p_collection = 'careerlaunch_education' THEN
    INSERT INTO public.education(user_id, client_key, institution, degree, field_of_study, start_date, end_date, is_current, grade, description)
    SELECT uid, x.id, x.institution, x.degree, x.field_of_study, COALESCE(NULLIF(x.start_date,'')::date,CURRENT_DATE), NULLIF(x.end_date,'')::date, COALESCE(x.is_current,false), x.grade, x.description
    FROM jsonb_to_recordset(p_records) AS x(id text, institution text, degree text, field_of_study text, start_date text, end_date text, is_current boolean, grade text, description text)
    WHERE NULLIF(x.id,'') IS NOT NULL AND NULLIF(x.institution,'') IS NOT NULL AND NULLIF(x.degree,'') IS NOT NULL AND NULLIF(x.field_of_study,'') IS NOT NULL
    ON CONFLICT (user_id, client_key) WHERE client_key IS NOT NULL DO UPDATE SET institution=EXCLUDED.institution, degree=EXCLUDED.degree, field_of_study=EXCLUDED.field_of_study, start_date=EXCLUDED.start_date, end_date=EXCLUDED.end_date, is_current=EXCLUDED.is_current, grade=EXCLUDED.grade, description=EXCLUDED.description;
    DELETE FROM public.education WHERE user_id=uid AND client_key=ANY(COALESCE(p_deleted_keys,'{}'));

  ELSIF p_collection = 'careerlaunch_projects' THEN
    INSERT INTO public.projects(user_id, client_key, title, description, link, github_link, image_url, tags, is_featured)
    SELECT uid, x.id, x.title, COALESCE(x.description,''), x.link, x.github_link, x.image_url, COALESCE(x.tags,'{}'), COALESCE(x.is_featured,false)
    FROM jsonb_to_recordset(p_records) AS x(id text, title text, description text, link text, github_link text, image_url text, tags text[], is_featured boolean)
    WHERE NULLIF(x.id,'') IS NOT NULL AND NULLIF(x.title,'') IS NOT NULL
    ON CONFLICT (user_id, client_key) WHERE client_key IS NOT NULL DO UPDATE SET title=EXCLUDED.title, description=EXCLUDED.description, link=EXCLUDED.link, github_link=EXCLUDED.github_link, image_url=EXCLUDED.image_url, tags=EXCLUDED.tags, is_featured=EXCLUDED.is_featured;
    DELETE FROM public.projects WHERE user_id=uid AND client_key=ANY(COALESCE(p_deleted_keys,'{}'));

  ELSIF p_collection = 'careerlaunch_certifications' THEN
    INSERT INTO public.certifications(user_id, client_key, name, issuer, issue_date, expiry_date, credential_url)
    SELECT uid, x.id, x.name, x.issuer, COALESCE(NULLIF(x.issue_date,'')::date,CURRENT_DATE), NULLIF(x.expiry_date,'')::date, x.credential_url
    FROM jsonb_to_recordset(p_records) AS x(id text, name text, issuer text, issue_date text, expiry_date text, credential_url text)
    WHERE NULLIF(x.id,'') IS NOT NULL AND NULLIF(x.name,'') IS NOT NULL AND NULLIF(x.issuer,'') IS NOT NULL
    ON CONFLICT (user_id, client_key) WHERE client_key IS NOT NULL DO UPDATE SET name=EXCLUDED.name, issuer=EXCLUDED.issuer, issue_date=EXCLUDED.issue_date, expiry_date=EXCLUDED.expiry_date, credential_url=EXCLUDED.credential_url;
    DELETE FROM public.certifications WHERE user_id=uid AND client_key=ANY(COALESCE(p_deleted_keys,'{}'));

  ELSIF p_collection = 'careerlaunch_languages' THEN
    INSERT INTO public.user_languages(user_id, client_key, name, proficiency)
    SELECT uid, x.id, x.name, x.proficiency FROM jsonb_to_recordset(p_records) AS x(id text, name text, proficiency text)
    WHERE NULLIF(x.id,'') IS NOT NULL AND NULLIF(x.name,'') IS NOT NULL
    ON CONFLICT (user_id, client_key) DO UPDATE SET name=EXCLUDED.name, proficiency=EXCLUDED.proficiency;
    DELETE FROM public.user_languages WHERE user_id=uid AND client_key=ANY(COALESCE(p_deleted_keys,'{}'));

  ELSIF p_collection = 'careerlaunch_cv' THEN
    INSERT INTO public.cv_documents(user_id, client_key, title, template_id, content_json, is_default, updated_at)
    SELECT uid, x.id, COALESCE(x.title,'My Professional CV'), COALESCE(x.template_id,'modern-navy'), COALESCE(x.content,'{}'::jsonb), COALESCE(x.is_default,true), COALESCE(NULLIF(x.updated_at,'')::timestamptz,NOW())
    FROM jsonb_to_recordset(jsonb_build_array(p_records)) AS x(id text, title text, template_id text, content jsonb, is_default boolean, updated_at text)
    WHERE NULLIF(x.id,'') IS NOT NULL
    ON CONFLICT (user_id, client_key) WHERE client_key IS NOT NULL DO UPDATE SET title=EXCLUDED.title, template_id=EXCLUDED.template_id, content_json=EXCLUDED.content_json, is_default=EXCLUDED.is_default, updated_at=EXCLUDED.updated_at;

  ELSIF p_collection = 'careerlaunch_portfolio' THEN
    INSERT INTO public.portfolios(user_id, slug, headline, bio, theme, is_published, social_links, custom_sections, updated_at)
    SELECT uid, x.slug, x.headline, x.bio, COALESCE(x.theme,'modern-navy'), COALESCE(x.is_published,false), COALESCE(x.social_links,'{}'::jsonb),
      jsonb_build_object('featuredProjectIds',COALESCE(x.featured_project_ids,'[]'::jsonb),'publicSections',COALESCE(x.public_sections,'{}'::jsonb)), NOW()
    FROM jsonb_to_recordset(jsonb_build_array(p_records)) AS x(slug text, headline text, bio text, theme text, is_published boolean, social_links jsonb, featured_project_ids jsonb, public_sections jsonb)
    WHERE NULLIF(x.slug,'') IS NOT NULL
    ON CONFLICT (user_id) DO UPDATE SET slug=EXCLUDED.slug, headline=EXCLUDED.headline, bio=EXCLUDED.bio, theme=EXCLUDED.theme, is_published=EXCLUDED.is_published, social_links=EXCLUDED.social_links, custom_sections=EXCLUDED.custom_sections, updated_at=NOW();

  ELSIF p_collection = 'careerlaunch_notifications' THEN
    INSERT INTO public.notifications(user_id, client_key, title, message, type, is_read, action_url, created_at)
    SELECT uid, x.id, x.title, x.message, x.type, COALESCE(x.is_read,false), x.action_url, COALESCE(NULLIF(x.created_at,'')::timestamptz,NOW())
    FROM jsonb_to_recordset(p_records) AS x(id text, title text, message text, type text, is_read boolean, action_url text, created_at text)
    WHERE NULLIF(x.id,'') IS NOT NULL AND NULLIF(x.title,'') IS NOT NULL AND NULLIF(x.message,'') IS NOT NULL
    ON CONFLICT (user_id, client_key) WHERE client_key IS NOT NULL DO UPDATE SET title=EXCLUDED.title, message=EXCLUDED.message, type=EXCLUDED.type, is_read=EXCLUDED.is_read, action_url=EXCLUDED.action_url, created_at=EXCLUDED.created_at;
    DELETE FROM public.notifications WHERE user_id=uid AND client_key=ANY(COALESCE(p_deleted_keys,'{}'));

  ELSIF p_collection = 'careerlaunch_saved_opp_ids' THEN
    INSERT INTO public.saved_opportunities(user_id, opportunity_id)
    SELECT uid, value::uuid FROM jsonb_array_elements_text(p_records) AS ids(value)
    WHERE value ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    ON CONFLICT (user_id, opportunity_id) DO NOTHING;
    DELETE FROM public.saved_opportunities WHERE user_id=uid AND opportunity_id::text=ANY(COALESCE(p_deleted_keys,'{}'));

  ELSIF p_collection IN ('careerlaunch_saved_resources','careerlaunch_completed_resources') THEN
    IF p_collection = 'careerlaunch_saved_resources' THEN
      INSERT INTO public.user_resource_progress(user_id,resource_id,is_saved,is_completed)
      SELECT uid,value,true,false FROM jsonb_array_elements_text(p_records) AS ids(value)
      ON CONFLICT (user_id,resource_id) DO UPDATE SET is_saved=true, updated_at=NOW();
      UPDATE public.user_resource_progress SET is_saved=false,updated_at=NOW() WHERE user_id=uid AND resource_id=ANY(COALESCE(p_deleted_keys,'{}'));
    ELSE
      INSERT INTO public.user_resource_progress(user_id,resource_id,is_saved,is_completed)
      SELECT uid,value,false,true FROM jsonb_array_elements_text(p_records) AS ids(value)
      ON CONFLICT (user_id,resource_id) DO UPDATE SET is_completed=true, updated_at=NOW();
      UPDATE public.user_resource_progress SET is_completed=false,updated_at=NOW() WHERE user_id=uid AND resource_id=ANY(COALESCE(p_deleted_keys,'{}'));
    END IF;
    DELETE FROM public.user_resource_progress WHERE user_id=uid AND NOT is_saved AND NOT is_completed;

  ELSIF p_collection = 'careerlaunch_interview_sessions' THEN
    INSERT INTO public.interview_practice_sessions(user_id,client_key,question,answer,feedback,created_at)
    SELECT uid,x.id,x.question,x.answer,x.feedback,COALESCE(NULLIF(x.created_at,'')::timestamptz,NOW())
    FROM jsonb_to_recordset(p_records) AS x(id text,question text,answer text,feedback text,created_at text)
    WHERE NULLIF(x.id,'') IS NOT NULL AND NULLIF(x.question,'') IS NOT NULL AND NULLIF(x.answer,'') IS NOT NULL AND NULLIF(x.feedback,'') IS NOT NULL
    ON CONFLICT (user_id,client_key) DO UPDATE SET question=EXCLUDED.question,answer=EXCLUDED.answer,feedback=EXCLUDED.feedback,created_at=EXCLUDED.created_at;
    DELETE FROM public.interview_practice_sessions WHERE user_id=uid AND client_key=ANY(COALESCE(p_deleted_keys,'{}'));

  ELSIF p_collection = 'careerlaunch_preferences' THEN
    INSERT INTO public.user_preferences(user_id,currency,email_alerts,interview_reminders,weekly_digest,appearance,share_career_context,updated_at)
    SELECT uid,COALESCE(x.currency,'KES'),COALESCE(x.email_alerts,true),COALESCE(x.interview_reminders,true),COALESCE(x.weekly_digest,false),COALESCE(x.appearance,'light'),COALESCE(x.share_career_context,false),NOW()
    FROM jsonb_to_recordset(jsonb_build_array(p_records)) AS x(currency text,email_alerts boolean,interview_reminders boolean,weekly_digest boolean,appearance text,share_career_context boolean)
    ON CONFLICT (user_id) DO UPDATE SET currency=EXCLUDED.currency,email_alerts=EXCLUDED.email_alerts,interview_reminders=EXCLUDED.interview_reminders,weekly_digest=EXCLUDED.weekly_digest,appearance=EXCLUDED.appearance,share_career_context=EXCLUDED.share_career_context,updated_at=NOW();

  ELSIF p_collection IN ('careerlaunch_target_role','careerlaunch_target_role_skills') THEN
    INSERT INTO public.user_career_goals(user_id,target_role,target_role_skills)
    VALUES(uid,
      CASE WHEN p_collection='careerlaunch_target_role' THEN COALESCE(p_records #>> '{}','') ELSE '' END,
      CASE WHEN p_collection='careerlaunch_target_role_skills' THEN ARRAY(SELECT jsonb_array_elements_text(p_records)) ELSE '{}'::text[] END)
    ON CONFLICT(user_id) DO UPDATE SET
      target_role=CASE WHEN p_collection='careerlaunch_target_role' THEN EXCLUDED.target_role ELSE user_career_goals.target_role END,
      target_role_skills=CASE WHEN p_collection='careerlaunch_target_role_skills' THEN EXCLUDED.target_role_skills ELSE user_career_goals.target_role_skills END,
      updated_at=NOW();
  ELSE
    RAISE EXCEPTION 'Unsupported workspace collection';
  END IF;
  INSERT INTO public.user_workspace_migrations(user_id,normalized_at) VALUES(uid,NOW())
  ON CONFLICT(user_id) DO UPDATE SET normalized_at=NOW();
END;
$$;

REVOKE ALL ON FUNCTION public.save_workspace_records(TEXT, JSONB, TEXT[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.save_workspace_records(TEXT, JSONB, TEXT[]) TO authenticated;

CREATE OR REPLACE FUNCTION public.backfill_workspace_snapshot(p_payload JSONB)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE collection TEXT;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
  IF jsonb_typeof(p_payload) <> 'object' THEN RAISE EXCEPTION 'Workspace snapshot must be an object'; END IF;
  FOREACH collection IN ARRAY ARRAY[
    'careerlaunch_applications','careerlaunch_saved_opp_ids','careerlaunch_saved_resources',
    'careerlaunch_completed_resources','careerlaunch_target_role','careerlaunch_target_role_skills',
    'careerlaunch_interview_sessions','careerlaunch_preferences','careerlaunch_user_skills',
    'careerlaunch_experience','careerlaunch_education','careerlaunch_projects',
    'careerlaunch_certifications','careerlaunch_languages','careerlaunch_portfolio',
    'careerlaunch_cv','careerlaunch_notifications'
  ] LOOP
    IF p_payload ? collection THEN
      PERFORM public.save_workspace_records(collection,p_payload->collection,'{}');
    END IF;
  END LOOP;
  INSERT INTO public.user_workspace_migrations(user_id,normalized_at) VALUES(auth.uid(),NOW())
  ON CONFLICT(user_id) DO UPDATE SET normalized_at=NOW();
END;
$$;
REVOKE ALL ON FUNCTION public.backfill_workspace_snapshot(JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.backfill_workspace_snapshot(JSONB) TO authenticated;

CREATE OR REPLACE FUNCTION public.load_workspace_records()
RETURNS JSONB
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
  SELECT jsonb_build_object(
    '_normalized_ready', EXISTS (SELECT 1 FROM public.user_workspace_migrations WHERE user_id=auth.uid()),
    'careerlaunch_applications', COALESCE((SELECT jsonb_agg(jsonb_build_object('id',client_key,'userId',user_id,'opportunityId',opportunity_id,'company',company,'position',position,'stage',stage,'dateApplied',date_applied,'deadline',deadline,'notes',notes,'salary',salary,'jobUrl',job_url,'interviewDate',interview_date,'followUpDate',follow_up_date,'updatedAt',updated_at) ORDER BY updated_at DESC) FROM public.applications WHERE user_id=auth.uid() AND client_key IS NOT NULL),'[]'::jsonb),
    'careerlaunch_saved_opp_ids', COALESCE((SELECT jsonb_agg(opportunity_id::text) FROM public.saved_opportunities WHERE user_id=auth.uid()),'[]'::jsonb),
    'careerlaunch_user_skills', COALESCE((SELECT jsonb_agg(jsonb_build_object('id',client_key,'userId',user_id,'skillName',skill_name,'category',category,'proficiencyLevel',proficiency_level,'yearsOfExperience',years_of_experience)) FROM public.user_skills WHERE user_id=auth.uid() AND client_key IS NOT NULL),'[]'::jsonb),
    'careerlaunch_experience', COALESCE((SELECT jsonb_agg(jsonb_build_object('id',client_key,'userId',user_id,'company',company,'position',position,'employmentType',employment_type,'location',location,'startDate',start_date,'endDate',end_date,'isCurrent',is_current,'description',description)) FROM public.experience WHERE user_id=auth.uid() AND client_key IS NOT NULL),'[]'::jsonb),
    'careerlaunch_education', COALESCE((SELECT jsonb_agg(jsonb_build_object('id',client_key,'userId',user_id,'institution',institution,'degree',degree,'fieldOfStudy',field_of_study,'startDate',start_date,'endDate',end_date,'isCurrent',is_current,'grade',grade,'description',description)) FROM public.education WHERE user_id=auth.uid() AND client_key IS NOT NULL),'[]'::jsonb),
    'careerlaunch_projects', COALESCE((SELECT jsonb_agg(jsonb_build_object('id',client_key,'userId',user_id,'title',title,'description',description,'link',link,'githubLink',github_link,'imageUrl',image_url,'tags',tags,'isFeatured',is_featured)) FROM public.projects WHERE user_id=auth.uid() AND client_key IS NOT NULL),'[]'::jsonb),
    'careerlaunch_certifications', COALESCE((SELECT jsonb_agg(jsonb_build_object('id',client_key,'userId',user_id,'name',name,'issuer',issuer,'issueDate',issue_date,'expiryDate',expiry_date,'credentialUrl',credential_url)) FROM public.certifications WHERE user_id=auth.uid() AND client_key IS NOT NULL),'[]'::jsonb),
    'careerlaunch_languages', COALESCE((SELECT jsonb_agg(jsonb_build_object('id',client_key,'userId',user_id,'name',name,'proficiency',proficiency)) FROM public.user_languages WHERE user_id=auth.uid()),'[]'::jsonb),
    'careerlaunch_cv', COALESCE((SELECT jsonb_build_object('id',client_key,'userId',user_id,'title',title,'templateId',template_id,'content',content_json,'isDefault',is_default,'updatedAt',updated_at) FROM public.cv_documents WHERE user_id=auth.uid() AND client_key IS NOT NULL ORDER BY updated_at DESC LIMIT 1),'{}'::jsonb),
    'careerlaunch_portfolio', COALESCE((SELECT jsonb_build_object('id','portfolio-'||user_id,'userId',user_id,'slug',slug,'headline',headline,'bio',bio,'theme',theme,'isPublished',is_published,'socialLinks',social_links,'featuredProjectIds',COALESCE(custom_sections->'featuredProjectIds','[]'::jsonb),'publicSections',COALESCE(custom_sections->'publicSections','{}'::jsonb),'viewCount',view_count,'updatedAt',updated_at) FROM public.portfolios WHERE user_id=auth.uid()),'{}'::jsonb),
    'careerlaunch_notifications', COALESCE((SELECT jsonb_agg(jsonb_build_object('id',client_key,'userId',user_id,'title',title,'message',message,'type',type,'isRead',is_read,'actionUrl',action_url,'createdAt',created_at) ORDER BY created_at DESC) FROM public.notifications WHERE user_id=auth.uid() AND client_key IS NOT NULL),'[]'::jsonb),
    'careerlaunch_saved_resources', COALESCE((SELECT jsonb_agg(resource_id) FROM public.user_resource_progress WHERE user_id=auth.uid() AND is_saved),'[]'::jsonb),
    'careerlaunch_completed_resources', COALESCE((SELECT jsonb_agg(resource_id) FROM public.user_resource_progress WHERE user_id=auth.uid() AND is_completed),'[]'::jsonb),
    'careerlaunch_interview_sessions', COALESCE((SELECT jsonb_agg(jsonb_build_object('id',client_key,'question',question,'answer',answer,'feedback',feedback,'createdAt',created_at) ORDER BY created_at DESC) FROM public.interview_practice_sessions WHERE user_id=auth.uid()),'[]'::jsonb),
    'careerlaunch_preferences', COALESCE((SELECT jsonb_build_object('currency',currency,'emailAlerts',email_alerts,'interviewReminders',interview_reminders,'weeklyDigest',weekly_digest,'appearance',appearance,'shareCareerContext',share_career_context) FROM public.user_preferences WHERE user_id=auth.uid()),'{}'::jsonb),
    'careerlaunch_target_role', COALESCE((SELECT to_jsonb(target_role) FROM public.user_career_goals WHERE user_id=auth.uid()),'""'::jsonb),
    'careerlaunch_target_role_skills', COALESCE((SELECT to_jsonb(target_role_skills) FROM public.user_career_goals WHERE user_id=auth.uid()),'[]'::jsonb)
  );
$$;
REVOKE ALL ON FUNCTION public.load_workspace_records() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.load_workspace_records() TO authenticated;
