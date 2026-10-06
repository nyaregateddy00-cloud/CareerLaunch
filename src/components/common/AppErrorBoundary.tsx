import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props { children: ReactNode; }
interface State { hasError: boolean; }

/** Keep an unexpected render failure from becoming a blank application screen. */
export class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State { return { hasError: true }; }

  componentDidCatch(_error: Error, _info: ErrorInfo): void {
    // Avoid logging user profile or career data to browser consoles.
  }

  render() {
    if (this.state.hasError) return <main role="alert" className="grid min-h-screen place-items-center bg-slate-50 px-4 text-center dark:bg-slate-950"><div className="max-w-md"><p className="text-xs font-bold uppercase tracking-wider text-brand-green-700 dark:text-brand-green-300">CareerLaunch</p><h1 className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-white">This page hit a snag.</h1><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Your workspace is still here. Return to the home page and try again.</p><button type="button" onClick={() => window.location.assign('/')} className="mt-5 rounded-xl bg-brand-blue-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green-500">Return home</button></div></main>;
    return this.props.children;
  }
}
