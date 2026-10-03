import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminRoute } from './components/auth/AdminRoute';
import { PublicLayout } from './components/layout/PublicLayout';
import { AppLayout } from './components/layout/AppLayout';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { AboutPage } from './pages/public/AboutPage';
import { FeaturesPage } from './pages/public/FeaturesPage';
import { OpportunitiesPublicPage } from './pages/public/OpportunitiesPublicPage';
import { ResourcesPage } from './pages/public/ResourcesPage';
import { PricingPage } from './pages/public/PricingPage';
import { ContactPage } from './pages/public/ContactPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { ForgotPasswordPage } from './pages/public/ForgotPasswordPage';
import { PublicPortfolioPage } from './pages/public/PublicPortfolioPage';

// Authenticated User Pages
import { DashboardPage } from './pages/user/DashboardPage';
import { ProfilePage } from './pages/user/ProfilePage';
import { CVBuilderPage } from './pages/user/CVBuilderPage';
import { PortfolioBuilderPage } from './pages/user/PortfolioBuilderPage';
import { SavedOpportunitiesPage } from './pages/user/SavedOpportunitiesPage';
import { ApplicationsTrackerPage } from './pages/user/ApplicationsTrackerPage';
import { SkillsPage } from './pages/user/SkillsPage';
import { LearningPage } from './pages/user/LearningPage';
import { AICareerAssistantPage } from './pages/user/AICareerAssistantPage';
import { NotificationsPage } from './pages/user/NotificationsPage';
import { SettingsPage } from './pages/user/SettingsPage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminOpportunitiesPage } from './pages/admin/AdminOpportunitiesPage';
import { AdminResourcesPage } from './pages/admin/AdminResourcesPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
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
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
