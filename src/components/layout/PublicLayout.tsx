import React, { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { PageLoadingState } from '../common/PageLoadingState';

export const PublicLayout: React.FC = () => {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<PageLoadingState />}>
          <div key={pathname} className="page-content-enter">
            <Outlet />
          </div>
        </Suspense>
      </main>
    </div>
  );
};

