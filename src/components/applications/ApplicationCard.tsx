import React from 'react';
import {
  Calendar,
  Building2,
  Trash2,
  Edit2,
  ExternalLink,
  Clock,
  CheckCircle2,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { JobApplication, ApplicationStage } from '../../types';
import { formatDate, fireCelebrationConfetti } from '../../lib/utils';

interface ApplicationCardProps {
  application: JobApplication;
  onUpdateStage: (id: string, stage: ApplicationStage) => void;
  onEdit: (application: JobApplication) => void;
  onDelete: (id: string) => void;
}

const STAGES: ApplicationStage[] = ['Saved', 'Applied', 'Shortlisted', 'Interview', 'Offer', 'Rejected'];

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  onUpdateStage,
  onEdit,
  onDelete,
}) => {
  const currentStageIndex = STAGES.indexOf(application.stage);

  const handleNextStage = () => {
    if (currentStageIndex < STAGES.length - 2) { // don't auto-advance into rejected
      const nextStage = STAGES[currentStageIndex + 1];
      onUpdateStage(application.id, nextStage);
      if (nextStage === 'Offer' || nextStage === 'Interview') {
        fireCelebrationConfetti();
      }
    }
  };

  const handlePrevStage = () => {
    if (currentStageIndex > 0) {
      onUpdateStage(application.id, STAGES[currentStageIndex - 1]);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-all space-y-3 group">
      {/* Top row: Company & Quick Stage dropdown */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider truncate">
            {application.company}
          </h4>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-blue-600 dark:group-hover:text-brand-blue-400 line-clamp-2">
            {application.position}
          </h3>
        </div>

        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(application)}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600"
            title="Edit"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(application.id)}
            className="p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-600"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Salary & Application Date */}
      <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
        <span className="font-semibold text-brand-green-700 dark:text-brand-green-400 truncate max-w-[130px]">
          {application.salary || 'Salary pending'}
        </span>
        <span className="text-[11px] text-slate-400">
          Applied {formatDate(application.dateApplied)}
        </span>
      </div>

      {/* Interview alert if stage is Interview */}
      {application.interviewDate && application.stage === 'Interview' && (
        <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-medium flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 flex-shrink-0 animate-spin" />
          <span className="truncate">Interview: {formatDate(application.interviewDate)}</span>
        </div>
      )}

      {/* Notes summary */}
      {application.notes && (
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 italic bg-slate-50 dark:bg-slate-850 p-2 rounded-lg">
          "{application.notes}"
        </p>
      )}

      {/* Card Footer: Stage controls */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <select
          value={application.stage}
          onChange={(e) => onUpdateStage(application.id, e.target.value as ApplicationStage)}
          className="text-[11px] font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-1 text-slate-700 dark:text-slate-300 focus:outline-none"
        >
          {STAGES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <div className="flex items-center gap-1">
          {currentStageIndex > 0 && (
            <button
              onClick={handlePrevStage}
              className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              title="Move back"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          )}
          {currentStageIndex < STAGES.length - 2 && (
            <button
              onClick={handleNextStage}
              className="p-1 rounded-md hover:bg-brand-blue-50 dark:hover:bg-brand-blue-950 text-brand-blue-600 font-semibold"
              title="Advance stage"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

