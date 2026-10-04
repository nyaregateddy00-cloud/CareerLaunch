import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminRoute } from './components/auth/AdminRoute';
import { PublicLayout } from './components/layout/PublicLayout';
import { AppLayout } from './components/layout/AppLayout';
import { LoadingSpinner } from './components/common/LoadingSpinner';

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

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" text="Loading page..." /></div>}>
            <Routes>
              {/* Public Layout Routes with Navbar */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/features" element={<FeaturesPage />} />
                <Route path="/opportunities" element={<OpportunitiesPublicPage />} />
                <Route path="/resources" element={<ResourcesPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/contact" element={<ContactPage />} />
              </Route>

              {/* Standalone Auth & Public Portfolio Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/u/:username" element={<PublicPortfolioPage />} />

              {/* Authenticated User Shell Routes Protected via ProtectedRoute */}
              <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/cv-builder" element={<CVBuilderPage />} />
                  <Route path="/portfolio-builder" element={<PortfolioBuilderPage />} />
                  <Route path="/saved-opportunities" element={<SavedOpportunitiesPage />} />
                  <Route path="/applications" element={<ApplicationsTrackerPage />} />
                  <Route path="/skills" element={<SkillsPage />} />
                  <Route path="/learning" element={<LearningPage />} />
                  <Route path="/ai-assistant" element={<AICareerAssistantPage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />

                  {/* Admin Portal Routes Protected via AdminRoute */}
                  <Route element={<AdminRoute />}>
                    <Route path="/admin" element={<AdminDashboardPage />} />
                    <Route path="/admin/users" element={<AdminUsersPage />} />
                    <Route path="/admin/opportunities" element={<AdminOpportunitiesPage />} />
                    <Route path="/admin/resources" element={<AdminResourcesPage />} />
                    <Route path="/admin/reports" element={<AdminReportsPage />} />
                    <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
                  </Route>
                </Route>
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
