import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { PageLoadingState } from '../common/PageLoadingState';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />
      <main className="min-w-0 flex-1">
        <Suspense fallback={<PageLoadingState />}>
          <div className="page-content-enter min-w-0 w-full">
            <Outlet />
          </div>
        </Suspense>
      </main>
    </div>
  );
};

