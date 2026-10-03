import React from 'react';
import { Layers, Bookmark, Calendar, Eye } from 'lucide-react';
import { Card } from '../common/Card';
import { JobApplication } from '../../types';
import { formatDate } from '../../lib/utils';

interface StatsOverviewProps {
  applications: JobApplication[];
  savedCount: number;
  portfolioViews: number;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  applications,
  savedCount,
  portfolioViews,
}) => {
  const activeApplications = applications.filter((a) => a.stage !== 'Rejected').length;
  const interviews = applications.filter((a) => a.stage === 'Interview');
  const offers = applications.filter((a) => a.stage === 'Offer').length;

  const nextInterview = interviews.find((a) => a.interviewDate);

  const stats = [
    {
      label: 'Active Applications',
      value: activeApplications,
      detail:
        activeApplications > 0
          ? `${offers} ${offers === 1 ? 'Offer' : 'Offers'} received`
          : 'No applications yet',
      icon: Layers,
      color: 'text-brand-blue-600 dark:text-brand-blue-400',
      bgColor: 'bg-brand-blue-50 dark:bg-brand-blue-950/60',
    },
    {
      label: 'Interviews Scheduled',
      value: interviews.length,
      detail: nextInterview
        ? `Next: ${formatDate(nextInterview.interviewDate)} (${nextInterview.company})`
        : 'None scheduled',
      icon: Calendar,
      color: 'text-brand-green-600 dark:text-brand-green-400',
      bgColor: 'bg-brand-green-50 dark:bg-brand-green-950/60',
    },
    {
      label: 'Saved Opportunities',
      value: savedCount,
      detail: savedCount > 0 ? 'Ready for application' : 'Explore opportunities',
      icon: Bookmark,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/60',
    },
    {
      label: 'Portfolio Views',
      value: portfolioViews,
      detail: portfolioViews > 0 ? 'Public profile visibility' : 'Publish portfolio',
      icon: Eye,
      color: 'text-cyan-600 dark:text-cyan-400',
      bgColor: 'bg-cyan-50 dark:bg-cyan-950/60',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <Card key={idx} className="p-5 flex flex-col justify-between" hoverEffect>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {stat.label}
            </span>
            <div
              className={`w-9 h-9 rounded-xl ${stat.bgColor} flex items-center justify-center ${stat.color}`}
            >
              <stat.icon className="w-5 h-5" />
            </div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {stat.value}
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
              <span>{stat.detail}</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
