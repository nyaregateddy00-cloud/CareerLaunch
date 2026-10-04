import { ExperienceLevel, Opportunity, WorkMode } from '../types';
import { isSupabaseConfigured, supabase } from './supabase';

export async function getPublishedOpportunities(): Promise<Opportunity[]> {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from('opportunities')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) throw error;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (data ?? [])
    .filter((row) => !row.deadline || new Date(`${row.deadline}T00:00:00`).getTime() >= today.getTime())
    .map((row) => ({
      id: row.id,
      title: row.title,
      company: row.company,
      companyLogo: row.company_logo ?? undefined,
      location: row.location,
      country: row.country ?? 'Kenya',
      type: row.type as Opportunity['type'],
      workMode: row.work_mode as WorkMode | null,
      experienceLevel: (row.experience_level ?? 'Entry Level') as ExperienceLevel,
      salaryRange: row.salary_range ?? undefined,
      currency: (row.currency ?? 'KES') as Opportunity['currency'],
      deadline: row.deadline ?? undefined,
      description: row.description,
      requirements: row.requirements ?? [],
      tags: row.tags ?? [],
      applicationUrl: row.application_url ?? undefined,
      contactEmail: row.contact_email ?? undefined,
      source: row.source ?? 'Employer listing',
      status: row.status as Opportunity['status'],
      createdAt: row.created_at,
    }));
}
