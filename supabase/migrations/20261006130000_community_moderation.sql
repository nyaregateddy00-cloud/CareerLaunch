-- Member reports and administrator moderation for community discussions.
-- Apply after 20261006110000_community_foundation.sql.

CREATE OR REPLACE FUNCTION public.is_platform_admin()
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin');
$$;
REVOKE ALL ON FUNCTION public.is_platform_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_platform_admin() TO authenticated;

ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE public.community_comments ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN NOT NULL DEFAULT FALSE;

CREATE TABLE IF NOT EXISTS public.community_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES public.community_comments(id) ON DELETE CASCADE,
  reason TEXT NOT NULL CHECK (reason IN ('harassment', 'spam', 'private_information', 'misinformation', 'other')),
  details TEXT CHECK (details IS NULL OR char_length(details) <= 1000),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'reviewed', 'actioned', 'dismissed')),
  moderator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  moderator_note TEXT CHECK (moderator_note IS NULL OR char_length(moderator_note) <= 1000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT community_report_one_target CHECK (
    (CASE WHEN post_id IS NOT NULL THEN 1 ELSE 0 END)
    + (CASE WHEN comment_id IS NOT NULL THEN 1 ELSE 0 END) = 1
  )
);
CREATE INDEX IF NOT EXISTS community_reports_status_created_idx ON public.community_reports(status, created_at DESC);
CREATE INDEX IF NOT EXISTS community_reports_post_idx ON public.community_reports(post_id);
CREATE INDEX IF NOT EXISTS community_reports_comment_idx ON public.community_reports(comment_id);
ALTER TABLE public.community_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Members create reports as themselves" ON public.community_reports;
CREATE POLICY "Members create reports as themselves" ON public.community_reports FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = reporter_id AND (
    (post_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.community_posts p WHERE p.id = post_id AND p.author_id <> auth.uid()))
    OR (comment_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.community_comments c WHERE c.id = comment_id AND c.author_id <> auth.uid()))
  ));
DROP POLICY IF EXISTS "Members view own reports" ON public.community_reports;
CREATE POLICY "Members view own reports" ON public.community_reports FOR SELECT TO authenticated
  USING (reporter_id = auth.uid() OR public.is_platform_admin());
DROP POLICY IF EXISTS "Admins manage community reports" ON public.community_reports;
CREATE POLICY "Admins manage community reports" ON public.community_reports FOR UPDATE TO authenticated
  USING (public.is_platform_admin()) WITH CHECK (public.is_platform_admin());

DROP POLICY IF EXISTS "Signed-in members can read community posts" ON public.community_posts;
DROP POLICY IF EXISTS "Members can read visible community posts" ON public.community_posts;
CREATE POLICY "Members can read visible community posts" ON public.community_posts FOR SELECT TO authenticated
  USING (is_hidden = FALSE OR public.is_platform_admin());
DROP POLICY IF EXISTS "Admins can moderate community posts" ON public.community_posts;
CREATE POLICY "Admins can moderate community posts" ON public.community_posts FOR UPDATE TO authenticated
  USING (public.is_platform_admin()) WITH CHECK (public.is_platform_admin());

DROP POLICY IF EXISTS "Signed-in members can read community comments" ON public.community_comments;
DROP POLICY IF EXISTS "Members can read visible community comments" ON public.community_comments;
CREATE POLICY "Members can read visible community comments" ON public.community_comments FOR SELECT TO authenticated
  USING (
    public.is_platform_admin()
    OR (is_hidden = FALSE AND EXISTS (
      SELECT 1 FROM public.community_posts p WHERE p.id = post_id AND p.is_hidden = FALSE
    ))
  );
DROP POLICY IF EXISTS "Admins can moderate community comments" ON public.community_comments;
CREATE POLICY "Admins can moderate community comments" ON public.community_comments FOR UPDATE TO authenticated
  USING (public.is_platform_admin()) WITH CHECK (public.is_platform_admin());

GRANT SELECT, INSERT ON public.community_reports TO authenticated;
GRANT UPDATE (status, moderator_id, moderator_note, updated_at) ON public.community_reports TO authenticated;
