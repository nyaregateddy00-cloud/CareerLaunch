import React from 'react';
import { FileSpreadsheet, Download, Calendar, CheckCircle2, FileText } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

export const AdminReportsPage: React.FC = () => {
  const reports = [
    {
      title: 'Q3 2026 African Tech Talent Placement Report',
      date: 'Generated Sep 20, 2026',
      size: '2.4 MB',
      description: 'Comprehensive analysis of graduate employment rates, university attachments, and entry-level salaries across Kenya, Nigeria, and Rwanda.',
    },
    {
      title: 'NITA Industrial Attachment Compliance Audit',
      date: 'Generated Sep 15, 2026',
      size: '1.8 MB',
      description: 'Accredited employer compliance, student logbook verifications, and mandatory institutional recommendations.',
    },
    {
      title: 'Monthly Platform Opportunity & Application Metrics',
      date: 'Generated Sep 01, 2026',
      size: '950 KB',
      description: 'Breakdown of 342 active opportunities, application conversion funnels, and demographic breakdown by university.',
    },
  ];

  const handleDownload = (title: string) => {
    alert(`Downloading ${title}...`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
          <FileSpreadsheet className="w-7 h-7 text-brand-green-500" />
          Institutional Reports & Audits
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Exportable regulatory reports, university cohort metrics, and talent placement audit logs.
        </p>
      </div>

      <div className="space-y-4">
        {reports.map((r, idx) => (
          <Card key={idx} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{r.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                {r.description}
              </p>
              <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                <span>{r.date}</span>
                <span>•</span>
                <span>{r.size}</span>
              </div>
            </div>

            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleDownload(r.title)}
              leftIcon={<Download className="w-4 h-4" />}
              className="flex-shrink-0"
            >
              Download PDF / CSV
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

