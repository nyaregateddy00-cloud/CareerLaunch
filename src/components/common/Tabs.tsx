import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: 'underline' | 'pills';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'underline',
  className = '',
}) => {
  if (variant === 'pills') {
    return (
      <div
        role="tablist"
        aria-orientation="horizontal"
        className={`flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-[#0A0A0A] border border-slate-200/60 dark:border-white/[0.06] rounded-xl overflow-x-auto no-scrollbar ${className}`}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-white dark:bg-[#161616] text-slate-900 dark:text-white shadow-xs font-semibold dark:border dark:border-white/10'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`text-xs px-1.5 py-0.2 rounded-md ${
                    isActive
                      ? 'bg-brand-blue-50 text-brand-blue-800 dark:bg-brand-blue-950 dark:text-brand-blue-300'
                      : 'bg-slate-200 text-slate-700 dark:bg-white/[0.08] dark:text-slate-300'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      className={`border-b border-slate-200 dark:border-white/[0.08] flex gap-6 overflow-x-auto no-scrollbar ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 py-3 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              isActive
                ? 'border-brand-blue-900 dark:border-brand-green-500 text-brand-blue-900 dark:text-brand-green-400 font-semibold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-white/20'
            }`}
          >
            {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={`text-xs px-2 py-0.5 rounded-md ${
                  isActive
                    ? 'bg-brand-blue-50 text-brand-blue-800 dark:bg-brand-green-950 dark:text-brand-green-300'
                    : 'bg-slate-100 text-slate-600 dark:bg-white/[0.06] dark:text-slate-400'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
