import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminRoute } from './components/auth/AdminRoute';
import { PublicLayout } from './components/layout/PublicLayout';
import { AppLayout } from './components/layout/AppLayout';

// Public Pages
const LandingPage = lazy(() => import('./pages/public/LandingPage').then((module) => ({ default: module.LandingPage })));
const AboutPage = lazy(() => import('./pages/public/AboutPage').then((module) => ({ default: module.AboutPage })));
const FeaturesPage = lazy(() => import('./pages/public/FeaturesPage').then((module) => ({ default: module.FeaturesPage })));
const OpportunitiesPublicPage = lazy(() => import('./pages/public/OpportunitiesPublicPage').then((module) => ({ default: module.OpportunitiesPublicPage })));
const ResourcesPage = lazy(() => import('./pages/public/ResourcesPage').then((module) => ({ default: module.ResourcesPage })));
const PricingPage = lazy(() => import('./pages/public/PricingPage').then((module) => ({ default: module.PricingPage })));
const ContactPage = lazy(() => import('./pages/public/ContactPage').then((module) => ({ default: module.ContactPage })));
const LoginPage = lazy(() => import('./pages/public/LoginPage').then((module) => ({ default: module.LoginPage })));
const RegisterPage = lazy(() => import('./pages/public/RegisterPage').then((module) => ({ default: module.RegisterPage })));
const ForgotPasswordPage = lazy(() => import('./pages/public/ForgotPasswordPage').then((module) => ({ default: module.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import('./pages/public/ResetPasswordPage').then((module) => ({ default: module.ResetPasswordPage })));
const PublicPortfolioPage = lazy(() => import('./pages/public/PublicPortfolioPage').then((module) => ({ default: module.PublicPortfolioPage })));

// Authenticated User Pages
const DashboardPage = lazy(() => import('./pages/user/DashboardPage').then((module) => ({ default: module.DashboardPage })));
const ProfilePage = lazy(() => import('./pages/user/ProfilePage').then((module) => ({ default: module.ProfilePage })));
const CVBuilderPage = lazy(() => import('./pages/user/CVBuilderPage').then((module) => ({ default: module.CVBuilderPage })));
const PortfolioBuilderPage = lazy(() => import('./pages/user/PortfolioBuilderPage').then((module) => ({ default: module.PortfolioBuilderPage })));
const SavedOpportunitiesPage = lazy(() => import('./pages/user/SavedOpportunitiesPage').then((module) => ({ default: module.SavedOpportunitiesPage })));
const ApplicationsTrackerPage = lazy(() => import('./pages/user/ApplicationsTrackerPage').then((module) => ({ default: module.ApplicationsTrackerPage })));
const SkillsPage = lazy(() => import('./pages/user/SkillsPage').then((module) => ({ default: module.SkillsPage })));
const LearningPage = lazy(() => import('./pages/user/LearningPage').then((module) => ({ default: module.LearningPage })));
const AICareerAssistantPage = lazy(() => import('./pages/user/AICareerAssistantPage').then((module) => ({ default: module.AICareerAssistantPage })));
const NotificationsPage = lazy(() => import('./pages/user/NotificationsPage').then((module) => ({ default: module.NotificationsPage })));
const SettingsPage = lazy(() => import('./pages/user/SettingsPage').then((module) => ({ default: module.SettingsPage })));

// Admin Pages
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage').then((module) => ({ default: module.AdminDashboardPage })));
const AdminUsersPage = lazy(() => import('./pages/admin/AdminUsersPage').then((module) => ({ default: module.AdminUsersPage })));
const AdminOpportunitiesPage = lazy(() => import('./pages/admin/AdminOpportunitiesPage').then((module) => ({ default: module.AdminOpportunitiesPage })));
const AdminResourcesPage = lazy(() => import('./pages/admin/AdminResourcesPage').then((module) => ({ default: module.AdminResourcesPage })));
const AdminReportsPage = lazy(() => import('./pages/admin/AdminReportsPage').then((module) => ({ default: module.AdminReportsPage })));
const AdminAnalyticsPage = lazy(() => import('./pages/admin/AdminAnalyticsPage').then((module) => ({ default: module.AdminAnalyticsPage })));

/** Minimal branded page-level skeleton — shown only while a lazy chunk loads.
 *  Much less jarring than a full-page spinner since the shell (Navbar/Sidebar) is already visible. */
const PageSkeleton: React.FC = () => (
  <div className="w-full space-y-4 py-6 animate-pulse" aria-busy="true" aria-label="Loading page…">
    <div className="skeleton h-8 w-48 rounded-xl" />
    <div className="skeleton h-4 w-80 rounded-lg" />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="skeleton h-36 rounded-2xl" />
      ))}
    </div>
  </div>
);

/** Full-page branded loader — used only for auth pages & standalone routes where there's no shell */
const FullPageLoader: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white dark:bg-black">
    <img
      src="/careerlaunch-mark-192.png"
      alt="CareerLaunch"
      width={48}
      height={48}
      className="h-12 w-12 rounded-xl object-contain shadow-sm ring-1 ring-slate-200 dark:ring-white/10"
    />
    <div className="w-6 h-6 border-2 border-brand-green-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Layout Routes — skeleton fallback keeps Navbar visible */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Suspense fallback={<PageSkeleton />}><LandingPage /></Suspense>} />
                <Route path="/about" element={<Suspense fallback={<PageSkeleton />}><AboutPage /></Suspense>} />
                <Route path="/features" element={<Suspense fallback={<PageSkeleton />}><FeaturesPage /></Suspense>} />
                <Route path="/opportunities" element={<Suspense fallback={<PageSkeleton />}><OpportunitiesPublicPage /></Suspense>} />
                <Route path="/resources" element={<Suspense fallback={<PageSkeleton />}><ResourcesPage /></Suspense>} />
                <Route path="/pricing" element={<Suspense fallback={<PageSkeleton />}><PricingPage /></Suspense>} />
                <Route path="/contact" element={<Suspense fallback={<PageSkeleton />}><ContactPage /></Suspense>} />
              </Route>

              {/* Standalone Auth & Portfolio Routes — full-page loader */}
              <Route path="/login" element={<Suspense fallback={<FullPageLoader />}><LoginPage /></Suspense>} />
              <Route path="/register" element={<Suspense fallback={<FullPageLoader />}><RegisterPage /></Suspense>} />
              <Route path="/forgot-password" element={<Suspense fallback={<FullPageLoader />}><ForgotPasswordPage /></Suspense>} />
              <Route path="/reset-password" element={<Suspense fallback={<FullPageLoader />}><ResetPasswordPage /></Suspense>} />
              <Route path="/u/:username" element={<Suspense fallback={<FullPageLoader />}><PublicPortfolioPage /></Suspense>} />

              {/* Authenticated User Shell — skeleton keeps Navbar+Sidebar visible during lazy load */}
              <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                  <Route path="/dashboard" element={<Suspense fallback={<PageSkeleton />}><DashboardPage /></Suspense>} />
                  <Route path="/profile" element={<Suspense fallback={<PageSkeleton />}><ProfilePage /></Suspense>} />
                  <Route path="/cv-builder" element={<Suspense fallback={<PageSkeleton />}><CVBuilderPage /></Suspense>} />
                  <Route path="/portfolio-builder" element={<Suspense fallback={<PageSkeleton />}><PortfolioBuilderPage /></Suspense>} />
                  <Route path="/saved-opportunities" element={<Suspense fallback={<PageSkeleton />}><SavedOpportunitiesPage /></Suspense>} />
                  <Route path="/applications" element={<Suspense fallback={<PageSkeleton />}><ApplicationsTrackerPage /></Suspense>} />
                  <Route path="/skills" element={<Suspense fallback={<PageSkeleton />}><SkillsPage /></Suspense>} />
                  <Route path="/learning" element={<Suspense fallback={<PageSkeleton />}><LearningPage /></Suspense>} />
                  <Route path="/ai-assistant" element={<Suspense fallback={<PageSkeleton />}><AICareerAssistantPage /></Suspense>} />
                  <Route path="/notifications" element={<Suspense fallback={<PageSkeleton />}><NotificationsPage /></Suspense>} />
                  <Route path="/settings" element={<Suspense fallback={<PageSkeleton />}><SettingsPage /></Suspense>} />

                  {/* Admin Portal Routes */}
                  <Route element={<AdminRoute />}>
                    <Route path="/admin" element={<Suspense fallback={<PageSkeleton />}><AdminDashboardPage /></Suspense>} />
                    <Route path="/admin/users" element={<Suspense fallback={<PageSkeleton />}><AdminUsersPage /></Suspense>} />
                    <Route path="/admin/opportunities" element={<Suspense fallback={<PageSkeleton />}><AdminOpportunitiesPage /></Suspense>} />
                    <Route path="/admin/resources" element={<Suspense fallback={<PageSkeleton />}><AdminResourcesPage /></Suspense>} />
                    <Route path="/admin/reports" element={<Suspense fallback={<PageSkeleton />}><AdminReportsPage /></Suspense>} />
                    <Route path="/admin/analytics" element={<Suspense fallback={<PageSkeleton />}><AdminAnalyticsPage /></Suspense>} />
                  </Route>
                </Route>
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
