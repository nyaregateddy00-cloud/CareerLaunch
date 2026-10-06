import React, { useCallback, useEffect, useState } from 'react';
import { Download, FileSpreadsheet, RefreshCw } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { useAdminOpportunities } from '../../hooks/useAdminOpportunities';
import { downloadCsv } from '../../lib/csv';
import { AlertTriangle, EyeOff } from 'lucide-react';
import { CommunityReport, CommunityReportStatus, listCommunityReports, moderateCommunityReport } from '../../lib/community';

export const AdminReportsPage: React.FC = () => {
  const { opportunities, isLoading, error, reload } = useAdminOpportunities();
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [moderationError, setModerationError] = useState('');
  const [moderationLoading, setModerationLoading] = useState(true);
  const loadReports = useCallback(async () => {
    setModerationLoading(true);
    setModerationError('');
    try { setReports(await listCommunityReports()); }
    catch { setModerationError('Community reports are unavailable. Apply the community moderation migration and verify this account has the admin role.'); }
    finally { setModerationLoading(false); }
  }, []);
  useEffect(() => { void loadReports(); }, [loadReports]);

  const updateReport = async (report: CommunityReport, status: CommunityReportStatus) => {
    const note = window.prompt(status === 'actioned' ? 'Optional moderation note (content will be hidden):' : 'Optional moderation note:') || '';
    try {
      await moderateCommunityReport(report, status, note);
      await loadReports();
    } catch { setModerationError('This report could not be updated. Check moderator permissions and try again.'); }
  };

  const downloadReport = () => {
    if (!opportunities.length) return;
    downloadCsv('careerlaunch-opportunity-report.csv', [
      ['Title', 'Company', 'Status', 'Type', 'Country', 'Location', 'Work mode', 'Experience level', 'Deadline', 'Source', 'Application URL', 'Contact email', 'Salary range', 'Currency', 'Requirements', 'Tags'],
      ...opportunities.map((item) => [
        item.title, item.company, item.status, item.type, item.country, item.location, item.workMode,
        item.experienceLevel, item.deadline, item.source, item.applicationUrl, item.contactEmail,
        item.salaryRange, item.currency, item.requirements.join(' | '), item.tags.join(' | '),
      ]),
    ]);
  };

  return (
    <div className="space-y-6">
      <div>
        <Badge variant="blue" size="sm">Available export</Badge>
        <h1 className="mt-3 flex items-center gap-2.5 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl"><FileSpreadsheet className="h-7 w-7 text-brand-green-600" />Opportunity Listings Report</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">Download the listing records this admin account can access as a spreadsheet-friendly CSV. This report does not include candidate or application analytics.</p>
      </div>

      {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200">{error}</div>}

      <Card className="flex flex-col justify-between gap-5 p-6 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-bold text-slate-900 dark:text-white">Current opportunity catalog</h2>
          <p className="mt-1 text-xs text-slate-500">{isLoading ? 'Loading listing records…' : `${opportunities.length} ${opportunities.length === 1 ? 'record' : 'records'} available`}</p>
          <p className="mt-3 max-w-xl text-xs leading-5 text-slate-500">Review source, deadline, status, and employer details before using exported listings. Publication in CareerLaunch is not independent verification.</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button size="sm" variant="secondary" onClick={() => void reload()} leftIcon={<RefreshCw className="h-4 w-4" />}>Refresh</Button>
          <Button size="sm" variant="accent" onClick={downloadReport} disabled={isLoading || opportunities.length === 0} leftIcon={<Download className="h-4 w-4" />}>Download CSV</Button>
        </div>
      </Card>

      <section className="space-y-4" aria-labelledby="community-reports-heading">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><h2 id="community-reports-heading" className="flex items-center gap-2 font-bold text-slate-900 dark:text-white"><AlertTriangle className="h-4 w-4 text-amber-600" />Community moderation</h2><p className="mt-1 text-xs text-slate-500">Reports are visible to administrators only. Actioning a report hides the reported discussion or reply.</p></div>
          <Button size="sm" variant="secondary" onClick={() => void loadReports()} disabled={moderationLoading} leftIcon={<RefreshCw className="h-4 w-4" />}>Refresh reports</Button>
        </div>
        {moderationError && <p role="alert" className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-950/30 dark:text-amber-200">{moderationError}</p>}
        {moderationLoading ? <Card className="h-24 animate-pulse bg-slate-100 dark:bg-slate-900" /> : reports.length === 0 ? <Card className="p-5 text-sm text-slate-500">No community reports are currently available.</Card> : <div className="space-y-3">{reports.map((report) => {
          const content = report.post_id ? report.community_posts : report.community_comments;
          return <Card key={report.id} className="space-y-3 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2"><div className="flex items-center gap-2"><Badge variant={report.status === 'open' ? 'yellow' : report.status === 'actioned' ? 'red' : 'blue'} size="sm">{report.status}</Badge><Badge variant="gray" size="sm">{report.reason.replaceAll('_', ' ')}</Badge><span className="text-xs text-slate-500">{new Date(report.created_at).toLocaleString()}</span></div>{report.status === 'open' && <div className="flex gap-2"><Button size="sm" variant="secondary" onClick={() => void updateReport(report, 'dismissed')}>Dismiss</Button><Button size="sm" variant="danger" onClick={() => void updateReport(report, 'actioned')} leftIcon={<EyeOff className="h-3.5 w-3.5" />}>Hide content</Button></div>}</div>
            <div><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Reported {report.post_id ? 'discussion' : 'reply'} · author {content?.author_id.slice(0, 8) || 'unavailable'}</p><p className="mt-1 font-semibold text-slate-900 dark:text-white">{report.community_posts?.title || 'Reply in discussion'}</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700 dark:text-slate-300">{report.community_posts?.body || report.community_comments?.body || 'The reported content is no longer available.'}</p>{report.details && <p className="mt-2 rounded-lg bg-slate-50 p-3 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">Reporter note: {report.details}</p>}</div>
          </Card>;
        })}</div>}
      </section>
    </div>
  );
};
