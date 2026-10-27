import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'green' | 'blue' | 'amber' | 'red' | 'outline' | 'accent' | 'purple';
  size?: 'sm' | 'md';
  pill?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  pill = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-0.5 font-medium',
  };

  const variantClasses = {
    default: 'bg-slate-100 text-slate-700 dark:bg-white/[0.06] dark:text-slate-300 dark:border-white/10',
    green: 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40',
    blue: 'bg-blue-50 text-blue-800 border border-blue-200/80 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/40',
    amber: 'bg-amber-50 text-amber-800 border border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40',
    purple: 'bg-brand-blue-50 text-brand-blue-800 border border-brand-blue-200/80 dark:bg-brand-blue-950/40 dark:text-brand-blue-300 dark:border-brand-blue-800/40',
    red: 'bg-rose-50 text-rose-800 border border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/40',
    outline: 'bg-transparent text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-white/15',
    accent: 'bg-brand-green-100 text-brand-green-900 border border-brand-green-300/80 dark:bg-brand-green-950/50 dark:text-brand-green-300 dark:border-brand-green-800/50',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 ${
        pill ? 'rounded-full' : 'rounded-md'
      } whitespace-nowrap font-medium ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
