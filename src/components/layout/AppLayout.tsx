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
    <div className="min-h-screen min-h-dvh flex flex-col bg-[#FAFAFA] dark:bg-black text-slate-900 dark:text-[#F5F5F5] transition-colors duration-200">
      <Navbar />
      <div className="min-h-0 flex flex-1 overflow-hidden">
        <Sidebar />
        <main
          ref={mainRef}
          className="min-h-0 min-w-0 w-full flex-1 overflow-x-hidden overflow-y-auto"
        >
          <div className="min-w-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 page-enter" key={location.pathname}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
