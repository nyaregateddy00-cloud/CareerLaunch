import React from 'react';
import { Bookmark, MapPin, Calendar, Building2, ArrowUpRight } from 'lucide-react';
import { Opportunity } from '../../types';
import { Badge } from '../common/Badge';
import { formatDate } from '../../lib/utils';

interface OpportunityCardProps {
  opportunity: Opportunity;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
  onSelect: (opportunity: Opportunity) => void;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  isSaved = false,
  onToggleSave,
  onSelect,
}) => {
  const getTypeVariant = (type: Opportunity['type']): 'blue' | 'green' | 'amber' | 'default' => {
    switch (type) {
      case 'Job':
        return 'blue';
      case 'Internship':
      case 'Attachment':
        return 'green';
      case 'Scholarship':
        return 'blue';
      case 'Freelance':
        return 'amber';
      default:
        return 'default';
    }
  };

  return (
    <div
      onClick={() => onSelect(opportunity)}
      className="group relative bg-white dark:bg-[#111111] border border-slate-200/80 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 rounded-xl p-5 shadow-xs transition-all duration-150 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Top bar: Type badge & Bookmark button */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant={getTypeVariant(opportunity.type)} size="sm">
              {opportunity.type}
            </Badge>
            <Badge variant="outline" size="sm">
              {opportunity.workMode}
            </Badge>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave?.(opportunity.id);
            }}
            className={`p-1.5 rounded-lg border transition-colors ${
              isSaved
                ? 'bg-brand-green-50 dark:bg-brand-green-950/60 border-brand-green-300 dark:border-brand-green-800 text-brand-green-600 dark:text-brand-green-400'
                : 'border-slate-200 dark:border-white/10 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-white/[0.06]'
            }`}
            title={isSaved ? 'Remove from saved' : 'Save opportunity'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-brand-green-500' : ''}`} />
          </button>
        </div>

        {/* Company & Title */}
        <div className="flex items-start gap-3.5 mb-3">
          {opportunity.companyLogo ? (
            <img
              src={opportunity.companyLogo}
              alt={opportunity.company}
              className="w-10 h-10 rounded-lg object-cover border border-slate-200/80 dark:border-white/10 shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-brand-blue-50 dark:bg-white/[0.06] flex items-center justify-center text-brand-blue-700 dark:text-brand-blue-300 border border-slate-200/80 dark:border-white/10 shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-blue-700 dark:group-hover:text-brand-green-400 transition-colors line-clamp-2">
              {opportunity.title}
            </h3>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
              <span>{opportunity.company}</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="inline-flex items-center gap-1 text-slate-500">
                <MapPin className="w-3 h-3" />
                {opportunity.location}
              </span>
            </p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {opportunity.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-400"
            >
              #{tag}
            </span>
          ))}
          {opportunity.tags.length > 3 && (
            <span className="text-[10px] text-slate-400 py-0.5">+{opportunity.tags.length - 3}</span>
          )}
        </div>
      </div>

      {/* Card Footer: Compensation & Deadline */}
      <div className="pt-3 border-t border-slate-100 dark:border-white/[0.08] flex items-center justify-between text-xs">
        <div className="font-semibold text-brand-green-700 dark:text-brand-green-400 truncate max-w-[170px]">
          {opportunity.salaryRange || 'Competitive Stipend'}
        </div>

        <div className="flex items-center gap-1 text-slate-400 text-[11px]">
          {opportunity.deadline && (
            <>
              <Calendar className="w-3 h-3" />
              <span>{formatDate(opportunity.deadline)}</span>
            </>
          )}
          <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
};
