import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, Clock3, ExternalLink, Sparkles } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { getPlaybookBySlug } from '../../data/playbooks';
import { getAllPlaybookProgress, PlaybookProgress, savePlaybookProgress } from '../../lib/playbooks';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { aiService } from '../../lib/aiService';
import { mockStorage } from '../../lib/mockStorage';

export const PlaybookDetailPage: React.FC = () => {
  const { slug = '' } = useParams();
  const { user } = useAuth();
  const playbook = getPlaybookBySlug(slug);
  const [progress, setProgress] = useState<PlaybookProgress | null>(null);
  const [saving, setSaving] = useState(false);
  const [personalizing, setPersonalizing] = useState(false);
  const [personalization, setPersonalization] = useState('');
  const [syncNotice, setSyncNotice] = useState('');
  const allTasks = useMemo(() => playbook?.steps.flatMap((step) => step.tasks.map((task) => task.id)) ?? [], [playbook]);

  useEffect(() => {
    if (!user || !playbook) return;
    let active = true;
    void getAllPlaybookProgress(user.id).then((items) => { if (active) setProgress(items[playbook.slug] ?? null); });
    return () => { active = false; };
  }, [user, playbook]);

  if (!playbook) return <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900"><h1 className="text-xl font-bold text-slate-900 dark:text-white">Playbook not found</h1><p className="mt-2 text-sm text-slate-500">This playbook may have moved.</p><Link className="mt-4 inline-flex text-sm font-semibold text-brand-blue-700" to="/playbooks">Back to Playbooks</Link></div>;

  const completed = progress?.completedTaskIds ?? [];
  const completeCount = completed.filter((id) => allTasks.includes(id)).length;
  const percent = allTasks.length ? Math.round((completeCount / allTasks.length) * 100) : 0;
  const nextTask = playbook.steps.flatMap((step) => step.tasks.map((task) => ({ ...task, step: step.title }))).find((task) => !completed.includes(task.id));
  const updateTask = async (taskId: string) => {
    if (!user || saving) return;
    const next = completed.includes(taskId) ? completed.filter((id) => id !== taskId) : [...completed, taskId];
    setProgress({ playbookSlug: playbook.slug, completedTaskIds: next, startedAt: progress?.startedAt ?? new Date().toISOString(), updatedAt: new Date().toISOString() });
    setSaving(true);
    const saved = await savePlaybookProgress(user.id, playbook.slug, next);
    setSyncNotice(saved.synced ? '' : 'Progress is saved in this browser. Apply the latest Supabase migration to sync it to your account.');
    setSaving(false);
  };

  const personalize = async () => {
    if (!user || personalizing) return;
    setPersonalizing(true);
    setPersonalization('');
    const skills = mockStorage.getUserSkills().filter((item) => item.userId === user.id).map((item) => `${item.skillName} (${item.proficiencyLevel})`);
    const education = mockStorage.getEducation().filter((item) => item.userId === user.id).map((item) => `${item.degree} in ${item.fieldOfStudy} at ${item.institution}`);
    const response = await aiService.sendMessage(
      `Personalize the following career playbook to my saved career information. Return: (1) the 3 most relevant steps to prioritize, (2) practical adjustments for my context, and (3) any information you need me to add. Do not claim I have qualifications or experience that are not listed. Do not invent jobs, deadlines, or credentials.\n\nPlaybook: ${playbook.title}\nAudience: ${playbook.audience}\nSteps: ${playbook.steps.map((step) => `${step.title}: ${step.guidance}`).join('\n')}\nSkills: ${playbook.skills.join(', ')}`,
      [],
      'career_path',
      { fullName: user.fullName, headline: user.headline, skills, careerContext: JSON.stringify({ role: user.role, location: user.location, education, bio: user.bio }) },
    );
    setPersonalization(response.success ? response.content : response.error || 'CareerLaunch AI could not personalize this playbook right now.');
    setPersonalizing(false);
  };

  return <div className="mx-auto max-w-5xl space-y-6">
    <Link to="/playbooks" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-brand-blue-700"><ArrowLeft className="h-4 w-4" /> All Playbooks</Link>
    <Card className="overflow-hidden p-0">
      <div className="bg-gradient-to-br from-brand-blue-950 via-brand-blue-900 to-brand-blue-800 px-6 py-8 text-white sm:px-9 sm:py-10">
        <div className="mb-4 flex flex-wrap gap-2"><span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">{playbook.category}</span><span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">{playbook.audience}</span></div>
        <h1 className="max-w-3xl text-2xl font-extrabold sm:text-4xl">{playbook.title}</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-blue-100 sm:text-base">{playbook.description}</p>
        <div className="mt-5 flex items-center gap-2 text-xs text-blue-100"><Clock3 className="h-4 w-4" /> {playbook.difficulty} · {playbook.duration} · {playbook.steps.length} practical steps</div>
      </div>
      <div className="grid gap-6 p-5 sm:p-8 lg:grid-cols-[1fr_280px]">
        <div className="space-y-5">
          {playbook.steps.map((step, index) => <section key={step.id} className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
            <div className="mb-3 flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-blue-50 text-xs font-extrabold text-brand-blue-700 dark:bg-brand-blue-950 dark:text-brand-blue-300">{String(index + 1).padStart(2, '0')}</span><h2 className="text-base font-bold text-slate-900 dark:text-white">{step.title}</h2></div>
            <p className="mb-4 text-sm leading-6 text-slate-600 dark:text-slate-400">{step.guidance}</p>
            <div className="space-y-2">{step.tasks.map((task) => {
              const checked = completed.includes(task.id);
              return <label key={task.id} className="flex cursor-pointer items-start gap-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-700 transition hover:bg-brand-blue-50 dark:bg-slate-800/70 dark:text-slate-200 dark:hover:bg-slate-800">
                <input className="sr-only" type="checkbox" checked={checked} disabled={!user || saving} onChange={() => void updateTask(task.id)} />
                {checked ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-green-600" /> : <Circle className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />}
                <span>{task.label}</span>
              </label>;
            })}</div>
          </section>)}
        </div>
        <aside className="space-y-4">
          <Card className="p-5"><h2 className="font-bold text-slate-900 dark:text-white">Your progress</h2><p className="mt-1 text-xs text-slate-500">{completeCount} of {allTasks.length} actions complete</p><div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-full rounded-full bg-brand-green-500 transition-[width] duration-300" style={{ width: `${percent}%` }} /></div><p className="mt-2 text-right text-xs font-bold text-brand-green-700 dark:text-brand-green-400">{percent}%</p>{nextTask && <div className="mt-4 rounded-xl bg-brand-blue-50 p-3 dark:bg-brand-blue-950/50"><p className="text-[10px] font-bold uppercase tracking-wide text-brand-blue-700 dark:text-brand-blue-300">Recommended next</p><p className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-100">{nextTask.step}</p><p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{nextTask.label}</p></div>}{!user && <p className="mt-3 text-xs text-amber-700">Sign in to save your progress across devices.</p>}{syncNotice && <p className="mt-3 text-[11px] leading-5 text-amber-700 dark:text-amber-300" role="status">{syncNotice}</p>}</Card>
          {user && <Card className="p-5"><h2 className="font-bold text-slate-900 dark:text-white">Make it yours</h2><p className="mt-1 text-xs leading-5 text-slate-500">CareerLaunch AI can adapt these steps to the skills and education saved in your profile.</p><button type="button" disabled={personalizing} onClick={() => void personalize()} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-brand-blue-200 px-3 py-2.5 text-xs font-bold text-brand-blue-700 transition hover:bg-brand-blue-50 disabled:opacity-60 dark:border-slate-700 dark:text-brand-green-300 dark:hover:bg-slate-800"><Sparkles className="h-4 w-4" />{personalizing ? 'Personalizing…' : 'Personalize with CareerLaunch AI'}</button>{personalization && <div className="mt-3 whitespace-pre-wrap rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-700 dark:bg-slate-800 dark:text-slate-300" role="status">{personalization}</div>}</Card>}
          <Card className="p-5"><h2 className="font-bold text-slate-900 dark:text-white">Skills in this journey</h2><div className="mt-3 flex flex-wrap gap-2">{playbook.skills.map((skill) => <span key={skill} className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">{skill}</span>)}</div></Card>
          {playbook.resources.length > 0 && <Card className="p-5"><h2 className="font-bold text-slate-900 dark:text-white">CareerLaunch tools</h2><div className="mt-3 space-y-2">{playbook.resources.map((resource) => <Link key={resource.href + resource.label} to={resource.href} className="flex items-center justify-between gap-2 rounded-lg p-2 text-xs font-semibold text-brand-blue-700 hover:bg-brand-blue-50 dark:text-brand-green-300 dark:hover:bg-slate-800">{resource.label}<ExternalLink className="h-3.5 w-3.5" /></Link>)}</div></Card>}
          <Card className="p-5"><h2 className="font-bold text-slate-900 dark:text-white">Related opportunities</h2><div className="mt-3 flex flex-wrap gap-2">{playbook.relatedOpportunities.map((type) => <Link key={type} to={`/app/opportunities?type=${encodeURIComponent(type)}`} className="rounded-full border border-slate-200 px-2.5 py-1.5 text-[10px] font-semibold text-brand-blue-700 hover:border-brand-blue-400 dark:border-slate-700 dark:text-brand-green-300">{type}</Link>)}</div></Card>
          <Link to="/app/opportunities" className="flex w-full items-center justify-between rounded-xl bg-brand-green-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-brand-green-700">Find related opportunities <ArrowRight className="h-4 w-4" /></Link>
        </aside>
      </div>
    </Card>
  </div>;
};
