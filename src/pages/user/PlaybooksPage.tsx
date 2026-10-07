import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, BookOpen, Search, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CAREER_PLAYBOOKS } from '../../data/playbooks';
import { getAllPlaybookProgress, PlaybookProgress } from '../../lib/playbooks';
import { useAuth } from '../../context/AuthContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';

export const PlaybooksPage: React.FC = () => {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [progress, setProgress] = useState<Record<string, PlaybookProgress>>({});

  useEffect(() => {
    if (!user) return;
    let active = true;
    void getAllPlaybookProgress(user.id).then((value) => { if (active) setProgress(value); });
    const refresh = () => void getAllPlaybookProgress(user.id).then((value) => { if (active) setProgress(value); });
    window.addEventListener('careerlaunch_playbook_progress', refresh);
    return () => { active = false; window.removeEventListener('careerlaunch_playbook_progress', refresh); };
  }, [user]);

  const categories = useMemo(() => ['All', ...new Set(CAREER_PLAYBOOKS.map((item) => item.category))], []);
  const recommended = useMemo(() => {
    const focus = `${user?.headline ?? ''} ${user?.bio ?? ''} ${user?.role ?? ''}`.toLowerCase();
    if (/student|graduate|intern/.test(focus)) return 'first-internship';
    if (/software|developer|engineer|tech/.test(focus)) return 'software-developer';
    if (/data|analyst/.test(focus)) return 'data-analyst';
    if (/freelance/.test(focus)) return 'start-freelancing';
    return 'launch-career-from-africa';
  }, [user]);
  const filtered = CAREER_PLAYBOOKS.filter((item) => {
    const text = `${item.title} ${item.description} ${item.skills.join(' ')} ${item.category}`.toLowerCase();
    return (category === 'All' || item.category === category) && text.includes(query.toLowerCase().trim());
  });

  return <div className="space-y-7">
    <PageHeader title="Career Playbooks" subtitle="Practical, step-by-step journeys for building skills, preparing applications, and moving your career forward." />
    <Card className="overflow-hidden border-brand-blue-200 bg-gradient-to-r from-brand-blue-950 to-brand-blue-800 p-6 text-white dark:border-brand-blue-800 sm:p-8">
      <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
        <div><p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-brand-green-300"><Sparkles className="h-4 w-4" /> CareerLaunch guidance</p>
          <h2 className="text-xl font-bold sm:text-2xl">A clear next step, built around your career.</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100">Choose a focused playbook, complete practical tasks at your own pace, and connect the work to real opportunities across Africa and beyond.</p>
        </div>
        <Link to={`/playbooks/${recommended}`} className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-green-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-green-600">Recommended for you <ArrowRight className="h-4 w-4" /></Link>
      </div>
    </Card>
    <div className="flex flex-col gap-3 sm:flex-row">
      <label className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search playbooks or skills" className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-brand-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white" /></label>
      <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filter playbooks by category" className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white">{categories.map((item) => <option key={item}>{item}</option>)}</select>
    </div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {filtered.map((item) => {
        const taskCount = item.steps.reduce((total, step) => total + step.tasks.length, 0);
        const done = progress[item.slug]?.completedTaskIds.length ?? 0;
        const percent = taskCount ? Math.min(100, Math.round((done / taskCount) * 100)) : 0;
        return <Link key={item.slug} to={`/playbooks/${item.slug}`} className="group block rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-blue-500">
          <Card hoverEffect className="flex h-full flex-col p-5 transition-transform motion-safe:group-hover:-translate-y-0.5">
            <div className="mb-4 flex items-center justify-between gap-2"><span className="rounded-full bg-brand-blue-50 px-3 py-1 text-[11px] font-bold text-brand-blue-700 dark:bg-brand-blue-950 dark:text-brand-blue-300">{item.category}</span><BookOpen className="h-4 w-4 text-brand-green-600" /></div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-blue-700 dark:text-white">{item.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-400">{item.description}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">{item.skills.slice(0, 3).map((skill) => <span key={skill} className="rounded-md bg-slate-100 px-2 py-1 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-300">{skill}</span>)}</div>
            <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800"><div className="mb-2 flex justify-between text-[11px] text-slate-500"><span>{done ? `${done} of ${taskCount} tasks complete` : `${item.difficulty} · ${item.steps.length} steps · ${item.duration}`}</span><span>{percent}%</span></div><div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-full rounded-full bg-brand-green-500 transition-[width]" style={{ width: `${percent}%` }} /></div></div>
          </Card>
        </Link>;
      })}
    </div>
    {!filtered.length && <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">No playbooks match that search. Try another role, skill, or category.</p>}
  </div>;
};
