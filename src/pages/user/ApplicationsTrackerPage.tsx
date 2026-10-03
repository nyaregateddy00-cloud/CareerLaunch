import React, { useState, useEffect } from 'react';
import {
  Kanban,
  Plus,
  Search,
  Filter,
  Layers,
  Calendar,
  CheckCircle2,
  Trophy,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockStorage } from '../../lib/mockStorage';
import { JobApplication, ApplicationStage } from '../../types';
import { ApplicationCard } from '../../components/applications/ApplicationCard';
import { AddApplicationModal } from '../../components/applications/AddApplicationModal';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { PageHeader } from '../../components/common/PageHeader';
import { Badge } from '../../components/common/Badge';
import { useToast } from '../../hooks/useToast';
import { fireCelebrationConfetti } from '../../lib/utils';

const COLUMNS: { id: ApplicationStage; title: string; color: string; border: string }[] = [
  { id: 'Saved', title: 'Saved', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300', border: 'border-t-slate-400' },
  { id: 'Applied', title: 'Applied', color: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300', border: 'border-t-blue-500' },
  { id: 'Shortlisted', title: 'Shortlisted', color: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300', border: 'border-t-indigo-500' },
  { id: 'Interview', title: 'Interview', color: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300', border: 'border-t-amber-500' },
  { id: 'Offer', title: 'Offer 🎉', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300', border: 'border-t-brand-green-500' },
  { id: 'Rejected', title: 'Archived', color: 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300', border: 'border-t-rose-400' },
];

export const ApplicationsTrackerPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<JobApplication | null>(null);
  const [searchFilter, setSearchFilter] = useState('');

  const loadData = () => {
    setApplications(mockStorage.getApplications());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('careerlaunch_storage_change', loadData);
    return () => window.removeEventListener('careerlaunch_storage_change', loadData);
  }, []);

  const handleUpdateStage = (id: string, stage: ApplicationStage) => {
    mockStorage.updateApplicationStage(id, stage);
    loadData();
    showToast(`Moved application to ${stage}`, 'info');
  };

  const handleDelete = (id: string) => {
    mockStorage.deleteApplication(id);
    loadData();
    showToast('Application removed from tracker', 'info');
  };

  const handleSaveApplication = (app: JobApplication) => {
    mockStorage.saveApplication(app);
    loadData();
    if (app.stage === 'Offer' || app.stage === 'Interview') {
      fireCelebrationConfetti();
    }
    showToast('Application updated successfully', 'success');
  };

  const filteredApps = applications.filter((a) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return a.company.toLowerCase().includes(q) || a.position.toLowerCase().includes(q);
  });

  const totalActive = applications.filter(a => a.stage !== 'Rejected').length;
  const totalInterviews = applications.filter(a => a.stage === 'Interview').length;
  const totalOffers = applications.filter(a => a.stage === 'Offer').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Application Tracker"
        subtitle="Track your job, internship, and attachment applications across every stage of the hiring pipeline."
        breadcrumbs={[{ label: 'Applications' }]}
        badge={
          <Badge variant="blue" size="sm">
            {applications.length} Tracked
          </Badge>
        }
        action={
          <Button
            size="md"
            variant="accent"
            onClick={() => {
              setEditingApp(null);
              setIsModalOpen(true);
            }}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Application
          </Button>
        }
      />

      {/* Pipeline Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-blue-50 dark:bg-brand-blue-950 text-brand-blue-700 dark:text-brand-blue-300 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white">{applications.length}</div>
            <div className="text-[11px] font-semibold text-slate-400">Total Tracked</div>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-blue-600 dark:text-blue-400">{totalActive}</div>
            <div className="text-[11px] font-semibold text-slate-400">Active Pipeline</div>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-amber-600 dark:text-amber-400">{totalInterviews}</div>
            <div className="text-[11px] font-semibold text-slate-400">Interviews</div>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-brand-green-500">{totalOffers}</div>
            <div className="text-[11px] font-semibold text-slate-400">Offers Landed</div>
          </div>
        </Card>
      </div>

      {/* Search Filter Bar */}
      <div className="max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Filter applications by company or position..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue-500"
          />
        </div>
      </div>

      {/* Kanban Board Horizontal Scroll Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((col) => {
          const colApps = filteredApps.filter((a) => a.stage === col.id);
          return (
            <div
              key={col.id}
              className={`bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3 flex flex-col min-w-[240px] border-t-4 ${col.border}`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/60 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {col.title}
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${col.color}`}>
                  {colApps.length}
                </span>
              </div>

              {/* Column Cards */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[650px] pr-0.5">
                {colApps.map((app) => (
                  <ApplicationCard
                    key={app.id}
                    application={app}
                    onUpdateStage={handleUpdateStage}
                    onEdit={(a) => {
                      setEditingApp(a);
                      setIsModalOpen(true);
                    }}
                    onDelete={handleDelete}
                  />
                ))}

                {colApps.length === 0 && (
                  <div className="text-center py-8 text-slate-400 text-xs border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                    No applications
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Application Modal */}
      <AddApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveApplication}
        initialApplication={editingApp}
        userId={user?.id || 'usr-teddy-001'}
      />
    </div>
  );
};

