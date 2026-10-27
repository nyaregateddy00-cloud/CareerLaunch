import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  action,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-dashed border-slate-300 dark:border-white/10 rounded-xl bg-slate-50/70 dark:bg-[#0A0A0A] ${className}`}
    >
      {icon && (
        <div className="w-12 h-12 mb-3.5 rounded-xl bg-brand-blue-50 dark:bg-white/[0.05] text-brand-blue-700 dark:text-brand-blue-300 flex items-center justify-center">
          {icon}
        </div>
      )}
      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">{title}</h3>
      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-5 leading-relaxed">{description}</p>
      {action}
      {actionText && onAction && (
        <Button onClick={onAction} size="sm" variant="primary">
          {actionText}
        </Button>
      )}
    </div>
  );
};
