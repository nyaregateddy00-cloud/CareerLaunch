import { Education, Experience, PortfolioConfig, Project, PublicPortfolioProfile, UserSkill } from '../types';
import { isSupabaseConfigured, supabase } from './supabase';
import { mockStorage } from './mockStorage';

export interface PublicPortfolioData {
  profile: PublicPortfolioProfile;
  projects: Project[];
  experience: Experience[];
  education: Education[];
  skills: UserSkill[];
}

export async function savePortfolioConfig(portfolio: PortfolioConfig): Promise<void> {
  if (!isSupabaseConfigured) {
    mockStorage.savePortfolio(portfolio);
    return;
  }
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error('Sign in again before saving your portfolio.');
  const { error } = await supabase.from('portfolios').upsert({
    user_id: user.id,
    slug: portfolio.slug,
    headline: portfolio.headline,
    bio: portfolio.bio,
    theme: portfolio.theme,
    is_published: portfolio.isPublished,
    social_links: portfolio.socialLinks,
    custom_sections: {
      featuredProjectIds: portfolio.featuredProjectIds,
      publicSections: portfolio.publicSections || {},
    },
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id' });
  if (error) throw error;
  mockStorage.savePortfolio(portfolio);
}

export async function getPublicPortfolio(slug: string): Promise<PublicPortfolioData | null> {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase.rpc('get_public_portfolio', { p_slug: slug });
  if (error) throw error;
  if (!data || typeof data !== 'object') return null;
  const result = data as PublicPortfolioData;
  if (!result.profile || !Array.isArray(result.projects)) return null;
  return result;
}
