CREATE TABLE IF NOT EXISTS public.community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (char_length(title) BETWEEN 8 AND 160),
  body TEXT NOT NULL CHECK (char_length(body) BETWEEN 20 AND 5000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.community_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body TEXT NOT NULL CHECK (char_length(body) BETWEEN 2 AND 2000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS community_posts_created_idx ON public.community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS community_comments_post_created_idx ON public.community_comments(post_id, created_at);

ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Signed-in members can read community posts" ON public.community_posts;
CREATE POLICY "Signed-in members can read community posts"
  ON public.community_posts FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Members can create their own community posts" ON public.community_posts;
CREATE POLICY "Members can create their own community posts"
  ON public.community_posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Members can edit their own community posts" ON public.community_posts;
CREATE POLICY "Members can edit their own community posts"
  ON public.community_posts FOR UPDATE TO authenticated
  USING (auth.uid() = author_id) WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Members can delete their own community posts" ON public.community_posts;
CREATE POLICY "Members can delete their own community posts"
  ON public.community_posts FOR DELETE TO authenticated USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Signed-in members can read community comments" ON public.community_comments;
CREATE POLICY "Signed-in members can read community comments"
  ON public.community_comments FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Members can comment as themselves" ON public.community_comments;
CREATE POLICY "Members can comment as themselves"
  ON public.community_comments FOR INSERT TO authenticated WITH CHECK (
    auth.uid() = author_id AND EXISTS (
      SELECT 1 FROM public.community_posts post WHERE post.id = community_comments.post_id
    )
  );

DROP POLICY IF EXISTS "Members can delete their own comments" ON public.community_comments;
CREATE POLICY "Members can delete their own comments"
  ON public.community_comments FOR DELETE TO authenticated USING (auth.uid() = author_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.community_posts TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.community_comments TO authenticated;
