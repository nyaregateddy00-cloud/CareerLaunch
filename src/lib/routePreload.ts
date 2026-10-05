const routeLoaders: Record<string, () => Promise<unknown>> = {
  '/': () => import('../pages/public/LandingPage'),
  '/about': () => import('../pages/public/AboutPage'),
  '/features': () => import('../pages/public/FeaturesPage'),
  '/opportunities': () => import('../pages/public/OpportunitiesPublicPage'),
  '/app/opportunities': () => import('../pages/public/OpportunitiesPublicPage'),
  '/resources': () => import('../pages/public/ResourcesPage'),
  '/pricing': () => import('../pages/public/PricingPage'),
  '/contact': () => import('../pages/public/ContactPage'),
  '/login': () => import('../pages/public/LoginPage'),
  '/register': () => import('../pages/public/RegisterPage'),
  '/forgot-password': () => import('../pages/public/ForgotPasswordPage'),
  '/reset-password': () => import('../pages/public/ResetPasswordPage'),
  '/dashboard': () => import('../pages/user/DashboardPage'),
  '/profile': () => import('../pages/user/ProfilePage'),
  '/cv-builder': () => import('../pages/user/CVBuilderPage'),
  '/portfolio-builder': () => import('../pages/user/PortfolioBuilderPage'),
  '/saved-opportunities': () => import('../pages/user/SavedOpportunitiesPage'),
  '/applications': () => import('../pages/user/ApplicationsTrackerPage'),
  '/skills': () => import('../pages/user/SkillsPage'),
  '/learning': () => import('../pages/user/LearningPage'),
  '/ai-assistant': () => import('../pages/user/AICareerAssistantPage'),
  '/notifications': () => import('../pages/user/NotificationsPage'),
  '/settings': () => import('../pages/user/SettingsPage'),
  '/admin': () => import('../pages/admin/AdminDashboardPage'),
  '/admin/users': () => import('../pages/admin/AdminUsersPage'),
  '/admin/opportunities': () => import('../pages/admin/AdminOpportunitiesPage'),
  '/admin/resources': () => import('../pages/admin/AdminResourcesPage'),
  '/admin/reports': () => import('../pages/admin/AdminReportsPage'),
  '/admin/analytics': () => import('../pages/admin/AdminAnalyticsPage'),
};

/** Fetch a route's code on navigation intent so the click can render immediately. */
export function prefetchRoute(path: string): void {
  const routePath = path.split('?')[0];
  const loader = routeLoaders[routePath]
    ?? (routePath.startsWith('/u/') ? () => import('../pages/public/PublicPortfolioPage') : undefined);
  if (loader) void loader().catch(() => undefined);
}
