import { isSupabaseConfigured, supabase } from './supabase';

export interface CommunityComment {
  id: string;
  post_id: string;
  author_id: string;
  body: string;
  created_at: string;
}

export interface CommunityPost {
  id: string;
  author_id: string;
  title: string;
  body: string;
  created_at: string;
  community_comments: CommunityComment[];
}

export type CommunityReportStatus = 'open' | 'reviewed' | 'actioned' | 'dismissed';
export interface CommunityReport {
  id: string;
  reporter_id: string;
  post_id: string | null;
  comment_id: string | null;
  reason: string;
  details: string | null;
  status: CommunityReportStatus;
  moderator_note: string | null;
  created_at: string;
  community_posts: { title: string; body: string; author_id: string } | null;
  community_comments: { body: string; author_id: string; post_id: string } | null;
}

function requireSupabase() {
  if (!isSupabaseConfigured) throw new Error('Community discussions require CareerLaunch sign-in and Supabase configuration.');
}

export async function listCommunityPosts(): Promise<CommunityPost[]> {
  requireSupabase();
  const { data, error } = await supabase.from('community_posts')
    .select('id,author_id,title,body,created_at,community_comments(id,post_id,author_id,body,created_at)')
    .order('created_at', { ascending: false }).limit(50);
  if (error) throw error;
  return (data || []) as CommunityPost[];
}

export async function createCommunityPost(title: string, body: string): Promise<void> {
  requireSupabase();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error('Sign in again before starting a discussion.');
  const cleanTitle = title.trim();
  const cleanBody = body.trim();
  if (cleanTitle.length < 8 || cleanTitle.length > 160) throw new Error('Discussion titles need 8–160 characters.');
  if (cleanBody.length < 20 || cleanBody.length > 5000) throw new Error('Discussion posts need 20–5,000 characters.');
  const { error } = await supabase.from('community_posts').insert({ author_id: user.id, title: cleanTitle, body: cleanBody });
  if (error) throw error;
}

export async function addCommunityComment(postId: string, body: string): Promise<void> {
  requireSupabase();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error('Sign in again before replying.');
  const cleanBody = body.trim();
  if (cleanBody.length < 2 || cleanBody.length > 2000) throw new Error('Replies need 2–2,000 characters.');
  const { error } = await supabase.from('community_comments').insert({ post_id: postId, author_id: user.id, body: cleanBody });
  if (error) throw error;
}

export async function deleteCommunityPost(id: string): Promise<void> {
  requireSupabase();
  const { error } = await supabase.from('community_posts').delete().eq('id', id);
  if (error) throw error;
}

export async function deleteCommunityComment(id: string): Promise<void> {
  requireSupabase();
  const { error } = await supabase.from('community_comments').delete().eq('id', id);
  if (error) throw error;
}

export async function reportCommunityContent(target: { postId?: string; commentId?: string }, reason: string, details = ''): Promise<void> {
  requireSupabase();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error('Sign in again before reporting content.');
  if (Boolean(target.postId) === Boolean(target.commentId)) throw new Error('Choose one discussion or reply to report.');
  const allowed = ['harassment', 'spam', 'private_information', 'misinformation', 'other'];
  if (!allowed.includes(reason)) throw new Error('Choose a valid report reason.');
  const cleanDetails = details.trim().slice(0, 1000);
  const { error } = await supabase.from('community_reports').insert({
    reporter_id: user.id,
    post_id: target.postId || null,
    comment_id: target.commentId || null,
    reason,
    details: cleanDetails || null,
  });
  if (error) throw error;
}

export async function listCommunityReports(): Promise<CommunityReport[]> {
  requireSupabase();
  const { data, error } = await supabase.from('community_reports')
    .select('id,reporter_id,post_id,comment_id,reason,details,status,moderator_note,created_at,community_posts(title,body,author_id),community_comments(body,author_id,post_id)')
    .order('created_at', { ascending: false }).limit(100);
  if (error) throw error;
  return (data || []) as unknown as CommunityReport[];
}

export async function moderateCommunityReport(report: CommunityReport, status: CommunityReportStatus, note = ''): Promise<void> {
  requireSupabase();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error('Sign in again before moderating reports.');
  if (status === 'actioned') {
    const target = report.post_id ? supabase.from('community_posts') : supabase.from('community_comments');
    const id = report.post_id || report.comment_id;
    const result = await target.update({ is_hidden: true }).eq('id', id);
    if (result.error) throw result.error;
  }
  const { error } = await supabase.from('community_reports').update({
    status,
    moderator_id: user.id,
    moderator_note: note.trim().slice(0, 1000) || null,
    updated_at: new Date().toISOString(),
  }).eq('id', report.id);
  if (error) throw error;
}
