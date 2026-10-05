import React from 'react';

/** A content-area placeholder that preserves the surrounding application shell. */
export const PageLoadingState: React.FC = () => (
  <div
    role="status"
    aria-label="Loading page"
    className="min-h-[calc(100vh-9rem)] w-full py-4 motion-reduce:animate-none"
  >
    <span className="sr-only">Loading page…</span>
    <div className="animate-pulse motion-reduce:animate-none">
      <div className="h-7 w-48 rounded-lg bg-slate-200 dark:bg-slate-800" />
      <div className="mt-3 h-4 max-w-md rounded bg-slate-100 dark:bg-slate-900" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="h-36 rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" />
        <div className="h-36 rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" />
        <div className="hidden h-36 rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:block" />
      </div>
    </div>
  </div>
);
