import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PublicPortfolioView } from '../../components/portfolio/PublicPortfolioView';
import { mockStorage } from '../../lib/mockStorage';
import { getPublicPortfolio, PublicPortfolioData } from '../../lib/portfolio';
import { isSupabaseConfigured } from '../../lib/supabase';
import { INITIAL_USER_TEDDY } from '../../lib/mockData';
import { safeExternalUrl } from '../../lib/utils';

export const PublicPortfolioPage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [data, setData] = useState<PublicPortfolioData | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    if (isSupabaseConfigured) {
      setLoading(true);
      getPublicPortfolio(username || '').then((result) => { if (active) setData(result); })
        .catch(() => { if (active) setError(true); })
        .finally(() => { if (active) setLoading(false); });
    } else {
      const user = mockStorage.getAllUsers().find((item) => item.fullName.toLowerCase().replace(/\s+/g, '') === username?.toLowerCase());
      const portfolio = mockStorage.getPortfolio();
      if (user?.id === INITIAL_USER_TEDDY.id && portfolio.isPublished && portfolio.slug === username) {
        const sections = portfolio.publicSections;
        setData({
          profile: {
            fullName: user.fullName,
            avatarUrl: sections?.photo ? safeExternalUrl(user.avatarUrl) : undefined,
            email: sections?.email ? portfolio.socialLinks.email || '' : '',
            headline: sections?.headline ? portfolio.headline : '',
            bio: sections?.bio ? portfolio.bio : '',
            location: sections?.location ? user.location : '',
            githubUrl: sections?.socialLinks ? safeExternalUrl(portfolio.socialLinks.github) : undefined,
            linkedinUrl: sections?.socialLinks ? safeExternalUrl(portfolio.socialLinks.linkedin) : undefined,
            twitterUrl: sections?.socialLinks ? safeExternalUrl(portfolio.socialLinks.twitter) : undefined,
            websiteUrl: sections?.socialLinks ? safeExternalUrl(portfolio.socialLinks.website) : undefined,
          },
          projects: sections?.projects ? mockStorage.getProjects().filter((item) => item.userId === user.id && portfolio.featuredProjectIds.includes(item.id)) : [],
          experience: sections?.experience ? mockStorage.getExperience().filter((item) => item.userId === user.id) : [],
          education: sections?.education ? mockStorage.getEducation().filter((item) => item.userId === user.id) : [],
          skills: sections?.skills ? mockStorage.getUserSkills().filter((item) => item.userId === user.id) : [],
        });
      }
    }
    return () => { active = false; };
  }, [username]);

  if (loading) return <main className="mx-auto max-w-3xl p-8 text-center text-sm text-slate-500">Loading public portfolio…</main>;
  if (error) return <main role="alert" className="mx-auto max-w-3xl p-8 text-center"><h1 className="text-xl font-bold text-slate-900 dark:text-white">Portfolio unavailable</h1><p className="mt-2 text-sm text-slate-500">We couldn’t load this public portfolio. Confirm the portfolio database migration is applied and try again.</p></main>;
  if (!data) return <main className="mx-auto max-w-3xl p-8 text-center"><h1 className="text-xl font-bold text-slate-900 dark:text-white">This portfolio isn’t public</h1><p className="mt-2 text-sm text-slate-500">The owner may not have published a portfolio with this address.</p></main>;

  return <><div className="bg-amber-50 px-4 py-2 text-center text-xs text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">{isSupabaseConfigured ? 'Public portfolio' : 'Local demo preview — sample profile content'}</div><PublicPortfolioView user={data.profile} projects={data.projects} experience={data.experience} education={data.education} skills={data.skills} /></>;
};
