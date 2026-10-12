import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-slate-900 dark:text-[#F5F5F5] transition-colors duration-200">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

