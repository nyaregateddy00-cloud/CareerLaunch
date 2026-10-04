import React from 'react';
import { Link } from 'react-router-dom';

interface BrandLogoProps {
  to?: string;
  variant?: 'compact' | 'full';
  className?: string;
  imageClassName?: string;
  showRegion?: boolean;
}

/** The official supplied CareerLaunch artwork, reused across the application. */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  to = '/',
  variant = 'compact',
  className = '',
  imageClassName = '',
  showRegion = false,
}) => {
  if (variant === 'full') {
    return (
      <Link to={to} aria-label="CareerLaunch home" className={`inline-flex rounded-2xl bg-white p-1.5 shadow-sm ring-1 ring-slate-200/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green-500 dark:ring-slate-700 ${className}`}>
        <img src="/careerlaunch-logo.jpeg" alt="CareerLaunch — Build Your Skills. Launch Your Career." width={992} height={1079} className={`h-auto w-28 rounded-xl object-contain sm:w-32 ${imageClassName}`} />
      </Link>
    );
  }

  return (
    <Link to={to} aria-label="CareerLaunch home" className={`group inline-flex min-w-0 items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green-500 ${className}`}>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700">
        <img src="/careerlaunch-mark-192.png" alt="" aria-hidden="true" width={192} height={192} className={`h-full w-full object-contain ${imageClassName}`} />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="whitespace-nowrap text-lg font-extrabold leading-tight tracking-tight text-brand-blue-900 dark:text-white">Career<span className="text-brand-green-500">Launch</span></span>
        {showRegion && <span className="hidden text-[10px] font-medium uppercase tracking-wide text-slate-400 sm:block">Kenya &amp; Africa</span>}
      </span>
    </Link>
  );
};
