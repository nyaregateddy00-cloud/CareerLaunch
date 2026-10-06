import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, CalendarClock, FileText, Globe, Plus, Shield } from 'lucide-react';
import { useAdminOpportunities } from '../../hooks/useAdminOpportunities';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export const AdminDashboardPage: React.FC = () => {
  const { opportunities, isLoading, error: loadError } = useAdminOpportunities();

  const published = opportunities.filter((item) => item.status === 'published');
  const drafts = opportunities.filter((item) => item.status === 'draft');
  const closingSoon = published.filter((item) => {
    if (!item.deadline) return false;
    const deadline = new Date(`${item.deadline}T23:59:59`).getTime();
    const daysRemaining = deadline - Date.now();
    return daysRemaining >= 0 && daysRemaining <= 7 * 24 * 60 * 60 * 1000;
  });
  const countryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    published.forEach((item) => counts.set(item.country || 'Unspecified', (counts.get(item.country || 'Unspecified') || 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [opportunities]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2"><Badge variant="blue" size="sm">Admin Console</Badge><span className="text-xs text-slate-500">Opportunity operations</span></div>
          <h1 className="flex items-center gap-2.5 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl"><Shield className="h-7 w-7 text-brand-blue-700 dark:text-brand-blue-400" />Platform Administration</h1>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">Review and maintain the opportunity listings available in CareerLaunch.</p>
        </div>
        <Link to="/admin/opportunities"><Button size="sm" variant="accent" leftIcon={<Plus className="h-4 w-4" />}>Manage Opportunities</Button></Link>
      </div>

      {loadError && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200">{loadError}</p>}

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[
          { label: 'Published listings', value: published.length, icon: Briefcase, color: 'text-brand-green-700 dark:text-brand-green-300', tone: 'bg-brand-green-50 dark:bg-brand-green-950/50' },
          { label: 'Draft listings', value: drafts.length, icon: FileText, color: 'text-brand-blue-700 dark:text-brand-blue-300', tone: 'bg-brand-blue-50 dark:bg-brand-blue-950/50' },
          { label: 'Closing in 7 days', value: closingSoon.length, icon: CalendarClock, color: 'text-amber-700 dark:text-amber-300', tone: 'bg-amber-50 dark:bg-amber-950/50' },
          { label: 'Countries represented', value: countryCounts.length, icon: Globe, color: 'text-cyan-700 dark:text-cyan-300', tone: 'bg-cyan-50 dark:bg-cyan-950/50' },
        ].map((stat) => (
          <Card key={stat.label} className="p-5" aria-busy={isLoading}>
            <div className="flex items-center justify-between gap-3"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">{stat.label}</p><span className={`grid h-9 w-9 place-items-center rounded-xl ${stat.tone} ${stat.color}`}><stat.icon className="h-4 w-4" /></span></div>
            <p className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">{isLoading ? '—' : stat.value}</p>
            <p className="mt-1 text-[11px] text-slate-500">From listing records available to this console</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <section className="space-y-3">
          <div className="flex items-center justify-between"><div><h2 className="text-base font-bold text-slate-900 dark:text-white">Recent opportunity listings</h2><p className="text-xs text-slate-500">Listing status and source details still need review by the team.</p></div><Link to="/admin/opportunities" className="text-xs font-bold text-brand-blue-700 hover:underline dark:text-brand-green-400">Manage all</Link></div>
          <Card className="divide-y divide-slate-100 overflow-hidden p-0 dark:divide-slate-800">
            {isLoading ? <div className="space-y-3 p-5" aria-label="Loading opportunities"><div className="h-4 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800"/><div className="h-4 w-1/2 animate-pulse rounded bg-slate-100 dark:bg-slate-800"/></div> : opportunities.length ? opportunities.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6).map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4 p-4">
                <div className="min-w-0"><p className="truncate text-sm font-bold text-slate-900 dark:text-white">{item.title}</p><p className="mt-1 truncate text-xs text-slate-500">{item.company} · {item.location}, {item.country}</p></div>
                <Badge variant={item.status === 'published' ? 'green' : 'default'} size="sm">{item.status}</Badge>
              </div>
            )) : <div className="p-8 text-center text-sm text-slate-500">No opportunity listings are available yet.</div>}
          </Card>
        </section>

        <section className="space-y-3">
          <div><h2 className="text-base font-bold text-slate-900 dark:text-white">Published opportunities by country</h2><p className="text-xs text-slate-500">Counts use published listing records only.</p></div>
          <Card className="space-y-4 p-5">
            {isLoading ? <div className="h-24 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800"/> : countryCounts.length ? countryCounts.map(([country, count]) => (
              <div key={country}><div className="mb-1 flex justify-between text-xs"><span className="font-semibold text-slate-700 dark:text-slate-300">{country}</span><span className="font-bold text-slate-900 dark:text-white">{count}</span></div><div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-full rounded-full bg-brand-green-500" style={{ width: `${Math.max(6, count / published.length * 100)}%` }} /></div></div>
            )) : <p className="text-sm text-slate-500">Country breakdown will appear when published listings are available.</p>}
            <div className="border-t border-slate-100 pt-3 dark:border-slate-800"><Link to="/admin/analytics"><Button variant="ghost" size="sm" className="w-full justify-between">View listing analytics <span aria-hidden="true">→</span></Button></Link></div>
          </Card>
        </section>
      </div>
    </div>
  );
};
