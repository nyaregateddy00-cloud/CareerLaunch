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
      className={`bg-white dark:bg-[#111111] border border-slate-200/80 dark:border-white/[0.07] rounded-2xl p-6 shadow-card dark:shadow-card-dark ${
        hoverEffect
          ? 'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover dark:hover:border-white/[0.12]'
          : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
