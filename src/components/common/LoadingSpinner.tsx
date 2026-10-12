import React from 'react';

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
  const ringSize = {
    sm: 'w-5 h-5 border-[1.5px]',
    md: 'w-7 h-7 border-2',
    lg: 'w-10 h-10 border-2',
  };

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 py-12 ${className}`}
      role="status"
      aria-label={text || label}
    >
      <img
        src="/careerlaunch-mark-192.png"
        alt="CareerLaunch"
        width={36}
        height={36}
        className="h-9 w-9 rounded-lg bg-white object-contain shadow-sm ring-1 ring-slate-200 dark:ring-white/10"
      />
      <div
        className={`${ringSize[size]} border-brand-green-500 border-t-transparent rounded-full animate-spin`}
        aria-hidden="true"
      />
      {(text || label) && (
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{text || label}</p>
      )}
    </div>
  );
};
