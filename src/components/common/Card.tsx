import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverEffect = false,
  ...props
}) => {
  return (
    <div
      className={`bg-white dark:bg-[#111111] border border-slate-200/80 dark:border-white/[0.08] rounded-xl p-6 transition-all duration-200 ${
        hoverEffect
          ? 'hover:border-slate-300 dark:hover:border-white/[0.16] hover:shadow-md dark:hover:shadow-none'
          : 'shadow-sm dark:shadow-none'
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
