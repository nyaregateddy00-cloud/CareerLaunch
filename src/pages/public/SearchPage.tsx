import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, BookOpen, BriefcaseBusiness, FolderGit2, Search, Sparkles } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { EmptyState } from '../../components/common/EmptyState';
import { Input } from '../../components/common/Input';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { getPublishedOpportunities } from '../../lib/opportunities';
import { getCareerResources } from '../../lib/resources';
import { mockStorage } from '../../lib/mockStorage';
import { Opportunity, CareerResource } from '../../types';
import { isSupabaseConfigured } from '../../lib/supabase';

const matches = (query: string, values: Array<string | undefined>) => {
  const needle = query.trim().toLowerCase();
  return Boolean(needle) && values.some((value) => value?.toLowerCase().includes(needle));
};

export const SearchPage: React.FC = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [resources, setResources] = useState<CareerResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [sourceError, setSourceError] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.allSettled([getPublishedOpportunities(), getCareerResources()]).then(([opportunityResult, resourceResult]) => {
      if (!active) return;
      if (opportunityResult.status === 'fulfilled') setOpportunities(opportunityResult.value);
      else setSourceError(true);
      if (resourceResult.status === 'fulfilled') setResources(resourceResult.value);
      else setSourceError(true);
      setLoading(false);
    });
    return () => { active = false; };
  }, []);

  const onSearch = (event: FormEvent) => {
    event.preventDefault();
    const next = new URLSearchParams(searchParams);
    const normalized = query.trim();
    if (normalized) next.set('q', normalized); else next.delete('q');
    setSearchParams(next);
  };

  const results = useMemo(() => {
    const needle = searchParams.get('q') || query;
    const matchingOpportunities = opportunities.filter((item) => matches(needle, [item.title, item.company, item.country, item.location, item.description, ...item.tags, ...item.requirements]));
    const matchingResources = resources.filter((item) => matches(needle, [item.title, item.summary, item.category, ...item.tags]));
    const matchingSkills = user ? mockStorage.getUserSkills().filter((item) => item.userId === user.id && matches(needle, [item.skillName, item.category])) : [];
    const matchingProjects = user ? mockStorage.getProjects().filter((item) => item.userId === user.id && matches(needle, [item.title, item.description, ...item.tags])) : [];
    return { opportunities: matchingOpportunities, resources: matchingResources, skills: matchingSkills, projects: matchingProjects };
  }, [opportunities, resources, query, searchParams, user]);

  const submittedQuery = searchParams.get('q') || '';
  const count = results.opportunities.length + results.resources.length + results.skills.length + results.projects.length;

  return <div className="mx-auto w-full min-w-0 max-w-5xl space-y-6">
    <PageHeader title="Search CareerLaunch" subtitle="Look across published opportunities, career resources, and your saved skills and projects." breadcrumbs={[{ label: 'Search' }]} />
    {!isSupabaseConfigured && <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">Local preview mode: learning resources may include sample content.</p>}
    <form onSubmit={onSearch} className="flex flex-col gap-3 sm:flex-row">
      <div className="min-w-0 flex-1"><Input label="Search opportunities, resources, skills, or projects" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try ‘frontend’, ‘interview’, or a country" /></div>
      <Button type="submit" variant="primary" leftIcon={<Search className="h-4 w-4" />} className="self-end">Search</Button>
    </form>
    {!submittedQuery ? <EmptyState title="Search across your career workspace" description="Enter a role, skill, resource topic, company, or country to see matching results." icon={<Sparkles className="h-8 w-8 text-brand-green-500" />} /> : loading ? <div role="status" aria-label="Searching" className="grid gap-3 sm:grid-cols-2"><div className="h-28 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" /><div className="h-28 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" /></div> : <>
      <p className="text-xs text-slate-500">{count} result{count === 1 ? '' : 's'} for “{submittedQuery}”{sourceError ? ' · Some sources could not be loaded.' : ''}</p>
      {results.opportunities.length > 0 && <section aria-labelledby="search-opportunities"><h2 id="search-opportunities" className="mb-3 flex items-center gap-2 font-bold text-slate-900 dark:text-white"><BriefcaseBusiness className="h-4 w-4 text-brand-blue-700 dark:text-brand-green-400" />Published opportunities</h2><div className="grid gap-3 sm:grid-cols-2">{results.opportunities.map((item) => <Link key={item.id} to={`/opportunities?country=${encodeURIComponent(item.country)}`}><Card className="h-full p-4 transition-colors hover:border-brand-blue-300"><strong className="block text-sm text-slate-900 dark:text-white">{item.title}</strong><span className="mt-1 block text-xs text-slate-500">{item.company} · {item.location}, {item.country}</span><span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand-blue-700 dark:text-brand-green-300">View catalog <ArrowRight className="h-3 w-3" /></span></Card></Link>)}</div></section>}
      {results.resources.length > 0 && <section aria-labelledby="search-resources"><h2 id="search-resources" className="mb-3 flex items-center gap-2 font-bold text-slate-900 dark:text-white"><BookOpen className="h-4 w-4 text-brand-blue-700 dark:text-brand-green-400" />Career resources</h2><div className="grid gap-3 sm:grid-cols-2">{results.resources.map((item) => <Link key={item.id} to={`/resources?q=${encodeURIComponent(submittedQuery)}`}><Card className="h-full p-4 transition-colors hover:border-brand-blue-300"><strong className="block text-sm text-slate-900 dark:text-white">{item.title}</strong><span className="mt-1 block text-xs text-slate-500">{item.category} · {item.readTime}</span><p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-600 dark:text-slate-300">{item.summary}</p></Card></Link>)}</div></section>}
      {(results.skills.length > 0 || results.projects.length > 0) && <section aria-labelledby="search-profile"><h2 id="search-profile" className="mb-3 flex items-center gap-2 font-bold text-slate-900 dark:text-white"><FolderGit2 className="h-4 w-4 text-brand-blue-700 dark:text-brand-green-400" />Your career profile</h2><div className="grid gap-3 sm:grid-cols-2">{results.skills.map((item) => <Link key={item.id} to="/skills"><Card className="p-4"><strong className="text-sm text-slate-900 dark:text-white">{item.skillName}</strong><p className="mt-1 text-xs text-slate-500">Skill · {item.category}</p></Card></Link>)}{results.projects.map((item) => <Link key={item.id} to="/profile"><Card className="p-4"><strong className="text-sm text-slate-900 dark:text-white">{item.title}</strong><p className="mt-1 line-clamp-2 text-xs text-slate-500">Project · {item.description}</p></Card></Link>)}</div></section>}
      {count === 0 && <EmptyState title="No matching results" description="Try a broader search term or browse the opportunity catalog and resource library." icon={<Search className="h-8 w-8 text-slate-400" />} action={<div className="flex flex-wrap justify-center gap-2"><Link to="/opportunities"><Button size="sm" variant="secondary">Browse opportunities</Button></Link><Link to="/resources"><Button size="sm" variant="outline">Explore resources</Button></Link></div>} />}
    </>}
  </div>;
};
