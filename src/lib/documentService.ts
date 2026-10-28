import { isSupabaseConfigured, supabase } from './supabase';

export type UserDocumentCategory = 'cv' | 'certificate' | 'application' | 'other';

export interface UserDocument {
  id: string;
  user_id: string;
  bucket_id: string;
  object_path: string;
  file_name: string;
  mime_type: string;
  size_bytes: number;
  category: UserDocumentCategory;
  created_at: string;
}

const MAX_FILE_SIZE = 15 * 1024 * 1024;
const allowedTypes = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
  'image/webp',
]);

function validateDocument(file: File) {
  if (!allowedTypes.has(file.type)) throw new Error('Upload a PDF, Word document, JPEG, PNG, or WebP file.');
  if (file.size <= 0 || file.size > MAX_FILE_SIZE) throw new Error('Each document must be smaller than 15 MB.');
}

async function requireUserId(): Promise<string> {
  if (!isSupabaseConfigured) throw new Error('Connect CareerLaunch to Supabase to upload and save files securely.');
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error('Sign in with your CareerLaunch account before uploading files.');
  return data.user.id;
}

function safeFileName(name: string): string {
  return name.normalize('NFKD').replace(/[^\w.-]+/g, '-').replace(/^-+|-+$/g, '').slice(-100) || 'document';
}

export async function uploadUserDocument(file: File, category: UserDocumentCategory): Promise<UserDocument> {
  validateDocument(file);
  const userId = await requireUserId();
  const objectPath = `${userId}/${crypto.randomUUID()}-${safeFileName(file.name)}`;
  const { error: uploadError } = await supabase.storage.from('career-documents').upload(objectPath, file, {
    contentType: file.type,
    cacheControl: '3600',
    upsert: false,
  });
  if (uploadError) throw new Error(uploadError.message);

  const { data, error } = await supabase.from('user_documents').insert({
    user_id: userId,
    bucket_id: 'career-documents',
    object_path: objectPath,
    file_name: file.name,
    mime_type: file.type,
    size_bytes: file.size,
    category,
  }).select('*').single();

  if (error || !data) {
    await supabase.storage.from('career-documents').remove([objectPath]);
    throw new Error(error?.message || 'The document was uploaded but its record could not be saved.');
  }
  return data as UserDocument;
}

export async function listUserDocuments(): Promise<UserDocument[]> {
  const userId = await requireUserId();
  const { data, error } = await supabase.from('user_documents')
    .select('*').eq('user_id', userId).order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data || []) as UserDocument[];
}

export async function getUserDocumentUrl(document: UserDocument): Promise<string> {
  const userId = await requireUserId();
  if (document.user_id !== userId || document.bucket_id !== 'career-documents') {
    throw new Error('You do not have access to this document.');
  }
  const { data, error } = await supabase.storage.from('career-documents').createSignedUrl(document.object_path, 120);
  if (error || !data?.signedUrl) throw new Error(error?.message || 'Could not open this document.');
  return data.signedUrl;
}

export async function deleteUserDocument(document: UserDocument): Promise<void> {
  const userId = await requireUserId();
  if (document.user_id !== userId || document.bucket_id !== 'career-documents') {
    throw new Error('You do not have access to this document.');
  }
  const { error: storageError } = await supabase.storage.from('career-documents').remove([document.object_path]);
  if (storageError) throw new Error(storageError.message);
  const { error } = await supabase.from('user_documents').delete().eq('id', document.id).eq('user_id', userId);
  if (error) throw new Error(error.message);
}

export async function uploadProfileAvatar(file: File): Promise<string> {
  if (!isSupabaseConfigured) throw new Error('Connect CareerLaunch to Supabase to upload a profile photo.');
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('Choose a JPEG, PNG, or WebP image.');
  if (file.size <= 0 || file.size > 5 * 1024 * 1024) throw new Error('Profile photos must be smaller than 5 MB.');
  const userId = await requireUserId();
  const extension = file.type === 'image/jpeg' ? 'jpg' : file.type.split('/')[1];
  const path = `${userId}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from('career-avatars').upload(path, file, { contentType: file.type, cacheControl: '3600' });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from('career-avatars').getPublicUrl(path);
  return data.publicUrl;
}
