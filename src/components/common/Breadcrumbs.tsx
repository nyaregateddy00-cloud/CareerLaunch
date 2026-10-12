import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  className = '',
  showHome = true,
}) => {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center text-xs text-slate-500 dark:text-slate-400 ${className}`}>
      <ol className="flex items-center gap-1.5 flex-wrap">
        {showHome && (
          <li className="inline-flex items-center">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1 hover:text-brand-blue-900 dark:hover:text-brand-blue-400 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span className="sr-only">Home</span>
            </Link>
          </li>
        )}

        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;

          return (
            <li key={idx} className="inline-flex items-center gap-1.5">
              {(showHome || idx > 0) && (
                <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
              )}
              {isLast || !item.href ? (
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className="hover:text-brand-blue-900 dark:hover:text-brand-blue-400 transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
