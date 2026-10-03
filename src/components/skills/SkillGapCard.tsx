import React from 'react';
import { Target, CheckCircle2, AlertCircle, ArrowUpRight, BookOpen } from 'lucide-react';
import { RoleSkillGap } from '../../types';
import { Badge } from '../common/Badge';

interface SkillGapCardProps {
  gap: RoleSkillGap;
  onExploreResource?: (resourceName: string) => void;
}

export const SkillGapCard: React.FC<SkillGapCardProps> = ({ gap, onExploreResource }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-card hover:shadow-lg transition-all space-y-5">
      {/* Header with Role & Match Gauge */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-brand-blue-50 dark:bg-brand-blue-950 text-brand-blue-700 dark:text-brand-blue-300">
              <Target className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Target Career Role
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {gap.targetRole}
          </h3>
          {gap.companyTarget && (
            <p className="text-xs text-brand-green-600 dark:text-brand-green-400 font-semibold mt-0.5">
              Benchmark Company: {gap.companyTarget}
            </p>
          )}
        </div>

        <div className="text-right flex flex-col items-end">
          <div className="text-2xl font-extrabold text-brand-green-500">
            {gap.matchScore}%
          </div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Role Fit Match
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-brand-blue-500 to-brand-green-500"
          style={{ width: `${gap.matchScore}%` }}
        />
      </div>

      {/* Matched Skills */}
      <div>
        <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-brand-green-500" />
          <span>Skills You Already Have ({gap.matchedSkills.length})</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {gap.matchedSkills.map((s, idx) => (
            <span
              key={idx}
              className="text-xs font-medium px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60"
            >
              ✓ {s}
            </span>
          ))}
        </div>
      </div>

      {/* Missing Skills & Recommendations */}
      <div>
        <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
          <span>Recommended Skills to Bridge the Gap ({gap.missingSkills.length})</span>
        </div>
        <div className="space-y-2">
          {gap.missingSkills.map((missing, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-white">{missing.name}</span>
                <Badge
                  variant={missing.importance === 'High' ? 'red' : 'amber'}
                  size="sm"
                >
                  {missing.importance} Priority
                </Badge>
              </div>

              <div className="flex items-center gap-1.5 text-brand-blue-700 dark:text-brand-blue-300 hover:underline cursor-pointer">
                <BookOpen className="w-3.5 h-3.5" />
                <span className="font-semibold truncate max-w-[200px]">{missing.recommendedResource}</span>
                <ArrowUpRight className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

