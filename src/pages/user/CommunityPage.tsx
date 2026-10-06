import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import { Flag, MessageCircle, Plus, RefreshCw, Send, Trash2 } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Textarea, Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { useAuth } from '../../context/AuthContext';
import { addCommunityComment, CommunityPost, createCommunityPost, deleteCommunityComment, deleteCommunityPost, listCommunityPosts, reportCommunityContent } from '../../lib/community';
import { isSupabaseConfigured } from '../../lib/supabase';

export const CommunityPage: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [replies, setReplies] = useState<Record<string, string>>({});
  const [reportTarget, setReportTarget] = useState<{ postId?: string; commentId?: string } | null>(null);
  const [reportReason, setReportReason] = useState('other');
  const [reportDetails, setReportDetails] = useState('');
  const [reportError, setReportError] = useState('');
  const [notice, setNotice] = useState('');

  const load = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    setLoading(true); setError('');
    try { setPosts(await listCommunityPosts()); }
    catch { setError('Could not load discussions. Check the community database migration and try again.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const submitPost = async (event: FormEvent) => {
    event.preventDefault(); setBusy(true); setError('');
    try { await createCommunityPost(title, body); setTitle(''); setBody(''); await load(); }
    catch (failure) { setError(failure instanceof Error ? failure.message : 'Your discussion could not be posted.'); }
    finally { setBusy(false); }
  };

  const submitReply = async (event: FormEvent, postId: string) => {
    event.preventDefault(); setBusy(true); setError('');
    try { await addCommunityComment(postId, replies[postId] || ''); setReplies((current) => ({ ...current, [postId]: '' })); await load(); }
    catch (failure) { setError(failure instanceof Error ? failure.message : 'Your reply could not be posted.'); }
    finally { setBusy(false); }
  };

  const removePost = async (postId: string) => {
    if (!confirm('Delete your discussion and its replies?')) return;
    try { await deleteCommunityPost(postId); await load(); }
    catch { setError('The discussion could not be deleted.'); }
  };

  const removeReply = async (commentId: string) => {
    try { await deleteCommunityComment(commentId); await load(); }
    catch { setError('The reply could not be deleted.'); }
  };

  const submitReport = async (event: FormEvent) => {
    event.preventDefault();
    if (!reportTarget) return;
    setBusy(true); setError(''); setNotice(''); setReportError('');
    try {
      await reportCommunityContent(reportTarget, reportReason, reportDetails);
      setReportTarget(null); setReportDetails(''); setReportReason('other');
      setNotice('Thanks. Your report was sent to the moderation team.');
    } catch (failure) {
      setReportError(failure instanceof Error ? failure.message : 'This content could not be reported.');
    } finally { setBusy(false); }
  };

  const openReport = (target: { postId?: string; commentId?: string }) => {
    setReportReason('other'); setReportDetails(''); setReportError(''); setReportTarget(target);
  };

  return <div className="mx-auto max-w-5xl space-y-6">
    <PageHeader title="Career Community" subtitle="Ask career questions, share learning experiences, and support other members." breadcrumbs={[{ label: 'Community' }]} />
    <div className="rounded-xl border border-brand-blue-100 bg-brand-blue-50 p-4 text-xs leading-5 text-brand-blue-950 dark:border-brand-blue-900 dark:bg-brand-blue-950/40 dark:text-brand-blue-100"><strong>Community guidelines:</strong> Be respectful. Do not post private contact information, passwords, or confidential employer data. Discussions are visible to signed-in members. Use Report to flag harmful content for administrator review.</div>
    {!isSupabaseConfigured && <Card className="p-5 text-sm text-slate-600 dark:text-slate-300">Community discussions are not available in local preview. Configure Supabase and apply the community migration to enable member posts.</Card>}
    {isSupabaseConfigured && <>
      <Card className="p-5 sm:p-6"><form onSubmit={submitPost} className="space-y-3"><h2 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white"><Plus className="h-4 w-4 text-brand-green-600" />Start a discussion</h2><Input label="Discussion title" required minLength={8} maxLength={160} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="What would you like advice or perspectives on?" /><Textarea label="Your post" required minLength={20} maxLength={5000} rows={4} value={body} onChange={(event) => setBody(event.target.value)} placeholder="Share context that is useful, but keep personal or confidential details out." /><div className="flex items-center justify-between gap-3"><span className="text-[11px] text-slate-500">Posted as {user?.fullName || 'you'} · visible to signed-in members</span><Button type="submit" size="sm" variant="primary" disabled={busy || !title.trim() || !body.trim()} leftIcon={<Send className="h-3.5 w-3.5" />}>{busy ? 'Posting…' : 'Post discussion'}</Button></div></form></Card>
      <div className="flex items-center justify-between"><h2 className="font-bold text-slate-900 dark:text-white">Recent discussions</h2><Button variant="secondary" size="sm" onClick={() => void load()} disabled={loading} leftIcon={<RefreshCw className="h-3.5 w-3.5" />}>Refresh</Button></div>
      {error && <p role="status" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">{error}</p>}
      {notice && <p role="status" className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">{notice}</p>}
      {loading ? <Card className="h-32 animate-pulse bg-slate-100 dark:bg-slate-900" /> : posts.length === 0 ? <Card className="p-8 text-center"><MessageCircle className="mx-auto h-8 w-8 text-slate-400" /><p className="mt-3 font-semibold text-slate-800 dark:text-white">No discussions yet</p><p className="mt-1 text-sm text-slate-500">Start a conversation with the community.</p></Card> : <div className="space-y-4">{posts.map((post) => <Card key={post.id} className="space-y-4 p-5 sm:p-6"><div className="flex items-start justify-between gap-3"><div><h3 className="font-bold text-slate-900 dark:text-white">{post.title}</h3><p className="mt-1 text-[11px] text-slate-500">{post.author_id === user?.id ? 'You' : 'Member'} · {new Date(post.created_at).toLocaleDateString()}</p></div><div className="flex items-center gap-1">{post.author_id !== user?.id && <button aria-label="Report discussion" title="Report discussion" onClick={() => openReport({ postId: post.id })} className="rounded-lg p-2 text-slate-400 hover:text-amber-600"><Flag className="h-4 w-4" /></button>}{post.author_id === user?.id && <button aria-label="Delete discussion" onClick={() => void removePost(post.id)} className="rounded-lg p-2 text-slate-400 hover:text-rose-600"><Trash2 className="h-4 w-4" /></button>}</div></div><p className="whitespace-pre-wrap text-sm leading-6 text-slate-700 dark:text-slate-300">{post.body}</p>
        {(post.community_comments || []).length > 0 && <ul className="space-y-2 border-l-2 border-slate-200 pl-4 dark:border-slate-700">{post.community_comments.map((comment) => <li key={comment.id} className="flex items-start justify-between gap-2 rounded-lg bg-slate-50 p-3 dark:bg-slate-800/60"><div><p className="text-[10px] text-slate-500">{comment.author_id === user?.id ? 'You' : 'Member'} · {new Date(comment.created_at).toLocaleDateString()}</p><p className="mt-1 whitespace-pre-wrap text-xs leading-5 text-slate-700 dark:text-slate-300">{comment.body}</p></div><div className="flex shrink-0 items-start gap-1">{comment.author_id !== user?.id && <button aria-label="Report reply" title="Report reply" onClick={() => openReport({ commentId: comment.id })} className="rounded-lg p-1 text-slate-400 hover:text-amber-600"><Flag className="h-3.5 w-3.5" /></button>}{comment.author_id === user?.id && <button aria-label="Delete reply" onClick={() => void removeReply(comment.id)} className="rounded-lg p-1 text-slate-400 hover:text-rose-600"><Trash2 className="h-3.5 w-3.5" /></button>}</div></li>)}</ul>}
        <form onSubmit={(event) => void submitReply(event, post.id)} className="flex flex-col gap-2 border-t border-slate-100 pt-3 dark:border-slate-800 sm:flex-row"><input aria-label="Write a reply" maxLength={2000} value={replies[post.id] || ''} onChange={(event) => setReplies((current) => ({ ...current, [post.id]: event.target.value }))} placeholder="Write a supportive reply…" className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-900" /><Button size="sm" variant="secondary" type="submit" disabled={busy || !(replies[post.id] || '').trim()}>Reply</Button></form>
      </Card>)}</div>}
    </>}
    <Modal isOpen={Boolean(reportTarget)} onClose={() => setReportTarget(null)} title="Report community content" subtitle="Reports are reviewed by CareerLaunch administrators." maxWidth="md">
      <form onSubmit={submitReport} className="space-y-4">
        {reportError && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">{reportError}</p>}
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Reason
          <select value={reportReason} onChange={(event) => setReportReason(event.target.value)} className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950">
            <option value="harassment">Harassment or abuse</option><option value="spam">Spam or promotion</option><option value="private_information">Private or sensitive information</option><option value="misinformation">Misleading or harmful content</option><option value="other">Something else</option>
          </select>
        </label>
        <Textarea label="Additional context (optional)" maxLength={1000} rows={4} value={reportDetails} onChange={(event) => setReportDetails(event.target.value)} placeholder="Explain what moderators should review. Please do not include private details." />
        <div className="flex justify-end gap-2"><Button type="button" variant="secondary" onClick={() => setReportTarget(null)}>Cancel</Button><Button type="submit" variant="primary" disabled={busy}>{busy ? 'Sending…' : 'Send report'}</Button></div>
      </form>
    </Modal>
  </div>;
};
