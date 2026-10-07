import { isSupabaseConfigured, supabase } from './supabase';

export interface PlaybookProgress {
  playbookSlug: string;
  completedTaskIds: string[];
  startedAt: string;
  updatedAt: string;
}

const storageKey = (userId: string) => `careerlaunch_playbook_progress_${userId}`;
const emitChange = (slug: string) => window.dispatchEvent(new CustomEvent('careerlaunch_playbook_progress', { detail: { slug } }));

function readLocal(userId: string): Record<string, PlaybookProgress> {
  try { return JSON.parse(localStorage.getItem(storageKey(userId)) || '{}') as Record<string, PlaybookProgress>; }
  catch { return {}; }
}

export async function getAllPlaybookProgress(userId: string): Promise<Record<string, PlaybookProgress>> {
  const local = readLocal(userId);
  if (!isSupabaseConfigured) return local;
  const { data, error } = await supabase.from('user_playbook_progress').select('playbook_slug,completed_task_ids,started_at,updated_at').eq('user_id', userId);
  if (error) {
    console.warn('Playbook progress is using this browser until the latest CareerLaunch migration is applied.', error.message);
    return local;
  }
  const remote: Record<string, PlaybookProgress> = {};
  for (const row of (data ?? []) as Array<Record<string, unknown>>) {
    const slug = String(row.playbook_slug ?? '');
    if (!slug) continue;
    remote[slug] = {
      playbookSlug: slug,
      completedTaskIds: Array.isArray(row.completed_task_ids) ? row.completed_task_ids.map(String) : [],
      startedAt: String(row.started_at ?? new Date().toISOString()),
      updatedAt: String(row.updated_at ?? new Date().toISOString()),
    };
  }
  localStorage.setItem(storageKey(userId), JSON.stringify(remote));
  return remote;
}

export async function savePlaybookProgress(userId: string, slug: string, taskIds: string[]): Promise<{ progress: PlaybookProgress; synced: boolean }> {
  const current = readLocal(userId)[slug];
  const now = new Date().toISOString();
  const progress: PlaybookProgress = {
    playbookSlug: slug,
    completedTaskIds: [...new Set(taskIds)],
    startedAt: current?.startedAt ?? now,
    updatedAt: now,
  };
  const records = readLocal(userId);
  records[slug] = progress;
  localStorage.setItem(storageKey(userId), JSON.stringify(records));
  emitChange(slug);

  if (isSupabaseConfigured) {
    const { error } = await supabase.from('user_playbook_progress').upsert({
      user_id: userId,
      playbook_slug: slug,
      completed_task_ids: progress.completedTaskIds,
      started_at: progress.startedAt,
      updated_at: now,
    }, { onConflict: 'user_id,playbook_slug' });
    if (error) {
      console.warn('Playbook progress is saved in this browser but could not sync to the account.', error.message);
      return { progress, synced: false };
    }
    return { progress, synced: true };
  }
  return { progress, synced: false };
}
