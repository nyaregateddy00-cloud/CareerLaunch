import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Globe,
  Bot,
  Sparkles,
  ArrowRight,
  Clock,
  Briefcase,
  CheckCircle2,
  Calendar,
  Compass,
  Target,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockStorage } from '../../lib/mockStorage';
import { Opportunity, JobApplication } from '../../types';
import { ProfileStrengthCard } from '../../components/dashboard/ProfileStrengthCard';
import { StatsOverview } from '../../components/dashboard/StatsOverview';
import { OpportunityCard } from '../../components/opportunities/OpportunityCard';
import { OpportunityDetailModal } from '../../components/opportunities/OpportunityDetailModal';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { formatDate } from '../../lib/utils';
import { getPublishedOpportunities, matchOpportunityToProfile, rankOpportunitiesForProfile } from '../../lib/opportunities';

export const DashboardPage: React.FC = () => {
  const { user, authNotice } = useAuth();
  const [applications, setApplications] = useState<JobApplication[]>(() => mockStorage.getApplications());
  const [savedOppIds, setSavedOppIds] = useState<string[]>(() => mockStorage.getSavedOpportunityIds());
  const [publishedOpps, setPublishedOpps] = useState<Opportunity[]>(() => mockStorage.getOpportunities().filter((opportunity) => opportunity.status === 'published'));
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [workspaceSaveError, setWorkspaceSaveError] = useState<string | null>(null);

  const loadOpportunities = () => {
    void getPublishedOpportunities().then(setPublishedOpps).catch((error: unknown) => {
      console.error('Could not load published opportunities:', error);
    });
  };

  useEffect(() => { loadOpportunities(); }, []);

  useEffect(() => {
    const handleStorage = (event: Event) => {
      const key = (event as CustomEvent<{ key?: string }>).detail?.key;
      if (!key || key === 'careerlaunch_applications') setApplications(mockStorage.getApplications());
      if (!key || key === 'careerlaunch_saved_opp_ids') setSavedOppIds(mockStorage.getSavedOpportunityIds());
      if (!key || key === 'careerlaunch_opportunities') loadOpportunities();
    };
    window.addEventListener('careerlaunch_storage_change', handleStorage);
    return () => window.removeEventListener('careerlaunch_storage_change', handleStorage);
  }, []);

  useEffect(() => {
    const handlePersistenceError = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;
      setWorkspaceSaveError(detail || 'Workspace changes could not be synchronized.');
    };
    window.addEventListener('careerlaunch_persistence_error', handlePersistenceError);
    return () => window.removeEventListener('careerlaunch_persistence_error', handlePersistenceError);
  }, []);

  const handleToggleSave = (id: string) => {
    mockStorage.toggleSaveOpportunity(id);
    setSavedOppIds(mockStorage.getSavedOpportunityIds());
  };

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const upcomingDeadlines = useMemo(() => {
    const now = Date.now();
    return publishedOpps
      .filter((o) => o.status === 'published' && o.deadline && new Date(`${o.deadline}T23:59:59`).getTime() >= now)
      .sort((a, b) => new Date(`${a.deadline}T23:59:59`).getTime() - new Date(`${b.deadline}T23:59:59`).getTime())
      .slice(0, 2);
  }, [publishedOpps]);

  const recommendedOpps = useMemo(() => user
    ? rankOpportunitiesForProfile(publishedOpps, user).slice(0, 2)
    : publishedOpps.slice(0, 2), [publishedOpps, user]);

  const recommendedMatches = useMemo(() => new Map(
    recommendedOpps.map((opportunity) => [opportunity.id, matchOpportunityToProfile(opportunity, user)])
  ), [recommendedOpps, user]);

  const upcomingInterviews = useMemo(() => applications
    .filter((application) => application.stage === 'Interview' && application.interviewDate && new Date(application.interviewDate).getTime() >= Date.now())
    .sort((a, b) => new Date(a.interviewDate!).getTime() - new Date(b.interviewDate!).getTime()), [applications]);

  const nextBestAction = useMemo(() => {
    if (!user) return null;
    const skills = mockStorage.getUserSkills().filter((item) => item.userId === user.id);
    const experience = mockStorage.getExperience().filter((item) => item.userId === user.id);
    const education = mockStorage.getEducation().filter((item) => item.userId === user.id);
    const projects = mockStorage.getProjects().filter((item) => item.userId === user.id);
    const cv = mockStorage.getCV();
    const portfolio = mockStorage.getPortfolio();

    if (!user.headline.trim()) return { title: 'Choose your career focus', detail: 'Add a headline so your profile and opportunity matches reflect the roles you want.', href: '/profile', action: 'Update profile' };
    if (skills.length < 3) return { title: 'Add skills to your career profile', detail: 'List at least three skills to make your readiness and opportunity matches more useful.', href: '/skills', action: 'Add skills' };
    if (!education.length) return { title: 'Add your education', detail: 'Include your university, college, bootcamp, or other relevant training.', href: '/profile', action: 'Add education' };
    if (!experience.length && !projects.length) return { title: 'Add proof of what you can do', detail: 'Start with a project or experience entry that shows how you use your skills.', href: '/profile', action: 'Add experience or project' };
    if (!cv.content.summary.trim() && !cv.content.experience.length && !cv.content.projects.length) return { title: 'Turn your profile into a CV', detail: 'Build a CV from your saved experience, education, skills, and projects.', href: '/cv-builder', action: 'Build your CV' };
    if (!portfolio.isPublished) return { title: 'Prepare your shareable portfolio', detail: 'Choose what to showcase and publish when you are ready.', href: '/portfolio-builder', action: 'Review portfolio' };
    if (!applications.length) return { title: 'Explore opportunities that fit your next step', detail: 'Browse the catalog, check each listing source, and save roles worth pursuing.', href: '/app/opportunities', action: 'Explore opportunities' };
    if (upcomingInterviews.length) return { title: 'Prepare for your upcoming interview', detail: `You have an interview coming up for ${upcomingInterviews[0].position} at ${upcomingInterviews[0].company}.`, href: '/ai-assistant', action: 'Open interview prep' };
    return { title: 'Keep your opportunity pipeline moving', detail: 'Review saved listings, follow up on active applications, and update their status as you hear back.', href: '/applications', action: 'Review applications' };
  }, [user, applications, upcomingInterviews]);

  if (!user) return null;

  const firstName = user.fullName.split(' ')[0];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {greeting}, {firstName} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Build Your Skills. Launch Your Career. Keep growing your proof of work and pipeline.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link to="/cv-builder">
            <Button size="sm" variant="secondary" leftIcon={<FileText className="w-4 h-4" />}>
              Edit CV
            </Button>
          </Link>
          <Link to="/ai-assistant">
            <Button size="sm" variant="accent" leftIcon={<Bot className="w-4 h-4" />}>
              CareerLaunch AI
            </Button>
          </Link>
        </div>
      </div>

      {/* Profile Strength Interactive Card */}
      <ProfileStrengthCard user={user} />

      {nextBestAction && (
        <Card className="p-5 sm:p-6 border-brand-green-200 bg-gradient-to-r from-white to-brand-green-50/70 dark:border-brand-green-900 dark:from-slate-900 dark:to-brand-green-950/30">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3.5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-green-100 text-brand-green-800 dark:bg-brand-green-900/60 dark:text-brand-green-300">
                <Target className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[11px] font-bold uppercase tracking-[.13em] text-brand-green-800 dark:text-brand-green-300">Next best action</p>
                  <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Based on your saved career details</span>
                </div>
                <h2 className="mt-1 text-base font-extrabold text-slate-900 dark:text-white">{nextBestAction.title}</h2>
                <p className="mt-1 max-w-3xl text-xs leading-5 text-slate-600 dark:text-slate-300">{nextBestAction.detail}</p>
              </div>
            </div>
            <Link to={nextBestAction.href} className="shrink-0">
              <Button size="sm" variant="accent" rightIcon={<ArrowRight className="h-4 w-4" />}>{nextBestAction.action}</Button>
            </Link>
          </div>
        </Card>
      )}

      {(authNotice || workspaceSaveError) && <p role="alert" className="text-xs text-rose-700 dark:text-rose-300">{workspaceSaveError || authNotice}</p>}

      {/* KPI Stats Overview */}
      <StatsOverview
        applications={applications}
        savedCount={savedOppIds.length}
      />


      {/* Quick Launchpad Grid (No purple, strict deep blue/green/cyan/amber palette) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/cv-builder">
          <Card hoverEffect className="p-5 border-l-4 border-l-brand-blue-700 h-full flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-xl bg-brand-blue-50 dark:bg-brand-blue-950 text-brand-blue-700 dark:text-brand-blue-300 flex items-center justify-center mb-3">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">CV Builder</h4>
              <p className="text-xs text-slate-500 mt-1">Edit your CV content and preview the available templates.</p>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-brand-blue-700 dark:text-brand-blue-400">
              Open Builder <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </Card>
        </Link>

        <Link to="/portfolio-builder">
          <Card hoverEffect className="p-5 border-l-4 border-l-brand-green-500 h-full flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-xl bg-brand-green-50 dark:bg-brand-green-950 text-brand-green-700 dark:text-brand-green-400 flex items-center justify-center mb-3">
                <Globe className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Shareable Portfolio</h4>
              <p className="text-xs text-slate-500 mt-1">Edit your portfolio profile and visibility settings.</p>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-brand-green-600 dark:text-brand-green-400">
              View & Edit <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </Card>
        </Link>

        <Link to="/skills">
          <Card hoverEffect className="p-5 border-l-4 border-l-cyan-600 h-full flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-xl bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Skill Gap Analyzer</h4>
              <p className="text-xs text-slate-500 mt-1">Review your skills and add experience you want to highlight.</p>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-cyan-700 dark:text-cyan-400">
              Check Gaps <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </Card>
        </Link>

        <Link to="/ai-assistant">
          <Card hoverEffect className="p-5 border-l-4 border-l-emerald-500 h-full flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mb-3">
                <Bot className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">CareerLaunch AI</h4>
              <p className="text-xs text-slate-500 mt-1">Open career guidance tools available in this deployment.</p>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Start Session <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </Card>
        </Link>
      </div>

      <Link to="/playbooks" className="block rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-blue-500">
        <Card hoverEffect className="flex flex-col gap-4 border border-brand-blue-100 p-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3.5"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-blue-50 text-brand-blue-700 dark:bg-brand-blue-950 dark:text-brand-green-300"><BookOpen className="h-5 w-5" /></span><div><p className="text-[10px] font-bold uppercase tracking-[.13em] text-brand-blue-700 dark:text-brand-green-300">Career Intelligence</p><h2 className="mt-1 text-sm font-bold text-slate-900 dark:text-white">Build momentum with a Career Playbook</h2><p className="mt-1 text-xs text-slate-500">Follow practical tasks, track your progress, and connect your next steps to opportunities.</p></div></div>
          <span className="inline-flex shrink-0 items-center gap-2 text-xs font-bold text-brand-blue-700 dark:text-brand-green-300">Explore playbooks <ArrowRight className="h-4 w-4" /></span>
        </Card>
      </Link>

      {/* Main Grid: Left = Recommended Opps, Right = Upcoming Milestones & Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommended Opportunities */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Recommended Opportunities
              </h3>
              <p className="text-xs text-slate-500">From the opportunity catalog. Confirm details with the listing source.</p>
            </div>
            <Link
              to="/app/opportunities"
              className="text-xs font-bold text-brand-blue-700 dark:text-brand-green-400 hover:underline"
            >
              Browse All
            </Link>
          </div>

          {recommendedOpps.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recommendedOpps.map((opp) => (
                <OpportunityCard
                  key={opp.id}
                  opportunity={opp}
                  matchScore={recommendedMatches.get(opp.id)?.score}
                  matchedSkills={recommendedMatches.get(opp.id)?.matchedSkills}
                  matchExplanation={recommendedMatches.get(opp.id)?.explanation}
                  potentialGaps={recommendedMatches.get(opp.id)?.potentialGaps}
                  isSaved={savedOppIds.includes(opp.id)}
                  onToggleSave={handleToggleSave}
                  onSelect={(o) => setSelectedOpp(o)}
                />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <Compass className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                No opportunities yet
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Explore our full catalog to discover graduate jobs, internships, and attachments.
              </p>
              <Link to="/app/opportunities" className="inline-block mt-3">
                <Button size="sm" variant="outline">
                  Explore Opportunities
                </Button>
              </Link>
            </Card>
          )}
        </div>

        {/* Right Sidebar: Upcoming Deadlines & Interviews */}
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Upcoming Action Items
          </h3>

          <Card className="p-5 space-y-4">
            {upcomingInterviews.length > 0 ? (
              upcomingInterviews.map((app) => (
                <div
                  key={app.id}
                  className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                      Technical Interview
                    </span>
                    <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {app.position} at {app.company}
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Date:{' '}
                    <span className="font-semibold text-amber-700 dark:text-amber-300">
                      {formatDate(app.interviewDate)}
                    </span>
                  </p>
                  <Link
                    to="/ai-assistant"
                    className="text-[11px] font-bold text-brand-blue-700 dark:text-brand-green-400 inline-block hover:underline pt-1"
                  >
                    Open interview preparation →
                  </Link>
                </div>
              ))
            ) : (
              <div className="text-center py-3 text-xs text-slate-500">
                <CheckCircle2 className="w-5 h-5 text-brand-green-500 mx-auto mb-1" />
                No upcoming interview dates yet. Keep your applications updated as you hear back.
              </div>
            )}

            {/* Dynamic Application / Opportunity Deadlines */}
            {upcomingDeadlines.map((opp) => (
              <div
                key={opp.id}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white truncate max-w-[180px]">
                    {opp.title}
                  </span>
                  <span className="text-[10px] font-semibold text-rose-600 dark:text-rose-400">
                    {formatDate(opp.deadline)}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate">{opp.company}</p>
                <button
                  onClick={() => setSelectedOpp(opp)}
                  className="text-[11px] font-semibold text-brand-blue-700 dark:text-brand-green-400 hover:underline inline-block pt-1"
                >
                  View details & apply →
                </button>
              </div>
            ))}
          </Card>
        </div>
      </div>

      <OpportunityDetailModal
        opportunity={selectedOpp}
        isOpen={Boolean(selectedOpp)}
        onClose={() => setSelectedOpp(null)}
        isSaved={selectedOpp ? savedOppIds.includes(selectedOpp.id) : false}
        onToggleSave={handleToggleSave}
      />
    </div>
  );
};
