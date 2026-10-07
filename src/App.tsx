import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminRoute } from './components/auth/AdminRoute';
import { PublicLayout } from './components/layout/PublicLayout';
import { AppLayout } from './components/layout/AppLayout';
import { PageLoadingState } from './components/common/PageLoadingState';
import { AppErrorBoundary } from './components/common/AppErrorBoundary';

const routeView = (page: React.ReactNode) => <Suspense fallback={<PageLoadingState />}>{page}</Suspense>;

// Public Pages
const LandingPage = lazy(() => import('./pages/public/LandingPage').then((module) => ({ default: module.LandingPage })));
const AboutPage = lazy(() => import('./pages/public/AboutPage').then((module) => ({ default: module.AboutPage })));
const FeaturesPage = lazy(() => import('./pages/public/FeaturesPage').then((module) => ({ default: module.FeaturesPage })));
const OpportunitiesPublicPage = lazy(() => import('./pages/public/OpportunitiesPublicPage').then((module) => ({ default: module.OpportunitiesPublicPage })));
const ResourcesPage = lazy(() => import('./pages/public/ResourcesPage').then((module) => ({ default: module.ResourcesPage })));
const SearchPage = lazy(() => import('./pages/public/SearchPage').then((module) => ({ default: module.SearchPage })));
const PricingPage = lazy(() => import('./pages/public/PricingPage').then((module) => ({ default: module.PricingPage })));
const ContactPage = lazy(() => import('./pages/public/ContactPage').then((module) => ({ default: module.ContactPage })));
const LoginPage = lazy(() => import('./pages/public/LoginPage').then((module) => ({ default: module.LoginPage })));
const RegisterPage = lazy(() => import('./pages/public/RegisterPage').then((module) => ({ default: module.RegisterPage })));
const ForgotPasswordPage = lazy(() => import('./pages/public/ForgotPasswordPage').then((module) => ({ default: module.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import('./pages/public/ResetPasswordPage').then((module) => ({ default: module.ResetPasswordPage })));
const PublicPortfolioPage = lazy(() => import('./pages/public/PublicPortfolioPage').then((module) => ({ default: module.PublicPortfolioPage })));

// Authenticated User Pages
const DashboardPage = lazy(() => import('./pages/user/DashboardPage').then((module) => ({ default: module.DashboardPage })));
const CareerRoadmapPage = lazy(() => import('./pages/user/CareerRoadmapPage').then((module) => ({ default: module.CareerRoadmapPage })));
const ProfilePage = lazy(() => import('./pages/user/ProfilePage').then((module) => ({ default: module.ProfilePage })));
const CVBuilderPage = lazy(() => import('./pages/user/CVBuilderPage').then((module) => ({ default: module.CVBuilderPage })));
const PortfolioBuilderPage = lazy(() => import('./pages/user/PortfolioBuilderPage').then((module) => ({ default: module.PortfolioBuilderPage })));
const SavedOpportunitiesPage = lazy(() => import('./pages/user/SavedOpportunitiesPage').then((module) => ({ default: module.SavedOpportunitiesPage })));
const ApplicationsTrackerPage = lazy(() => import('./pages/user/ApplicationsTrackerPage').then((module) => ({ default: module.ApplicationsTrackerPage })));
const SkillsPage = lazy(() => import('./pages/user/SkillsPage').then((module) => ({ default: module.SkillsPage })));
const LearningPage = lazy(() => import('./pages/user/LearningPage').then((module) => ({ default: module.LearningPage })));
const AICareerAssistantPage = lazy(() => import('./pages/user/AICareerAssistantPage').then((module) => ({ default: module.AICareerAssistantPage })));
const InterviewArenaPage = lazy(() => import('./pages/user/InterviewArenaPage').then((module) => ({ default: module.InterviewArenaPage })));
const CareerAnalyticsPage = lazy(() => import('./pages/user/CareerAnalyticsPage').then((module) => ({ default: module.CareerAnalyticsPage })));
const PlaybooksPage = lazy(() => import('./pages/user/PlaybooksPage').then((module) => ({ default: module.PlaybooksPage })));
const PlaybookDetailPage = lazy(() => import('./pages/user/PlaybookDetailPage').then((module) => ({ default: module.PlaybookDetailPage })));
const CommunityPage = lazy(() => import('./pages/user/CommunityPage').then((module) => ({ default: module.CommunityPage })));
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
    <AppErrorBoundary>
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Layout Routes with Navbar */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={routeView(<LandingPage />)} />
                <Route path="/about" element={routeView(<AboutPage />)} />
                <Route path="/features" element={routeView(<FeaturesPage />)} />
                <Route path="/opportunities" element={routeView(<OpportunitiesPublicPage />)} />
                <Route path="/resources" element={routeView(<ResourcesPage />)} />
                <Route path="/search" element={routeView(<SearchPage />)} />
                <Route path="/pricing" element={routeView(<PricingPage />)} />
                <Route path="/contact" element={routeView(<ContactPage />)} />
              </Route>

              {/* Standalone Auth & Public Portfolio Routes */}
              <Route path="/login" element={routeView(<LoginPage />)} />
              <Route path="/register" element={routeView(<RegisterPage />)} />
              <Route path="/forgot-password" element={routeView(<ForgotPasswordPage />)} />
              <Route path="/reset-password" element={routeView(<ResetPasswordPage />)} />
              <Route path="/u/:username" element={routeView(<PublicPortfolioPage />)} />

              {/* Authenticated User Shell Routes Protected via ProtectedRoute */}
              <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                  <Route path="/app/opportunities" element={routeView(<OpportunitiesPublicPage />)} />
                  <Route path="/dashboard" element={routeView(<DashboardPage />)} />
                  <Route path="/career-roadmap" element={routeView(<CareerRoadmapPage />)} />
                  <Route path="/profile" element={routeView(<ProfilePage />)} />
                  <Route path="/cv-builder" element={routeView(<CVBuilderPage />)} />
                  <Route path="/portfolio-builder" element={routeView(<PortfolioBuilderPage />)} />
                  <Route path="/saved-opportunities" element={routeView(<SavedOpportunitiesPage />)} />
                  <Route path="/applications" element={routeView(<ApplicationsTrackerPage />)} />
                  <Route path="/skills" element={routeView(<SkillsPage />)} />
                  <Route path="/learning" element={routeView(<LearningPage />)} />
                  <Route path="/ai-assistant" element={routeView(<AICareerAssistantPage />)} />
                  <Route path="/interview-arena" element={routeView(<InterviewArenaPage />)} />
                  <Route path="/career-analytics" element={routeView(<CareerAnalyticsPage />)} />
                  <Route path="/playbooks" element={routeView(<PlaybooksPage />)} />
                  <Route path="/playbooks/:slug" element={routeView(<PlaybookDetailPage />)} />
                  <Route path="/community" element={routeView(<CommunityPage />)} />
                  <Route path="/notifications" element={routeView(<NotificationsPage />)} />
                  <Route path="/settings" element={routeView(<SettingsPage />)} />

                  {/* Admin Portal Routes Protected via AdminRoute */}
                  <Route element={<AdminRoute />}>
                    <Route path="/admin" element={routeView(<AdminDashboardPage />)} />
                    <Route path="/admin/users" element={routeView(<AdminUsersPage />)} />
                    <Route path="/admin/opportunities" element={routeView(<AdminOpportunitiesPage />)} />
                    <Route path="/admin/resources" element={routeView(<AdminResourcesPage />)} />
                    <Route path="/admin/reports" element={routeView(<AdminReportsPage />)} />
                    <Route path="/admin/analytics" element={routeView(<AdminAnalyticsPage />)} />
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
    </AppErrorBoundary>
  );
}

export default App;
