import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Globe,
  Bot,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  Compass,
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
import { isSupabaseConfigured } from '../../lib/supabase';

export const DashboardPage: React.FC = () => {
  const { user, authNotice } = useAuth();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [savedOppIds, setSavedOppIds] = useState<string[]>([]);
  const [recommendedOpps, setRecommendedOpps] = useState<Opportunity[]>([]);
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [workspaceSaveError, setWorkspaceSaveError] = useState<string | null>(null);

  useEffect(() => {
    setApplications(mockStorage.getApplications());
    setSavedOppIds(mockStorage.getSavedOpportunityIds());
    setRecommendedOpps(mockStorage.getOpportunities().filter((opportunity) => opportunity.status === 'published').slice(0, 2));

    const handleStorage = () => {
      setApplications(mockStorage.getApplications());
      setSavedOppIds(mockStorage.getSavedOpportunityIds());
      setRecommendedOpps(mockStorage.getOpportunities().filter((opportunity) => opportunity.status === 'published').slice(0, 2));
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
    return mockStorage
      .getOpportunities()
      .filter((o) => o.status === 'published' && o.deadline && new Date(o.deadline).getTime() >= now)
      .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
      .slice(0, 2);
  }, []);

  if (!user) return null;

  const firstName = user.fullName.split(' ')[0];
  const upcomingInterviews = applications
    .filter((a) => a.stage === 'Interview' && a.interviewDate && new Date(a.interviewDate).getTime() >= Date.now())
    .sort((a, b) => new Date(a.interviewDate!).getTime() - new Date(b.interviewDate!).getTime());

  return (
    <div className="dashboard-sections space-y-8 text-slate-900 dark:text-[#f8fafc]">
      {/* Header Welcome Bar */}
      <div className="dashboard-reveal flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {greeting}, <span className="font-serif italic font-normal text-brand-blue-700 dark:text-brand-blue-400">{firstName}</span> 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track your applications, update your CV, and explore verified opportunities.
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

      {/* Profile Strength Overview */}
      <div className="dashboard-reveal dashboard-reveal-delay-1"><ProfileStrengthCard user={user} /></div>

      {/* Demo storage status only when Supabase is not configured */}
      {!isSupabaseConfigured && (
        <div role="status" className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300">
          Demo mode active: changes are stored locally in this browser session.
        </div>
      )}
      {(authNotice || workspaceSaveError) && (
        <p role="alert" className="text-xs text-rose-700 dark:text-rose-400 font-medium">
          {workspaceSaveError || authNotice}
        </p>
      )}

      {/* Key Metrics Overview */}
      <div className="dashboard-reveal dashboard-reveal-delay-2">
        <StatsOverview
          applications={applications}
          savedCount={savedOppIds.length}
          portfolioViews={mockStorage.getPortfolio().viewCount || 0}
        />
      </div>

      {/* Cohesive Quick Launchpad */}
      <div className="dashboard-reveal dashboard-reveal-delay-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Quick Workspaces
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/cv-builder" className="group">
            <Card hoverEffect className="p-5 h-full flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-lg bg-brand-blue-50 dark:bg-white/[0.06] text-brand-blue-700 dark:text-brand-blue-300 flex items-center justify-center mb-3">
                  <FileText className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-blue-700 dark:group-hover:text-brand-green-400 transition-colors">CV Builder</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">Update experience, education, and print your ATS-ready PDF.</p>
              </div>
              <div className="mt-4 flex items-center text-xs font-semibold text-brand-blue-700 dark:text-brand-green-400">
                Open Builder <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Card>
          </Link>

          <Link to="/portfolio-builder" className="group">
            <Card hoverEffect className="p-5 h-full flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-brand-green-700 dark:text-brand-green-300 flex items-center justify-center mb-3">
                  <Globe className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-blue-700 dark:group-hover:text-brand-green-400 transition-colors">Shareable Portfolio</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">Publish featured projects and customize your public link.</p>
              </div>
              <div className="mt-4 flex items-center text-xs font-semibold text-brand-green-700 dark:text-brand-green-400">
                Manage Portfolio <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Card>
          </Link>

          <Link to="/skills" className="group">
            <Card hoverEffect className="p-5 h-full flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-300 flex items-center justify-center mb-3">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-blue-700 dark:group-hover:text-brand-green-400 transition-colors">Skill Gap Analyzer</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">Audit competencies against African market benchmarks.</p>
              </div>
              <div className="mt-4 flex items-center text-xs font-semibold text-slate-700 dark:text-slate-300">
                Review Skills <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Card>
          </Link>

          <Link to="/ai-assistant" className="group">
            <Card hoverEffect className="p-5 h-full flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-lg bg-brand-green-50 dark:bg-brand-green-950/50 text-brand-green-700 dark:text-brand-green-300 flex items-center justify-center mb-3">
                  <Bot className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-blue-700 dark:group-hover:text-brand-green-400 transition-colors">CareerLaunch AI</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">Simulate interviews and refine cover letters for targeted roles.</p>
              </div>
              <div className="mt-4 flex items-center text-xs font-semibold text-brand-green-700 dark:text-brand-green-400">
                Start Session <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Card>
          </Link>
        </div>
      </div>

      {/* Main Grid: Left = Recommended Opps, Right = Upcoming Milestones & Deadlines */}
      <div className="dashboard-reveal dashboard-reveal-delay-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommended Opportunities */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Recommended Opportunities
              </h3>
              <p className="text-xs text-slate-500">Verified openings matching your target career tracks.</p>
            </div>
            <Link
              to="/opportunities"
              className="text-xs font-semibold text-brand-blue-700 dark:text-brand-green-400 hover:underline"
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
                  isSaved={savedOppIds.includes(opp.id)}
                  onToggleSave={handleToggleSave}
                  onSelect={(o) => setSelectedOpp(o)}
                />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <Compass className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                No opportunities saved yet
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Explore the catalog to discover graduate roles, internships, and attachments.
              </p>
              <Link to="/opportunities" className="inline-block mt-3">
                <Button size="sm" variant="outline">
                  Explore Opportunities
                </Button>
              </Link>
            </Card>
          )}
        </div>

        {/* Right Column: Upcoming Deadlines & Interviews */}
        <div className="space-y-4">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            Upcoming Milestones
          </h3>

          <Card className="p-5 space-y-4">
            {upcomingInterviews.length > 0 ? (
              upcomingInterviews.map((app) => (
                <div
                  key={app.id}
                  className="p-3.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                      Interview Scheduled
                    </span>
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {app.position} at {app.company}
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Date:{' '}
                    <span className="font-semibold text-amber-800 dark:text-amber-300">
                      {formatDate(app.interviewDate)}
                    </span>
                  </p>
                  <Link
                    to="/ai-assistant"
                    className="text-[11px] font-semibold text-brand-blue-700 dark:text-brand-green-400 inline-block hover:underline pt-1"
                  >
                    Open interview prep session →
                  </Link>
                </div>
              ))
            ) : (
              <div className="text-center py-3 text-xs text-slate-500">
                <CheckCircle2 className="w-4 h-4 text-brand-green-500 mx-auto mb-1" />
                No pending interviews today. Keep applying to fill your pipeline!
              </div>
            )}

            {/* Dynamic Application / Opportunity Deadlines */}
            {upcomingDeadlines.map((opp) => (
              <div
                key={opp.id}
                className="p-3 rounded-lg bg-slate-50 dark:bg-[#0A0A0A] border border-slate-200/80 dark:border-white/10 text-xs space-y-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[170px]">
                    {opp.title}
                  </span>
                  <span className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 shrink-0">
                    {formatDate(opp.deadline)}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate">{opp.company}</p>
                <button
                  onClick={() => setSelectedOpp(opp)}
                  className="text-[11px] font-semibold text-brand-blue-700 dark:text-brand-green-400 hover:underline inline-block pt-1"
                >
                  View details &amp; apply →
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
