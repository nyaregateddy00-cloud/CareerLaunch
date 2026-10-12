-- ==============================================================================
-- CareerLaunch Platform - Complete Supabase Database Schema
-- Focus: African & Kenyan Students, Graduates, Job Seekers & Freelancers
-- Includes: RLS Policies, Triggers, Indexes, Enums, and Relationships
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- ==============================================================================
-- 1. PROFILES
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    headline TEXT,
    bio TEXT,
    location TEXT DEFAULT 'Nairobi, Kenya',
    phone TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'job_seeker'
        CHECK (role IN (
            'student',
            'graduate',
            'job_seeker',
            'freelancer',
            'career_changer',
            'employer',
            'admin'
        )),
    profile_strength INTEGER DEFAULT 35,
    github_url TEXT,
    linkedin_url TEXT,
    portfolio_url TEXT,
    website_url TEXT,
    twitter_url TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.profiles
    ADD COLUMN IF NOT EXISTS website_url TEXT;


-- ==============================================================================
-- 2. EDUCATION
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.education (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    institution TEXT NOT NULL,
    degree TEXT NOT NULL,
    field_of_study TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    grade TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);


-- ==============================================================================
-- 3. WORK EXPERIENCE
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.experience (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    company TEXT NOT NULL,
    position TEXT NOT NULL,
    employment_type TEXT DEFAULT 'Full-time'
        CHECK (employment_type IN (
            'Full-time',
            'Part-time',
            'Internship',
            'Attachment',
            'Contract',
            'Freelance'
        )),
    location TEXT DEFAULT 'Nairobi, Kenya',
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);


-- ==============================================================================
-- 4. MASTER SKILLS & USER SKILLS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL
        CHECK (category IN (
            'Technical',
            'Soft Skills',
            'Tools & Frameworks',
            'Design',
            'Data & AI',
            'Business & Marketing'
        )),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.user_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES public.skills(id) ON DELETE SET NULL,
    skill_name TEXT NOT NULL,
    category TEXT NOT NULL,
    proficiency_level TEXT DEFAULT 'Intermediate'
        CHECK (proficiency_level IN (
            'Beginner',
            'Intermediate',
            'Advanced',
            'Expert'
        )),
    years_of_experience NUMERIC DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, skill_name)
);


-- ==============================================================================
-- 5. PROJECTS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    link TEXT,
    github_link TEXT,
    image_url TEXT,
    tags TEXT[] DEFAULT '{}',
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);


-- ==============================================================================
-- 6. CERTIFICATIONS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    issuer TEXT NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE,
    credential_url TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);


-- ==============================================================================
-- 7. PORTFOLIOS
-- Shareable public URL: careerlaunch.com/u/:slug
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.portfolios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    slug TEXT UNIQUE NOT NULL,
    headline TEXT,
    bio TEXT,
    theme TEXT DEFAULT 'modern-navy'
        CHECK (theme IN (
            'modern-navy',
            'emerald-minimal',
            'dark-tech',
            'creative-clean'
        )),
    is_published BOOLEAN DEFAULT TRUE,
    social_links JSONB DEFAULT '{}'::jsonb,
    custom_sections JSONB DEFAULT '[]'::jsonb,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);


-- ==============================================================================
-- 8. CV DOCUMENTS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.cv_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'My Professional CV',
    template_id TEXT NOT NULL DEFAULT 'modern-navy'
        CHECK (template_id IN (
            'modern-navy',
            'executive-classic',
            'clean-minimalist'
        )),
    content_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_default BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);


-- ==============================================================================
-- 9. OPPORTUNITIES
-- Jobs, Internships, Attachments, Scholarships, Freelance
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    company_logo TEXT,
    location TEXT NOT NULL,
    country TEXT DEFAULT 'Kenya',
    type TEXT NOT NULL
        CHECK (type IN (
            'Job',
            'Internship',
            'Attachment',
            'Scholarship',
            'Freelance',
            'Graduate Program',
            'Remote',
            'Competition'
        )),
    work_mode TEXT DEFAULT 'Hybrid'
        CHECK (work_mode IN (
            'On-site',
            'Hybrid',
            'Remote'
        )),
    experience_level TEXT DEFAULT 'Entry Level'
        CHECK (experience_level IN (
            'Student/Intern',
            'Entry Level',
            'Mid Level',
            'Senior Level',
            'All Levels'
        )),
    salary_range TEXT,
    currency TEXT DEFAULT 'KES',
    deadline DATE,
    description TEXT NOT NULL,
    requirements TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    application_url TEXT,
    contact_email TEXT,
    source TEXT DEFAULT 'Direct',
    status TEXT DEFAULT 'published'
        CHECK (status IN (
            'draft',
            'published',
            'closed',
            'archived'
        )),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);


-- ==============================================================================
-- 10. SAVED OPPORTUNITIES
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.saved_opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, opportunity_id)
);


-- ==============================================================================
-- 11. APPLICATIONS
-- Kanban Tracker
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE SET NULL,
    company TEXT NOT NULL,
    position TEXT NOT NULL,

    -- Matches the CareerLaunch UI
    stage TEXT DEFAULT 'Saved'
        CHECK (stage IN (
            'Saved',
            'Applied',
            'Shortlisted',
            'Assessment',
            'Interview',
            'Offer',
            'Rejected',
            'Withdrawn'
        )),

    date_applied DATE DEFAULT CURRENT_DATE,
    deadline DATE,
    notes TEXT,
    salary TEXT,
    job_url TEXT,
    interview_date TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);


-- ==============================================================================
-- 12. RESOURCES & LEARNING
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL
        CHECK (category IN (
            'Career Guide',
            'CV & Portfolio',
            'Interview Prep',
            'Industrial Attachment',
            'Freelancing',
            'Scholarships'
        )),
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    read_time TEXT DEFAULT '5 min read',
    author TEXT DEFAULT 'CareerLaunch Team',
    tags TEXT[] DEFAULT '{}',
    is_featured BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);


-- ==============================================================================
-- 13. NOTIFICATIONS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info'
        CHECK (type IN (
            'info',
            'success',
            'warning',
            'opportunity',
            'application'
        )),
    is_read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);


-- ==============================================================================
-- 14. SUBSCRIPTIONS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan TEXT DEFAULT 'Free'
        CHECK (plan IN (
            'Free',
            'Student Pro',
            'Career Accelerator',
            'Employer'
        )),
    status TEXT DEFAULT 'active'
        CHECK (status IN (
            'active',
            'past_due',
            'cancelled'
        )),
    start_date TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    end_date TIMESTAMPTZ
);


-- ==============================================================================
-- INDEXES FOR PERFORMANCE
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_profiles_role
    ON public.profiles(role);

CREATE INDEX IF NOT EXISTS idx_education_user
    ON public.education(user_id);

CREATE INDEX IF NOT EXISTS idx_experience_user
    ON public.experience(user_id);

CREATE INDEX IF NOT EXISTS idx_user_skills_user
    ON public.user_skills(user_id);

CREATE INDEX IF NOT EXISTS idx_projects_user
    ON public.projects(user_id);

CREATE INDEX IF NOT EXISTS idx_portfolios_slug
    ON public.portfolios(slug);

CREATE INDEX IF NOT EXISTS idx_portfolios_user
    ON public.portfolios(user_id);

CREATE INDEX IF NOT EXISTS idx_opportunities_status
    ON public.opportunities(status);

CREATE INDEX IF NOT EXISTS idx_opportunities_type
    ON public.opportunities(type);

CREATE INDEX IF NOT EXISTS idx_opportunities_location
    ON public.opportunities(location);

CREATE INDEX IF NOT EXISTS idx_saved_opportunities_user
    ON public.saved_opportunities(user_id);

CREATE INDEX IF NOT EXISTS idx_applications_user
    ON public.applications(user_id);

CREATE INDEX IF NOT EXISTS idx_applications_stage
    ON public.applications(stage);

CREATE INDEX IF NOT EXISTS idx_notifications_user_unread
    ON public.notifications(user_id, is_read);

CREATE INDEX IF NOT EXISTS idx_resources_slug
    ON public.resources(slug);


-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.cv_documents ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.saved_opportunities ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;


-- ==============================================================================
-- PROFILES POLICIES
-- ==============================================================================

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Prevent client-side privilege escalation through the editable profile row.
CREATE OR REPLACE FUNCTION public.prevent_profile_role_change()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.role IS DISTINCT FROM OLD.role AND auth.role() <> 'service_role' THEN
        RAISE EXCEPTION 'Profile roles can only be changed by a trusted server administrator';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS prevent_profile_role_change ON public.profiles;
CREATE TRIGGER prevent_profile_role_change
    BEFORE UPDATE OF role ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.prevent_profile_role_change();


-- ==============================================================================
-- EDUCATION POLICIES
-- ==============================================================================

CREATE POLICY "Users manage their own education"
ON public.education
FOR ALL
USING (auth.uid() = user_id);


-- ==============================================================================
-- EXPERIENCE POLICIES
-- ==============================================================================

CREATE POLICY "Users manage their own experience"
ON public.experience
FOR ALL
USING (auth.uid() = user_id);


-- ==============================================================================
-- USER SKILLS POLICIES
-- ==============================================================================

CREATE POLICY "Users manage their own skills"
ON public.user_skills
FOR ALL
USING (auth.uid() = user_id);


-- ==============================================================================
-- PROJECTS POLICIES
-- ==============================================================================

CREATE POLICY "Users manage their own projects"
ON public.projects
FOR ALL
USING (auth.uid() = user_id);


-- ==============================================================================
-- CERTIFICATIONS POLICIES
-- ==============================================================================

CREATE POLICY "Users manage their own certifications"
ON public.certifications
FOR ALL
USING (auth.uid() = user_id);


-- ==============================================================================
-- CV DOCUMENTS POLICIES
-- ==============================================================================

CREATE POLICY "Users manage their own CVs"
ON public.cv_documents
FOR ALL
USING (auth.uid() = user_id);


-- ==============================================================================
-- PORTFOLIO POLICIES
-- ==============================================================================

CREATE POLICY "Published portfolios are publicly viewable"
ON public.portfolios
FOR SELECT
USING (
    is_published = true
    OR auth.uid() = user_id
);

CREATE POLICY "Users can manage their portfolio"
ON public.portfolios
FOR ALL
USING (auth.uid() = user_id);


-- ==============================================================================
-- OPPORTUNITIES POLICIES
-- ==============================================================================

CREATE POLICY "Anyone can view published opportunities"
ON public.opportunities
FOR SELECT
USING (status = 'published');

CREATE POLICY "Admins can manage opportunities"
ON public.opportunities
FOR ALL
USING (
    EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);


-- ==============================================================================
-- SAVED OPPORTUNITIES POLICIES
-- ==============================================================================

CREATE POLICY "Users manage saved opportunities"
ON public.saved_opportunities
FOR ALL
USING (auth.uid() = user_id);


-- ==============================================================================
-- APPLICATIONS POLICIES
-- ==============================================================================

CREATE POLICY "Users manage their own applications"
ON public.applications
FOR ALL
USING (auth.uid() = user_id);


-- ==============================================================================
-- RESOURCES POLICIES
-- ==============================================================================

CREATE POLICY "Anyone can view resources"
ON public.resources
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage resources"
ON public.resources
FOR ALL
USING (
    EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);


-- ==============================================================================
-- NOTIFICATIONS POLICIES
-- ==============================================================================

CREATE POLICY "Users view their notifications"
ON public.notifications
FOR ALL
USING (auth.uid() = user_id);


-- ==============================================================================
-- SUBSCRIPTIONS POLICIES
-- ==============================================================================

CREATE POLICY "Users view their subscription"
ON public.subscriptions
FOR SELECT
USING (auth.uid() = user_id);


-- ==============================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER ON AUTH SIGNUP
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN

    INSERT INTO public.profiles (
        id,
        full_name,
        email,
        headline,
        role,
        profile_strength,
        avatar_url
    )
    VALUES (
        NEW.id,
        COALESCE(
            NEW.raw_user_meta_data->>'full_name',
            NEW.raw_user_meta_data->>'name',
            'New Member'
        ),
        NEW.email,
        COALESCE(
            NEW.raw_user_meta_data->>'headline',
            'Aspiring Professional | CareerLaunch'
        ),
        CASE
            WHEN NEW.raw_user_meta_data->>'role' IN ('student', 'graduate', 'job_seeker', 'freelancer', 'career_changer')
            THEN NEW.raw_user_meta_data->>'role'
            ELSE 'job_seeker'
        END,
        35,
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture')
    );

    RETURN NEW;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;


-- Remove existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created
ON auth.users;


-- Create signup trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();


-- ============================================================================
-- 21. PRIVATE WORKSPACE SNAPSHOTS
-- The current React screens use synchronous browser storage. This private,
-- owner-scoped JSON snapshot keeps that workspace state synchronized across
-- devices while the UI is migrated to normalized table CRUD operations.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.workspace_snapshots (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.workspace_snapshots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage their own workspace snapshot"
    ON public.workspace_snapshots;
CREATE POLICY "Users manage their own workspace snapshot"
    ON public.workspace_snapshots
    FOR ALL TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.workspace_snapshots TO authenticated;
