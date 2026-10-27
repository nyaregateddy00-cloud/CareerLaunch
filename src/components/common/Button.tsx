import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.99]';

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 font-medium',
    md: 'text-sm px-4 py-2 gap-2 font-medium',
    lg: 'text-sm sm:text-base px-5 py-2.5 gap-2.5 font-semibold',
  };

  const variantClasses = {
    primary: 'bg-brand-blue-900 hover:bg-brand-blue-800 text-white shadow-xs focus:ring-brand-blue-500 dark:bg-brand-blue-700 dark:hover:bg-brand-blue-600',
    secondary: 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-xs focus:ring-slate-400 dark:bg-[#111111] dark:hover:bg-[#1a1a1a] dark:text-slate-100 dark:border-white/10',
    accent: 'bg-brand-green-600 hover:bg-brand-green-700 text-white shadow-xs focus:ring-brand-green-500 dark:bg-brand-green-600 dark:hover:bg-brand-green-500',
    outline: 'bg-transparent hover:bg-slate-50 text-slate-800 border border-slate-300 focus:ring-brand-blue-500 dark:text-slate-200 dark:border-white/15 dark:hover:bg-white/[0.04]',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-700 focus:ring-slate-400 dark:text-slate-300 dark:hover:bg-white/[0.05]',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs focus:ring-rose-500',
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        leftIcon && <span className="inline-flex">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="inline-flex">{rightIcon}</span>}
    </button>
  );
};
