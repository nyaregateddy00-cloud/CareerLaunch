import { CareerResource } from '../types';
import { INITIAL_RESOURCES } from './mockData';
import { isDevelopmentDemoMode, isSupabaseConfigured, supabase } from './supabase';

type ResourceRow = {
  id: string; title: string; slug: string; category: CareerResource['category'];
  summary: string; content: string; read_time: string | null; author: string | null;
  tags: string[] | null; is_featured: boolean | null; published_at: string;
};

const fromRow = (row: ResourceRow): CareerResource => ({
  id: row.id, title: row.title, slug: row.slug, category: row.category,
  summary: row.summary, content: row.content, readTime: row.read_time || '5 min read',
  author: row.author || 'CareerLaunch', tags: row.tags || [],
  isFeatured: Boolean(row.is_featured), publishedAt: row.published_at,
});

export async function getCareerResources(): Promise<CareerResource[]> {
  if (!isSupabaseConfigured) {
    if (isDevelopmentDemoMode) return INITIAL_RESOURCES;
    throw new Error('Career resources are unavailable because Supabase is not configured.');
  }
  const { data, error } = await supabase.from('resources').select('*').order('published_at', { ascending: false });
  if (error) throw error;
  return ((data || []) as ResourceRow[]).map(fromRow);
}

export async function saveCareerResource(resource: CareerResource): Promise<void> {
  if (!isSupabaseConfigured && isDevelopmentDemoMode) {
    const list = JSON.parse(localStorage.getItem('careerlaunch_resources') || JSON.stringify(INITIAL_RESOURCES)) as CareerResource[];
    const index = list.findIndex((item) => item.id === resource.id);
    if (index >= 0) list[index] = resource;
    else list.unshift(resource);
    localStorage.setItem('careerlaunch_resources', JSON.stringify(list));
    return;
  }
  if (!isSupabaseConfigured) throw new Error('Saving career resources requires Supabase configuration.');
  const { error } = await supabase.from('resources').upsert({
    ...(resource.id.startsWith('res-') ? {} : { id: resource.id }),
    title: resource.title, slug: resource.slug, category: resource.category,
    summary: resource.summary, content: resource.content, read_time: resource.readTime,
    author: resource.author, tags: resource.tags, is_featured: resource.isFeatured,
    published_at: resource.publishedAt,
  }, { onConflict: 'slug' });
  if (error) throw error;
}

export async function deleteCareerResource(id: string): Promise<void> {
  if (!isSupabaseConfigured && isDevelopmentDemoMode) {
    const list = JSON.parse(localStorage.getItem('careerlaunch_resources') || JSON.stringify(INITIAL_RESOURCES)) as CareerResource[];
    localStorage.setItem('careerlaunch_resources', JSON.stringify(list.filter((item) => item.id !== id)));
    return;
  }
  if (!isSupabaseConfigured) throw new Error('Deleting career resources requires Supabase configuration.');
  const { error } = await supabase.from('resources').delete().eq('id', id);
  if (error) throw error;
}
