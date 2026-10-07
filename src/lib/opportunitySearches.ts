import { isSupabaseConfigured, supabase } from './supabase';

export interface SavedOpportunitySearch {
  id?: string;
  label: string;
  filters: { query?: string; type?: string; country?: string; workMode?: string; experienceLevel?: string };
  alertsEnabled: boolean;
  createdAt?: string;
}

const key = (userId: string) => `careerlaunch_saved_searches_${userId}`;
function localSearches(userId: string): SavedOpportunitySearch[] {
  try { return JSON.parse(localStorage.getItem(key(userId)) || '[]') as SavedOpportunitySearch[]; } catch { return []; }
}

export async function saveOpportunitySearch(userId: string, search: SavedOpportunitySearch): Promise<'account' | 'browser'> {
  const local = localSearches(userId).filter((item) => item.label !== search.label);
  const next = [{ ...search, id: `local-${Date.now()}`, createdAt: new Date().toISOString() }, ...local];
  localStorage.setItem(key(userId), JSON.stringify(next));
  if (!isSupabaseConfigured) return 'browser';
  const { error } = await supabase.from('saved_opportunity_searches').upsert({
    user_id: userId,
    label: search.label,
    filters: search.filters,
    alerts_enabled: search.alertsEnabled,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id,label' });
  if (error) {
    console.warn('Saved search is stored in this browser but could not sync to the account.', error.message);
    return 'browser';
  }
  return 'account';
}

export async function getSavedOpportunitySearches(userId: string): Promise<SavedOpportunitySearch[]> {
  const local = localSearches(userId);
  if (!isSupabaseConfigured) return local;
  const { data, error } = await supabase.from('saved_opportunity_searches').select('id,label,filters,alerts_enabled,created_at').eq('user_id', userId).order('created_at', { ascending: false });
  if (error) return local;
  const remote = ((data ?? []) as Array<Record<string, unknown>>).map((row): SavedOpportunitySearch => ({
    id: String(row.id),
    label: String(row.label ?? ''),
    filters: (row.filters && typeof row.filters === 'object' ? row.filters : {}) as SavedOpportunitySearch['filters'],
    alertsEnabled: Boolean(row.alerts_enabled),
    createdAt: String(row.created_at ?? ''),
  }));
  const localOnly = local.filter((item) => item.id?.startsWith('local-') && !remote.some((entry) => entry.label === item.label));
  const combined = [...localOnly, ...remote];
  localStorage.setItem(key(userId), JSON.stringify(combined));
  return combined;
}

export async function setSavedSearchAlerts(userId: string, search: SavedOpportunitySearch, enabled: boolean): Promise<boolean> {
  const next = localSearches(userId).map((item) => item.label === search.label ? { ...item, alertsEnabled: enabled } : item);
  localStorage.setItem(key(userId), JSON.stringify(next));
  if (!isSupabaseConfigured || search.id?.startsWith('local-')) return false;
  const { error } = await supabase.from('saved_opportunity_searches').update({ alerts_enabled: enabled, updated_at: new Date().toISOString() }).eq('user_id', userId).eq('label', search.label);
  return !error;
}

export async function deleteSavedOpportunitySearch(userId: string, search: SavedOpportunitySearch): Promise<boolean> {
  localStorage.setItem(key(userId), JSON.stringify(localSearches(userId).filter((item) => item.label !== search.label)));
  if (!isSupabaseConfigured || search.id?.startsWith('local-')) return false;
  const { error } = await supabase.from('saved_opportunity_searches').delete().eq('user_id', userId).eq('label', search.label);
  return !error;
}
