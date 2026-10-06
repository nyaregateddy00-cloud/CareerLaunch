import React, { useMemo } from 'react';
import { BarChart3, Download, Globe, Briefcase, RefreshCw } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useAdminOpportunities } from '../../hooks/useAdminOpportunities';
import { downloadCsv } from '../../lib/csv';

function countBy(values: string[]) {
  const counts = new Map<string, number>();
  values.forEach((value) => counts.set(value || 'Unspecified', (counts.get(value || 'Unspecified') || 0) + 1));
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

export const AdminAnalyticsPage: React.FC = () => {
  const { opportunities, isLoading, error, reload } = useAdminOpportunities();
  const published = opportunities.filter((item) => item.status === 'published');
  const byType = useMemo(() => countBy(published.map((item) => item.type)), [opportunities]);
  const byCountry = useMemo(() => countBy(published.map((item) => item.country)), [opportunities]);
  const closingSoon = published.filter((item) => {
    if (!item.deadline) return false;
    const remaining = new Date(`${item.deadline}T23:59:59`).getTime() - Date.now();
    return remaining >= 0 && remaining <= 7 * 24 * 60 * 60 * 1000;
  });

  const exportListings = () => {
    if (!opportunities.length) return;
    downloadCsv('careerlaunch-opportunity-listings.csv', [
      ['Title', 'Company', 'Status', 'Type', 'Country', 'Location', 'Work mode', 'Experience level', 'Deadline', 'Source', 'Application URL', 'Requirements', 'Tags'],
      ...opportunities.map((item) => [
        item.title, item.company, item.status, item.type, item.country, item.location, item.workMode,
        item.experienceLevel, item.deadline, item.source, item.applicationUrl,
        item.requirements.join(' | '), item.tags.join(' | '),
      ]),
    ]);
  };

  const renderBars = (items: [string, number][]) => {
    if (!items.length) return <p className="text-sm text-slate-500">Published opportunity data will appear here when listings are available.</p>;
    const max = Math.max(...items.map(([, count]) => count));
    return <div className="space-y-4">{items.slice(0, 8).map(([label, count]) => (
      <div key={label}>
        <div className="mb-1 flex items-center justify-between gap-3 text-xs"><span className="truncate font-semibold text-slate-700 dark:text-slate-300">{label}</span><span className="shrink-0 font-bold text-slate-900 dark:text-white">{count}</span></div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-full rounded-full bg-brand-green-500" style={{ width: `${Math.max(4, (count / max) * 100)}%` }} /></div>
      </div>
    ))}</div>;
  };

  return (
    <div className="space-y-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2"><Badge variant="blue" size="sm">Listing data</Badge></div>
          <h1 className="flex items-center gap-2.5 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl"><BarChart3 className="h-7 w-7 text-brand-blue-700 dark:text-brand-blue-400" />Opportunity Analytics</h1>
          <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500 sm:text-sm">A view of opportunity records available to this admin account. Candidate, application, and employer-demand analytics are not exposed by the current client permissions.</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => void reload()} leftIcon={<RefreshCw className="h-4 w-4" />}>Refresh</Button>
          <Button size="sm" variant="accent" onClick={exportListings} disabled={isLoading || opportunities.length === 0} leftIcon={<Download className="h-4 w-4" />}>Export listings CSV</Button>
        </div>
      </div>

      {error && <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200" role="alert">{error}</div>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: 'Published opportunities', value: published.length, icon: Briefcase },
          { label: 'Countries represented', value: byCountry.length, icon: Globe },
          { label: 'Closing in the next 7 days', value: closingSoon.length, icon: BarChart3 },
        ].map((metric) => <Card key={metric.label} className="p-5" aria-busy={isLoading}>
          <div className="flex items-center justify-between"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">{metric.label}</p><metric.icon className="h-5 w-5 text-brand-green-600 dark:text-brand-green-400" /></div>
          <p className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">{isLoading ? '—' : metric.value}</p>
          <p className="mt-1 text-[11px] text-slate-500">Counted from listing records</p>
        </Card>)}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-5 p-6">
          <div className="border-b border-slate-100 pb-3 dark:border-slate-800"><h2 className="font-bold text-slate-900 dark:text-white">Published listings by opportunity type</h2><p className="mt-1 text-xs text-slate-500">Uses the type saved on each published listing.</p></div>
          {isLoading ? <div className="h-48 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800"/> : renderBars(byType)}
        </Card>
        <Card className="space-y-5 p-6">
          <div className="border-b border-slate-100 pb-3 dark:border-slate-800"><h2 className="font-bold text-slate-900 dark:text-white">Published listings by country</h2><p className="mt-1 text-xs text-slate-500">This is listing coverage, not a measure of total job-market activity.</p></div>
          {isLoading ? <div className="h-48 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800"/> : renderBars(byCountry)}
        </Card>
      </div>
      <p className="text-[11px] text-slate-500">Published status reflects the record in CareerLaunch. It does not independently verify that an opportunity is still open or that employer details are current.</p>
    </div>
  );
};
