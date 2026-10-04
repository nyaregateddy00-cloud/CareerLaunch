import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  label?: string;
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  label = 'Loading...',
  text,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-7 h-7',
    lg: 'w-10 h-10',
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-12 ${className}`}>
      <img src="/careerlaunch-mark-192.png" alt="CareerLaunch" width={36} height={36} className="h-9 w-9 rounded-lg bg-white object-contain shadow-sm ring-1 ring-slate-200 dark:ring-slate-700" />
      <Loader2 className={`${sizeClasses[size]} animate-spin text-brand-green-500`} />
      {(text || label) && <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{text || label}</p>}
    </div>
  );
};

