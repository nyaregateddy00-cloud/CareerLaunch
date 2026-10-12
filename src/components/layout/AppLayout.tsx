import React, { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export const AppLayout: React.FC = () => {
  const location = useLocation();
  const mainRef = useRef<HTMLDivElement>(null);

  // Scroll to top and trigger page-enter animation on route change
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0 });
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] dark:bg-black text-slate-900 dark:text-[#F5F5F5] transition-colors duration-200">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main
          ref={mainRef}
          className="flex-1 overflow-y-auto"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 page-enter" key={location.pathname}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
