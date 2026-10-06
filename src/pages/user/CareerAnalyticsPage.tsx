import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Award, BookOpen, BriefcaseBusiness, CheckCircle2, FileText, FolderGit2, Target, TrendingUp, UserRound } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { useAuth } from '../../context/AuthContext';
import { mockStorage } from '../../lib/mockStorage';
import { calculateProfileStrength } from '../../lib/utils';

export const CareerAnalyticsPage: React.FC = () => {
  const { user } = useAuth();
  const data = useMemo(() => {
    if (!user) return null;
    const skills = mockStorage.getUserSkills().filter((item) => item.userId === user.id);
    const experience = mockStorage.getExperience().filter((item) => item.userId === user.id);
    const education = mockStorage.getEducation().filter((item) => item.userId === user.id);
    const projects = mockStorage.getProjects().filter((item) => item.userId === user.id);
    const applications = mockStorage.getApplications().filter((item) => item.userId === user.id);
    const completedLearning = mockStorage.getCompletedResourceIds();
    const cv = mockStorage.getCV();
    const portfolio = mockStorage.getPortfolio();
    const profile = calculateProfileStrength(user, skills, experience, education, projects);
    const interviewSessions = mockStorage.getInterviewSessions();
    const completed = [
      Boolean(user.headline && user.bio), skills.length >= 3, projects.length > 0 || experience.length > 0,
      Boolean(cv.content.summary.trim() || cv.content.experience.length || cv.content.projects.length),
      completedLearning.length > 0, applications.length > 0,
    ].filter(Boolean).length;
    return { skills, experience, education, projects, applications, completedLearning, cv, portfolio, profile, interviewSessions, completed };
  }, [user]);

  if (!user || !data) return null;
  const stages = ['Saved', 'Applied', 'Shortlisted', 'Assessment', 'Interview', 'Offer', 'Rejected', 'Withdrawn'] as const;
  const challenges = [
    { title: 'Complete your career profile', done: Boolean(user.headline && user.bio), detail: 'Add a clear focus and a short introduction.', href: '/profile', icon: UserRound },
    { title: 'Add evidence of your skills', done: data.projects.length > 0, detail: 'Record a project that demonstrates work you have actually done.', href: '/profile', icon: FolderGit2 },
    { title: 'Build a focused CV', done: Boolean(data.cv.content.summary.trim()), detail: 'Write a profile summary grounded in your experience.', href: '/cv-builder', icon: FileText },
    { title: 'Practice an interview answer', done: data.interviewSessions.length > 0, detail: 'Answer a prompt and request coach feedback when AI is configured.', href: '/interview-arena', icon: Target },
    { title: 'Keep learning progress', done: data.completedLearning.length > 0, detail: 'Finish a resource from the learning library.', href: '/learning', icon: BookOpen },
  ];
  const achievements = [
    { label: 'Skills recorded', earned: data.skills.length > 0, count: data.skills.length },
    { label: 'Project added', earned: data.projects.length > 0, count: data.projects.length },
    { label: 'Application tracked', earned: data.applications.length > 0, count: data.applications.length },
    { label: 'Learning completed', earned: data.completedLearning.length > 0, count: data.completedLearning.length },
    { label: 'Interview practice saved', earned: data.interviewSessions.length > 0, count: data.interviewSessions.length },
  ];

  return <div className="mx-auto max-w-6xl space-y-7">
    <PageHeader title="Career Analytics & Growth" subtitle="A snapshot of information you have saved in CareerLaunch, with practical next steps." breadcrumbs={[{ label: 'Career Analytics' }]} />
    <Card className="p-5 sm:p-7"><div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div><div className="flex items-center gap-2 text-brand-blue-800 dark:text-brand-green-300"><TrendingUp className="h-5 w-5" /><span className="text-xs font-bold uppercase tracking-wider">Career Score</span></div><p className="mt-2 text-4xl font-extrabold text-slate-900 dark:text-white">{data.profile.score}<span className="text-lg text-slate-400">/100</span></p><p className="mt-1 max-w-xl text-xs leading-5 text-slate-500">A platform-generated profile completeness indicator based on saved details. It is not a hiring prediction or validated employability assessment.</p></div><div className="w-full sm:max-w-sm"><div className="mb-2 flex justify-between text-xs"><span>Profile checklist</span><span>{data.profile.score}%</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-full rounded-full bg-brand-green-500" style={{ width: `${data.profile.score}%` }} /></div><Link to="/profile" className="mt-3 inline-flex text-xs font-bold text-brand-blue-700 dark:text-brand-green-300">Improve your profile</Link></div></div></Card>

    <section><h2 className="mb-3 text-base font-bold text-slate-900 dark:text-white">Your career activity</h2><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {[
        ['Skills', data.skills.length, '/skills', Award], ['Learning resources', data.completedLearning.length, '/learning', BookOpen],
        ['Projects', data.projects.length, '/profile', FolderGit2], ['Applications', data.applications.length, '/applications', BriefcaseBusiness],
        ['Interview practice', data.interviewSessions.length, '/interview-arena', Target], ['Experience records', data.experience.length, '/profile', UserRound],
        ['Portfolio', data.portfolio.isPublished ? 'Published' : 'Draft', '/portfolio-builder', UserRound], ['Education records', data.education.length, '/profile', FileText],
      ].map(([label, value, href, Icon]) => <Link key={String(label)} to={String(href)}><Card className="flex h-full items-center gap-3 p-4 transition-colors hover:border-brand-blue-300"><span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-blue-50 text-brand-blue-800 dark:bg-brand-blue-950 dark:text-brand-green-300"><Icon className="h-4 w-4" /></span><span><span className="block text-xs text-slate-500">{String(label)}</span><strong className="text-lg text-slate-900 dark:text-white">{String(value)}</strong></span></Card></Link>)}
    </div></section>

    <section className="grid gap-6 lg:grid-cols-2"><Card className="p-5 sm:p-6"><h2 className="font-bold text-slate-900 dark:text-white">Application stages</h2><p className="mt-1 text-xs text-slate-500">Counts from your application tracker.</p><ul className="mt-4 space-y-3">{stages.map((stage) => { const count = data.applications.filter((item) => item.stage === stage).length; return <li key={stage} className="flex items-center justify-between text-sm"><span>{stage}</span><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold dark:bg-slate-800">{count}</span></li>; })}</ul></Card>
      <Card className="p-5 sm:p-6"><h2 className="font-bold text-slate-900 dark:text-white">Growth challenges</h2><p className="mt-1 text-xs text-slate-500">Finish these practical steps using your existing CareerLaunch tools.</p><ul className="mt-4 space-y-3">{challenges.map((challenge) => <li key={challenge.title} className="flex gap-3 rounded-xl border border-slate-100 p-3 dark:border-slate-800"><span className="mt-0.5">{challenge.done ? <CheckCircle2 className="h-4 w-4 text-brand-green-600" /> : <challenge.icon className="h-4 w-4 text-slate-400" />}</span><span className="min-w-0 flex-1"><strong className="block text-xs text-slate-900 dark:text-white">{challenge.title}</strong><span className="mt-0.5 block text-[11px] text-slate-500">{challenge.detail}</span></span><Link to={challenge.href} className="self-center text-[11px] font-bold text-brand-blue-700 dark:text-brand-green-300">{challenge.done ? 'Review' : 'Start'}</Link></li>)}</ul></Card></section>

    <Card className="p-5 sm:p-6"><div className="flex items-center gap-2"><Award className="h-5 w-5 text-brand-green-600" /><h2 className="font-bold text-slate-900 dark:text-white">Career milestones</h2></div><p className="mt-1 text-xs text-slate-500">Milestones are based on your saved activity; no XP or streaks are simulated.</p><div className="mt-4 flex flex-wrap gap-2">{achievements.map((item) => <span key={item.label} className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${item.earned ? 'border-brand-green-200 bg-brand-green-50 text-brand-green-800 dark:border-brand-green-900 dark:bg-brand-green-950/40 dark:text-brand-green-300' : 'border-slate-200 text-slate-500 dark:border-slate-800'}`}>{item.earned ? `✓ ${item.label} · ${item.count}` : item.label}</span>)}</div><div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs dark:border-slate-800"><span className="text-slate-500">{data.completed} of 6 profile-building milestones complete</span><Link to="/career-roadmap" className="font-bold text-brand-blue-700 dark:text-brand-green-300">View career roadmap</Link></div></Card>
    <p className="text-[11px] text-slate-500">Counts refresh from this account’s saved workspace. Application rates and market trends are omitted because this view does not have a validated population dataset.</p>
  </div>;
};
