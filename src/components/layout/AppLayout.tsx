import React, { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { PageLoadingState } from '../common/PageLoadingState';

export const AppLayout: React.FC = () => {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Suspense fallback={<PageLoadingState />}>
              <div key={pathname} className="page-content-enter">
                <Outlet />
              </div>
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
};

