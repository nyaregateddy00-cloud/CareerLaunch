import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { OpportunityType, WorkMode, ExperienceLevel } from '../../types';

interface OpportunityFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedType: string;
  onTypeChange: (t: string) => void;
  selectedWorkMode: string;
  onWorkModeChange: (m: string) => void;
  selectedExp: string;
  onExpChange: (e: string) => void;
  onClearFilters: () => void;
  totalCount: number;
}

export const OpportunityFilterBar: React.FC<OpportunityFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedWorkMode,
  onWorkModeChange,
  selectedExp,
  onExpChange,
  onClearFilters,
  totalCount,
}) => {
  const types: (OpportunityType | 'All')[] = [
    'All',
    'Job',
    'Internship',
    'Attachment',
    'Graduate Program',
    'Scholarship',
    'Freelance',
    'Competition',
  ];

  const workModes: (WorkMode | 'All')[] = ['All', 'Hybrid', 'Remote', 'On-site'];

  const expLevels: (ExperienceLevel | 'All')[] = [
    'All',
    'Student/Intern',
    'Entry Level',
    'Mid Level',
    'Senior Level',
  ];

  const hasActiveFilters = searchQuery !== '' || selectedType !== 'All' || selectedWorkMode !== 'All' || selectedExp !== 'All';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-card dark:shadow-card-dark space-y-4">
      {/* Top row: Search input */}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title, skill (e.g. React, Python), or company (e.g. Safaricom)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
            {totalCount} Opportunities found
          </span>
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Filter Selectors */}
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
        {/* Type Filter Pills */}
        <div className="w-full overflow-x-auto pb-1 flex items-center gap-1.5 scrollbar-none">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => onTypeChange(type)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                selectedType === type
                  ? 'bg-brand-blue-900 dark:bg-brand-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Secondary dropdown row for Work Mode and Experience Level */}
      <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-400">Work Mode:</span>
          <select
            value={selectedWorkMode}
            onChange={(e) => onWorkModeChange(e.target.value)}
            className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-blue-500"
          >
            {workModes.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-400">Experience:</span>
          <select
            value={selectedExp}
            onChange={(e) => onExpChange(e.target.value)}
            className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-blue-500"
          >
            {expLevels.map((lvl) => (
              <option key={lvl} value={lvl}>{lvl}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

