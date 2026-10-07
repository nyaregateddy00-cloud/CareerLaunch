-- Opportunity source lineage, quality metadata, saved searches, and career playbooks.
-- Existing opportunity IDs and application links remain stable.

ALTER TABLE public.opportunities
  ADD COLUMN IF NOT EXISTS source_key TEXT,
  ADD COLUMN IF NOT EXISTS source_id TEXT,
  ADD COLUMN IF NOT EXISTS dedupe_fingerprint TEXT,
  ADD COLUMN IF NOT EXISTS region TEXT,
  ADD COLUMN IF NOT EXISTS employment_type TEXT,
  ADD COLUMN IF NOT EXISTS salary_min NUMERIC(12,2),
  ADD COLUMN IF NOT EXISTS salary_max NUMERIC(12,2),
  ADD COLUMN IF NOT EXISTS source_url TEXT,
  ADD COLUMN IF NOT EXISTS source_attributions TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS discovered_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS posted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS description_summary TEXT,
  ADD COLUMN IF NOT EXISTS last_checked_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS verification_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (verification_status IN ('pending','verified','needs_review','expired','rejected')),
  ADD COLUMN IF NOT EXISTS quality_score SMALLINT CHECK (quality_score BETWEEN 0 AND 100),
  ADD COLUMN IF NOT EXISTS ai_processed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS why_this_matters TEXT,
  ADD COLUMN IF NOT EXISTS review_note TEXT,
  ADD COLUMN IF NOT EXISTS education_requirements TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS is_rolling BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS expired_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

ALTER TABLE public.opportunities DROP CONSTRAINT IF EXISTS opportunities_type_check;
ALTER TABLE public.opportunities ADD CONSTRAINT opportunities_type_check
  CHECK (type IN ('Job','Internship','Attachment','Scholarship','Freelance','Graduate Program','Remote','Competition','Fellowship','Hackathon','Volunteering','Event','Apprenticeship','Training','Entrepreneurship'));

UPDATE public.opportunities
SET source_attributions = ARRAY[source],
    discovered_at = COALESCE(discovered_at, created_at),
    last_checked_at = COALESCE(last_checked_at, created_at),
    verification_status = CASE WHEN source IN ('Direct','Employer listing') THEN 'pending' ELSE 'needs_review' END
WHERE cardinality(source_attributions) = 0;

CREATE UNIQUE INDEX IF NOT EXISTS opportunities_source_identity_idx
  ON public.opportunities(source_key, source_id)
  WHERE source_key IS NOT NULL AND source_id IS NOT NULL;
UPDATE public.opportunities SET dedupe_fingerprint = lower(regexp_replace(concat_ws('|',title,company,location,COALESCE(deadline::text,'')),'[^a-zA-Z0-9|]+','','g')) WHERE dedupe_fingerprint IS NULL;
CREATE INDEX IF NOT EXISTS opportunities_dedupe_fingerprint_idx ON public.opportunities(dedupe_fingerprint) WHERE dedupe_fingerprint IS NOT NULL;
CREATE INDEX IF NOT EXISTS opportunities_verification_idx ON public.opportunities(verification_status);
CREATE INDEX IF NOT EXISTS opportunities_discovered_idx ON public.opportunities(discovered_at DESC);
CREATE INDEX IF NOT EXISTS opportunities_deadline_active_idx ON public.opportunities(deadline) WHERE status = 'published';

CREATE OR REPLACE FUNCTION public.expire_past_opportunities()
RETURNS INTEGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE affected INTEGER;
BEGIN
  UPDATE public.opportunities
  SET status = 'closed', verification_status = 'expired', expired_at = COALESCE(expired_at,NOW()), updated_at = NOW()
  WHERE status = 'published' AND deadline < CURRENT_DATE AND verification_status <> 'expired';
  GET DIAGNOSTICS affected = ROW_COUNT;
  RETURN affected;
END;
$$;
REVOKE ALL ON FUNCTION public.expire_past_opportunities() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.expire_past_opportunities() TO service_role;

ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS client_key TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS notifications_user_client_key_idx ON public.notifications(user_id,client_key) WHERE client_key IS NOT NULL;

CREATE OR REPLACE FUNCTION public.notify_saved_opportunity_searches()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status = 'published' AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'published') THEN
    INSERT INTO public.notifications(user_id,title,message,type,action_url,client_key)
    SELECT s.user_id,
      'A new opportunity matches your search',
      NEW.title || ' is listed by ' || NEW.company || '. Confirm the current requirements and application details at the original source.',
      'opportunity',
      '/app/opportunities',
      'opportunity:' || NEW.id::text || ':search:' || s.id::text
    FROM public.saved_opportunity_searches s
    WHERE s.alerts_enabled = TRUE
      AND (COALESCE(s.filters->>'query','') = '' OR concat_ws(' ',NEW.title,NEW.company,NEW.location,NEW.description,array_to_string(NEW.tags,' ')) ILIKE '%' || (s.filters->>'query') || '%')
      AND (COALESCE(s.filters->>'type','All') IN ('','All',NEW.type))
      AND (COALESCE(s.filters->>'country','All') IN ('','All',NEW.country))
      AND (COALESCE(s.filters->>'experienceLevel','All') IN ('','All',NEW.experience_level))
      AND (COALESCE(s.filters->>'workMode','All') IN ('','All',COALESCE(NEW.work_mode,'Not provided')))
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS notify_saved_opportunity_searches ON public.opportunities;
CREATE TRIGGER notify_saved_opportunity_searches
  AFTER INSERT OR UPDATE OF status ON public.opportunities
  FOR EACH ROW EXECUTE FUNCTION public.notify_saved_opportunity_searches();

CREATE TABLE IF NOT EXISTS public.opportunity_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('rss','atom','json')),
  feed_url TEXT NOT NULL,
  country TEXT,
  category TEXT,
  attribution TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT FALSE,
  last_synced_at TIMESTAMPTZ,
  last_status TEXT NOT NULL DEFAULT 'not_configured',
  last_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.opportunity_sources ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins manage opportunity sources" ON public.opportunity_sources;
CREATE POLICY "Admins manage opportunity sources" ON public.opportunity_sources
  FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE TABLE IF NOT EXISTS public.opportunity_sync_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_key TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('running','succeeded','partial','failed')),
  fetched INTEGER NOT NULL DEFAULT 0,
  inserted INTEGER NOT NULL DEFAULT 0,
  updated INTEGER NOT NULL DEFAULT 0,
  duplicates INTEGER NOT NULL DEFAULT 0,
  rejected INTEGER NOT NULL DEFAULT 0,
  error_message TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at TIMESTAMPTZ
);
ALTER TABLE public.opportunity_sync_runs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins view opportunity sync runs" ON public.opportunity_sync_runs;
CREATE POLICY "Admins view opportunity sync runs" ON public.opportunity_sync_runs
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE TABLE IF NOT EXISTS public.saved_opportunity_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  filters JSONB NOT NULL DEFAULT '{}'::jsonb,
  alerts_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, label)
);
ALTER TABLE public.saved_opportunity_searches ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own saved opportunity searches" ON public.saved_opportunity_searches;
CREATE POLICY "Users manage own saved opportunity searches" ON public.saved_opportunity_searches
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS saved_opportunity_searches_user_idx ON public.saved_opportunity_searches(user_id);

CREATE TABLE IF NOT EXISTS public.user_playbook_progress (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  playbook_slug TEXT NOT NULL,
  completed_task_ids TEXT[] NOT NULL DEFAULT '{}',
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY(user_id, playbook_slug)
);
ALTER TABLE public.user_playbook_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own playbook progress" ON public.user_playbook_progress;
CREATE POLICY "Users manage own playbook progress" ON public.user_playbook_progress
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.playbooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  target_audience TEXT NOT NULL DEFAULT '',
  difficulty TEXT NOT NULL DEFAULT 'Beginner',
  estimated_duration TEXT NOT NULL DEFAULT '',
  skills TEXT[] NOT NULL DEFAULT '{}',
  steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  resources JSONB NOT NULL DEFAULT '[]'::jsonb,
  related_opportunities TEXT[] NOT NULL DEFAULT '{}',
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.playbooks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read published playbooks" ON public.playbooks;
CREATE POLICY "Anyone can read published playbooks" ON public.playbooks FOR SELECT USING (published = TRUE);
DROP POLICY IF EXISTS "Admins manage playbooks" ON public.playbooks;
CREATE POLICY "Admins manage playbooks" ON public.playbooks FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- Seed discoverable metadata. Detailed, reviewed journeys are maintained in src/data/playbooks.ts.
INSERT INTO public.playbooks(slug,title,description,category,target_audience,estimated_duration,skills)
VALUES
('first-internship','Get Your First Internship','Turn coursework and small projects into evidence, find a relevant placement, and prepare a thoughtful application.','Students & Graduates','Students and recent graduates','4 weeks',ARRAY['CV writing','Project evidence']),
('first-job','Get Your First Job','Build a focused search routine, make your evidence easy to assess, and manage applications consistently.','Students & Graduates','Graduates and early-career job seekers','6 weeks',ARRAY['Role targeting','CV tailoring']),
('graduate-programme-starter','Graduate Programme Starter','Prepare eligibility checks, evidence, and assessments for structured graduate recruitment.','Students & Graduates','Final-year students and recent graduates','5 weeks',ARRAY['Eligibility research','Interview examples']),
('professional-cv','Build Your First Professional CV','Create a truthful, readable CV that makes relevant evidence easy to find.','Career Foundations','Students, graduates, and career changers','1 week',ARRAY['CV writing','Evidence selection']),
('build-portfolio','Build Your Portfolio','Present a small set of clear case studies that show your contribution and thinking.','Career Foundations','Students, professionals, and freelancers','3 weeks',ARRAY['Case studies','Project storytelling']),
('strong-linkedin-profile','Build a Strong LinkedIn Profile','Make your skills, work, and career direction easier to understand.','Career Foundations','Students, graduates, and professionals','1 week',ARRAY['Professional writing','Networking']),
('software-developer','Become a Software Developer','Build programming fundamentals, ship useful projects, and prepare for junior opportunities.','Technology','Learners and career changers','12 weeks',ARRAY['Programming','Git']),
('data-analyst','Become a Data Analyst','Turn a question and a dataset into a checked, understandable recommendation.','Technology','Students and career changers','10 weeks',ARRAY['Spreadsheets','SQL']),
('cloud-computing-career','Start a Cloud Computing Career','Build cloud fundamentals and deploy a small, documented project.','Technology','IT students and professionals','10 weeks',ARRAY['Networking','Linux']),
('ai-ml-career','Start an AI/ML Career','Pair practical Python and statistics with careful model evaluation.','Technology','Learners interested in data and ML','12 weeks',ARRAY['Python','Statistics']),
('cybersecurity-career','Start a Cybersecurity Career','Learn defensive fundamentals in authorized environments.','Technology','IT learners and professionals','10 weeks',ARRAY['Networking','Security fundamentals']),
('start-freelancing','Start Freelancing','Define a narrow service, a clear scope, and a reliable delivery process.','Freelancing & Remote','Independent professionals','4 weeks',ARRAY['Service design','Client communication']),
('first-freelance-client','Get Your First Freelance Client','Find a first client through a relevant offer and useful conversation.','Freelancing & Remote','New freelancers','3 weeks',ARRAY['Prospecting','Proposal writing']),
('start-remote-work','Start Remote Work','Demonstrate communication, self-management, and dependable delivery.','Freelancing & Remote','Professionals seeking remote work','5 weeks',ARRAY['Written communication','Time management']),
('remote-ready-profile','Build a Remote-Ready Profile','Clarify eligibility, communication habits, and remote-work evidence.','Freelancing & Remote','Remote job seekers and freelancers','2 weeks',ARRAY['Portfolio writing','Async communication']),
('master-job-applications','Master Job Applications','Evaluate listings, tailor evidence, and follow up respectfully.','Applications','Job seekers','4 weeks',ARRAY['Vacancy analysis','Application tracking']),
('internship-applications','Internship Applications','Find placements that fit learning goals and demonstrate practical contribution.','Applications','Students','3 weeks',ARRAY['Eligibility checks','CV tailoring']),
('scholarship-applications','Scholarship Applications','Organize eligibility, evidence, and materials for each scholarship.','Applications','Students','4 weeks',ARRAY['Eligibility research','Personal statements']),
('fellowship-applications','Fellowship Applications','Build an evidence-based case around contribution, goals, and fit.','Applications','Graduates and professionals','5 weeks',ARRAY['Project framing','Recommendations']),
('first-interview','Prepare for Your First Interview','Prepare truthful examples and thoughtful questions without memorizing a script.','Interviews','Students and first-time interviewees','1 week',ARRAY['Interview research','Structured examples']),
('technical-interview','Technical Interview Preparation','Explain technical decisions, solve problems methodically, and validate answers.','Interviews','Technical candidates','3 weeks',ARRAY['Problem solving','Technical communication']),
('behavioral-interview','Behavioral Interview Preparation','Build concise, truthful examples for common competencies.','Interviews','Candidates preparing for competency interviews','1 week',ARRAY['Storytelling','Reflection']),
('launch-career-from-africa','Launch Your Career from Africa','Build career evidence and a search strategy for local and cross-border realities.','Africa-first careers','African students and professionals','6 weeks',ARRAY['Career positioning','Local market research']),
('international-remote-opportunities','Find International Remote Opportunities','Search internationally while checking eligibility, payments, contracts, and time zones.','Africa-first careers','African professionals seeking remote work','5 weeks',ARRAY['Remote search','Eligibility checks']),
('african-tech-career','Build a Career in African Tech','Connect a tech skill to regional products, infrastructure, and user needs.','Africa-first careers','People interested in tech across African markets','8 weeks',ARRAY['Tech research','Portfolio projects'])
ON CONFLICT (slug) DO NOTHING;
