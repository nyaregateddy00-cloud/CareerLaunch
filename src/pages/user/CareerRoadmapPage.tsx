import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Briefcase, CheckCircle2, Circle, FileText, FolderGit2, Goal, Lightbulb, Rocket, Sparkles, Target, UserRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { PageHeader } from '../../components/common/PageHeader';
import { mockStorage } from '../../lib/mockStorage';

export const CareerRoadmapPage: React.FC = () => {
  const { user } = useAuth();
  const records = useMemo(() => {
    if (!user) return null;
    return {
      skills: mockStorage.getUserSkills().filter((item) => item.userId === user.id),
      projects: mockStorage.getProjects().filter((item) => item.userId === user.id),
      experience: mockStorage.getExperience().filter((item) => item.userId === user.id),
      applications: mockStorage.getApplications().filter((item) => item.userId === user.id),
      savedOpportunityIds: mockStorage.getSavedOpportunityIds(),
      cv: mockStorage.getCV(),
      portfolio: mockStorage.getPortfolio(),
      completedLearningIds: mockStorage.getCompletedResourceIds(),
    };
  }, [user]);

  if (!user || !records) return null;

  const steps = [
    { phase: 'BUILD', title: 'Choose your career focus', detail: user.headline || 'Add the role or direction you want CareerLaunch to help you work toward.', done: Boolean(user.headline.trim()), href: '/profile', action: 'Set career focus', icon: Goal },
    { phase: 'LEARN', title: 'Learn with a purpose', detail: records.completedLearningIds.length ? `${records.completedLearningIds.length} learning ${records.completedLearningIds.length === 1 ? 'resource completed' : 'resources completed'}.` : 'Choose a career guide or learning resource and record your progress.', done: records.completedLearningIds.length > 0, href: '/learning', action: 'Explore learning', icon: BookOpen },
    { phase: 'BUILD', title: 'Develop your skills', detail: `${records.skills.length} skills saved to your profile. Add skills you can discuss and demonstrate.`, done: records.skills.length >= 3, href: '/skills', action: 'Review skills', icon: Sparkles },
    { phase: 'PROVE', title: 'Show evidence of your skills', detail: records.projects.length ? `${records.projects.length} ${records.projects.length === 1 ? 'project' : 'projects'} and ${records.experience.length} experience entries on your profile.` : 'Add a project, attachment, freelance engagement, or work experience.', done: records.projects.length > 0 || records.experience.length > 0, href: '/profile', action: 'Add proof of work', icon: FolderGit2 },
    { phase: 'PRESENT', title: 'Prepare your CV', detail: records.cv.content.summary.trim() || records.cv.content.experience.length ? 'Your CV has saved content. Review it for the opportunity you want.' : 'Build your CV from your saved profile, education, skills, and projects.', done: Boolean(records.cv.content.summary.trim() || records.cv.content.experience.length || records.cv.content.projects.length), href: '/cv-builder', action: 'Open CV builder', icon: FileText },
    { phase: 'PRESENT', title: 'Publish a portfolio when ready', detail: records.portfolio.isPublished ? 'Your portfolio is marked as published.' : 'Select the projects and profile details you want to share publicly.', done: records.portfolio.isPublished, href: '/portfolio-builder', action: 'Review portfolio', icon: UserRound },
    { phase: 'DISCOVER', title: 'Find relevant opportunities', detail: `${records.savedOpportunityIds.length} opportunities saved. Check each listing source for current details.`, done: records.savedOpportunityIds.length > 0, href: '/app/opportunities', action: 'Explore opportunities', icon: Briefcase },
    { phase: 'APPLY', title: 'Track your applications', detail: `${records.applications.length} applications in your tracker. Keep stages and follow-up dates up to date.`, done: records.applications.length > 0, href: '/applications', action: 'Open application tracker', icon: Target },
    { phase: 'PREPARE', title: 'Get ready for interviews', detail: records.applications.some((item) => item.stage === 'Interview') ? 'An application is at the interview stage. Use the Career Coach to practice.' : 'When an interview is scheduled, use the Career Coach to plan and practice.', done: records.applications.some((item) => item.stage === 'Interview'), href: '/ai-assistant', action: 'Open Career Coach', icon: Lightbulb },
  ];
  const completedCount = steps.filter((step) => step.done).length;
  const nextStepIndex = steps.findIndex((step) => !step.done);

  return (
    <div className="mx-auto max-w-5xl space-y-7">
      <PageHeader title="Your Career Roadmap" subtitle="A practical path from your current profile toward the work you want. Each step reflects information saved in your workspace." breadcrumbs={[{ label: 'Career Roadmap' }]} />

      <Card className="overflow-hidden p-0">
        <div className="bg-brand-blue-950 px-5 py-6 text-white sm:px-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="text-xs font-bold uppercase tracking-[.16em] text-brand-green-300">{user.headline ? 'Your current focus' : 'Start with your direction'}</p><h2 className="mt-2 text-xl font-extrabold sm:text-2xl">{user.headline || 'Build your skills. Launch your career.'}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">Learn → Build → Prove → Present → Discover → Apply → Prepare → Grow</p></div>
            <div className="min-w-44"><div className="flex items-center justify-between text-xs"><span className="text-slate-300">Journey progress</span><span className="font-bold text-white">{completedCount} / {steps.length}</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-brand-green-400 transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${completedCount / steps.length * 100}%` }} /></div></div>
          </div>
        </div>
        <div className="grid gap-3 border-t border-slate-100 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-900/50 sm:grid-cols-3 sm:p-6">
          <div><p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Skills</p><p className="mt-1 text-lg font-extrabold text-slate-900 dark:text-white">{records.skills.length}</p></div>
          <div><p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Proof of work</p><p className="mt-1 text-lg font-extrabold text-slate-900 dark:text-white">{records.projects.length + records.experience.length}</p></div>
          <div><p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Applications</p><p className="mt-1 text-lg font-extrabold text-slate-900 dark:text-white">{records.applications.length}</p></div>
        </div>
      </Card>

      <div className="flex items-start gap-3 rounded-xl border border-brand-blue-100 bg-brand-blue-50 p-4 text-xs leading-5 text-brand-blue-950 dark:border-brand-blue-900 dark:bg-brand-blue-950/40 dark:text-brand-blue-100">
        <Rocket className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <p>This checklist is built from your saved CareerLaunch records. It is a planning aid, not an assessment or a promise of employment. Your career focus comes from your profile headline; change it whenever your goals change.</p>
      </div>

      <ol className="space-y-3" aria-label="Career roadmap steps">
        {steps.map((step, index) => {
          const current = !step.done && (nextStepIndex === -1 ? false : index === nextStepIndex);
          const StepIcon = step.icon;
          return (
            <li key={step.title}>
              <Card className={`p-4 sm:p-5 ${current ? 'border-brand-green-300 ring-1 ring-brand-green-200 dark:border-brand-green-800 dark:ring-brand-green-900' : ''}`}>
                <div className="flex items-start gap-3 sm:gap-4">
                  <span className={`mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl ${step.done ? 'bg-brand-green-100 text-brand-green-800 dark:bg-brand-green-950 dark:text-brand-green-300' : current ? 'bg-brand-blue-100 text-brand-blue-800 dark:bg-brand-blue-950 dark:text-brand-blue-300' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                    {step.done ? <CheckCircle2 className="h-5 w-5" aria-hidden="true" /> : <StepIcon className="h-5 w-5" aria-hidden="true" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2"><span className="text-[10px] font-bold tracking-[.14em] text-brand-green-700 dark:text-brand-green-400">{step.phase}</span><span className="text-[10px] font-semibold text-slate-400">STEP {String(index + 1).padStart(2, '0')}</span>{current && <span className="rounded-full bg-brand-green-100 px-2 py-0.5 text-[10px] font-bold text-brand-green-800 dark:bg-brand-green-950 dark:text-brand-green-300">CURRENT FOCUS</span>}{step.done && <span className="text-[10px] font-semibold text-brand-green-700 dark:text-brand-green-400">Complete</span>}</div>
                    <h3 className="mt-1 text-sm font-extrabold text-slate-900 dark:text-white">{step.title}</h3>
                    <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">{step.detail}</p>
                  </div>
                  <Link to={step.href} className="hidden shrink-0 sm:block"><Button size="sm" variant={current ? 'accent' : 'secondary'} rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>{step.action}</Button></Link>
                </div>
                <Link to={step.href} className="mt-3 block sm:hidden"><Button size="sm" variant={current ? 'accent' : 'secondary'} className="w-full justify-center" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>{step.action}</Button></Link>
              </Card>
            </li>
          );
        })}
        <li><Card className="border-dashed bg-transparent p-4 sm:p-5"><div className="flex items-start gap-3"><span className="mt-0.5 grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"><Circle className="h-4 w-4"/></span><div><span className="text-[10px] font-bold tracking-[.14em] text-slate-500">GROW · ONGOING</span><h3 className="mt-1 text-sm font-extrabold text-slate-900 dark:text-white">Keep learning and adapting</h3><p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">Return to your roadmap as your goals, skills, and opportunities change.</p><Link to="/learning" className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-brand-blue-700 hover:underline dark:text-brand-green-400">Continue learning <ArrowRight className="h-3.5 w-3.5"/></Link></div></div></Card></li>
      </ol>
    </div>
  );
};
