import React from 'react';
import { Link } from 'react-router-dom';
import { UserRound } from 'lucide-react';
import { AIChatWindow } from '../../components/ai/AIChatWindow';
import { PageHeader } from '../../components/common/PageHeader';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';
import { useAuth } from '../../context/AuthContext';
import { mockStorage } from '../../lib/mockStorage';

export const AICareerAssistantPage: React.FC = () => {
  const { user } = useAuth();
  const skills = user ? mockStorage.getUserSkills().filter((item) => item.userId === user.id) : [];
  const projects = user ? mockStorage.getProjects().filter((item) => item.userId === user.id) : [];
  const experience = user ? mockStorage.getExperience().filter((item) => item.userId === user.id) : [];
  const contextSharing = mockStorage.getPreferences().shareCareerContext;

  return (
    <div className="space-y-6">
      <PageHeader
        title="CareerLaunch AI Assistant"
        subtitle="Your personalized AI career coach for African tech markets, CV reviews, and interview prep."
        breadcrumbs={[{ label: 'CareerLaunch AI' }]}
        badge={
          <Badge variant="green" size="sm">
            AI Assistant
          </Badge>
        }
      />

      <Card className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-blue-50 text-brand-blue-800 dark:bg-brand-blue-950 dark:text-brand-green-300"><UserRound className="h-5 w-5" /></span><div><h2 className="font-bold text-slate-900 dark:text-white">Your AI Career Twin</h2><p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">A structured view of the career details you have saved. The Coach uses this context only when you turn on sharing in Settings; your message is still sent when you request AI help.</p></div></div>
          <Link to="/settings" className="shrink-0 text-xs font-bold text-brand-blue-700 dark:text-brand-green-300">{contextSharing ? 'Context sharing is on · Manage' : 'Context sharing is off · Manage'}</Link>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[['Career focus', user?.headline || 'Not set'], ['Skills saved', String(skills.length)], ['Projects', String(projects.length)], ['Experience entries', String(experience.length)]].map(([label, value]) => <div key={label} className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70"><span className="block text-[10px] font-bold uppercase tracking-wide text-slate-500">{label}</span><span className="mt-1 block truncate text-xs font-semibold text-slate-900 dark:text-white">{value}</span></div>)}
        </div>
      </Card>

      <AIChatWindow />
    </div>
  );
};
