-- Private user documents and public profile avatars. Safe to run on existing data.
CREATE TABLE IF NOT EXISTS public.user_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bucket_id TEXT NOT NULL DEFAULT 'career-documents' CHECK (bucket_id = 'career-documents'),
  object_path TEXT NOT NULL UNIQUE,
  file_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes BIGINT NOT NULL CHECK (size_bytes > 0 AND size_bytes <= 15728640),
  category TEXT NOT NULL CHECK (category IN ('cv', 'certificate', 'application', 'other')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS user_documents_owner_created_idx
  ON public.user_documents (user_id, created_at DESC);

ALTER TABLE public.user_documents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users read their own documents" ON public.user_documents;
CREATE POLICY "Users read their own documents" ON public.user_documents
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users add their own documents" ON public.user_documents;
CREATE POLICY "Users add their own documents" ON public.user_documents
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users delete their own documents" ON public.user_documents;
CREATE POLICY "Users delete their own documents" ON public.user_documents
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('career-avatars', 'career-avatars', true, 5242880, ARRAY['image/jpeg','image/png','image/webp']),
  ('career-documents', 'career-documents', false, 15728640, ARRAY['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document','image/jpeg','image/png','image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public can view CareerLaunch avatars" ON storage.objects;
CREATE POLICY "Public can view CareerLaunch avatars" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'career-avatars');
DROP POLICY IF EXISTS "Users upload their own CareerLaunch avatar" ON storage.objects;
CREATE POLICY "Users upload their own CareerLaunch avatar" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (
    bucket_id = 'career-avatars' AND (storage.foldername(name))[1] = auth.uid()::text
  );
DROP POLICY IF EXISTS "Users delete their own CareerLaunch avatar" ON storage.objects;
CREATE POLICY "Users delete their own CareerLaunch avatar" ON storage.objects
  FOR DELETE TO authenticated USING (
    bucket_id = 'career-avatars' AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Users manage their own CareerLaunch documents" ON storage.objects;
CREATE POLICY "Users manage their own CareerLaunch documents" ON storage.objects
  FOR ALL TO authenticated USING (
    bucket_id = 'career-documents' AND (storage.foldername(name))[1] = auth.uid()::text
  ) WITH CHECK (
    bucket_id = 'career-documents' AND (storage.foldername(name))[1] = auth.uid()::text
  );
