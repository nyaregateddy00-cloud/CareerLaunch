import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Sun,
  Moon,
  Bell,
  Search,
  Menu,
  X,
  User,
  LogOut,
  Shield,
  Briefcase,
  Layers,
  FileText,
  Bot,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { INITIAL_USER_TEDDY, INITIAL_USER_AMINA, INITIAL_USER_ADMIN } from '../../lib/mockData';
import { mockStorage } from '../../lib/mockStorage';
import { BrandLogo } from '../branding/BrandLogo';
import { prefetchRoute } from '../../lib/routePreload';
import { isSupabaseConfigured } from '../../lib/supabase';
import { getInitials } from '../../lib/utils';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, switchUser, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [unreadNotifications, setUnreadNotifications] = useState(() => mockStorage.getNotifications().filter((item) => !item.isRead).length);

  useEffect(() => {
    const syncUnreadCount = () => setUnreadNotifications(mockStorage.getNotifications().filter((item) => !item.isRead && (!user || item.userId === user.id)).length);
    syncUnreadCount();
    window.addEventListener('careerlaunch_storage_change', syncUnreadCount);
    return () => window.removeEventListener('careerlaunch_storage_change', syncUnreadCount);
  }, [user?.id]);

  const publicNavLinks = [
    { label: 'Explore Opportunities', path: isAuthenticated ? '/app/opportunities' : '/opportunities' },
    { label: 'Search CareerLaunch', path: '/search' },
    { label: 'Features', path: '/features' },
    { label: 'Resources & Guides', path: '/resources' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'About', path: '/about' },
  ];
  const mobileCareerLinks = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Career Roadmap', path: '/career-roadmap' },
    { label: 'Find Opportunities', path: '/app/opportunities' },
    { label: 'Application Tracker', path: '/applications' },
    { label: 'CV Builder', path: '/cv-builder' },
    { label: 'Portfolio Builder', path: '/portfolio-builder' },
    { label: 'Skills & Gaps', path: '/skills' },
    { label: 'CareerLaunch AI', path: '/ai-assistant' },
    { label: 'Interview Arena', path: '/interview-arena' },
    { label: 'Career Analytics', path: '/career-analytics' },
    { label: 'Community', path: '/community' },
    { label: 'Saved Opportunities', path: '/saved-opportunities' },
    { label: 'Learning & Playbooks', path: '/learning' },
    { label: 'Notifications', path: '/notifications' },
    { label: 'Profile', path: '/profile' },
    { label: 'Settings', path: '/settings' },
  ];
  const mobileAdminLinks = [
    { label: 'Admin Dashboard', path: '/admin' },
    { label: 'Manage Users', path: '/admin/users' },
    { label: 'Manage Opportunities', path: '/admin/opportunities' },
    { label: 'Manage Resources', path: '/admin/resources' },
    { label: 'Platform Analytics', path: '/admin/analytics' },
    { label: 'Reports', path: '/admin/reports' },
  ];

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const isLinkActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <BrandLogo to={isAuthenticated ? '/dashboard' : '/'} showRegion />

            {/* Desktop Navigation Links */}
            <nav className="hidden 2xl:flex flex-nowrap items-center gap-0.5">
              {publicNavLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onMouseEnter={() => prefetchRoute(link.path)}
                  onFocus={() => prefetchRoute(link.path)}
                  onTouchStart={() => prefetchRoute(link.path)}
                  className={`whitespace-nowrap px-2 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isLinkActive(link.path)
                      ? 'text-brand-blue-900 dark:text-brand-green-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => navigate('/search')}
              aria-label="Search CareerLaunch"
              className="hidden rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white sm:inline-flex 2xl:hidden"
            ><Search className="h-5 w-5" aria-hidden="true" /></button>
            {/* Demo Role Switcher Badge Dropdown */}
            {!isSupabaseConfigured && <div className="relative">
              <button
                onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
                className="hidden 2xl:flex flex-nowrap items-center gap-1.5 whitespace-nowrap text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-brand-green-300 dark:border-brand-green-800 bg-brand-green-50 dark:bg-brand-green-950/40 text-brand-green-800 dark:text-brand-green-300 hover:bg-brand-green-100 transition-colors"
                title="Preview workspace: switch between sample personas"
              >
                <span className="w-2 h-2 rounded-full bg-brand-green-500"></span>
                <span>Preview: {user ? user.role.replace('_', ' ') : 'Demo'}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {roleSwitcherOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95"
                  onMouseLeave={() => setRoleSwitcherOpen(false)}
                >
                  <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[11px] uppercase tracking-wider font-bold text-slate-400">
                    Switch Test Persona
                  </div>
                  <button
                    onClick={() => {
                      switchUser(INITIAL_USER_TEDDY.id);
                      setRoleSwitcherOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200">Teddy Mwangi</div>
                      <div className="text-slate-500 text-[11px]">CS Graduate (Student/Seeker)</div>
                    </div>
                    {user?.id === INITIAL_USER_TEDDY.id && (
                      <span className="text-brand-green-500 font-bold">✓</span>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      switchUser(INITIAL_USER_AMINA.id);
                      setRoleSwitcherOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200">Amina Wanjiku</div>
                      <div className="text-slate-500 text-[11px]">Senior Designer (Freelancer)</div>
                    </div>
                    {user?.id === INITIAL_USER_AMINA.id && (
                      <span className="text-brand-green-500 font-bold">✓</span>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      switchUser(INITIAL_USER_ADMIN.id);
                      setRoleSwitcherOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200">Sarah Kipchoge</div>
                      <div className="text-slate-500 text-[11px]">Platform Administrator</div>
                    </div>
                    {user?.id === INITIAL_USER_ADMIN.id && (
                      <span className="text-brand-green-500 font-bold">✓</span>
                    )}
                  </button>
                </div>
              )}
            </div>}

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Authenticated State vs Public State */}
            {isAuthenticated && user ? (
              <>
                {/* Notifications Bell */}
                <Link
                  to="/notifications"
                  className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-brand-green-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </Link>

                {/* Dashboard Quick Access Link */}
                <Link
                  to="/dashboard"
                  className="hidden 2xl:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-brand-blue-50 dark:bg-brand-blue-950/50 text-brand-blue-900 dark:text-brand-blue-300 hover:bg-brand-blue-100 transition-colors"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  Dashboard
                </Link>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt="" className="w-8 h-8 rounded-lg object-cover border border-slate-200 dark:border-slate-700" />
                    ) : (
                      <span aria-hidden="true" className="grid h-8 w-8 place-items-center rounded-lg border border-brand-blue-100 bg-brand-blue-50 text-[10px] font-bold text-brand-blue-800 dark:border-slate-700 dark:bg-slate-800 dark:text-brand-green-300">{getInitials(user.fullName)}</span>
                    )}
                    <span className="hidden md:block text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[100px] truncate">
                      {user.fullName.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95"
                      onMouseLeave={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.fullName}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                        <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand-green-100 text-brand-green-800 dark:bg-brand-green-950 dark:text-brand-green-300">
                          {user.role}
                        </div>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                          <Briefcase className="w-4 h-4 text-slate-400" />
                          Dashboard
                        </Link>
                        <Link
                          to="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          My Profile & CV
                        </Link>
                        <Link
                          to="/cv-builder"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                          <FileText className="w-4 h-4 text-slate-400" />
                          Interactive CV Builder
                        </Link>
                        <Link
                          to="/applications"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                          <Layers className="w-4 h-4 text-slate-400" />
                          Applications Tracker
                        </Link>
                        <Link
                          to="/ai-assistant"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                          <Bot className="w-4 h-4 text-brand-green-500" />
                          CareerLaunch AI
                        </Link>
                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-brand-blue-700 dark:text-brand-blue-400 hover:bg-brand-blue-50 dark:hover:bg-brand-blue-950/40"
                          >
                            <Shield className="w-4 h-4 text-brand-blue-600" />
                            Admin Console
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-medium"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-brand-blue-900 dark:hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold rounded-xl bg-brand-green-500 hover:bg-brand-green-600 text-white shadow-sm shadow-brand-green-500/20 transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              className="2xl:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div id="mobile-navigation" className="2xl:hidden max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain py-4 border-t border-slate-200 dark:border-slate-800 animate-in slide-in-from-top-2 duration-150">
            <div className="flex flex-col space-y-1">
              {publicNavLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onMouseEnter={() => prefetchRoute(link.path)}
                  onFocus={() => prefetchRoute(link.path)}
                  onTouchStart={() => prefetchRoute(link.path)}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {link.label}
                </Link>
              ))}

              {isAuthenticated && (
                <>
                  <div className="pt-2 pb-1 border-t border-slate-100 dark:border-slate-800">
                    <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      My Career Hub
                    </span>
                  </div>
                  {mobileCareerLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onMouseEnter={() => prefetchRoute(link.path)}
                      onFocus={() => prefetchRoute(link.path)}
                      onTouchStart={() => prefetchRoute(link.path)}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 ${link.path === '/ai-assistant' ? 'font-semibold text-brand-green-600 dark:text-brand-green-400' : 'text-slate-700 dark:text-slate-200'}`}
                    >
                      {link.label}
                    </Link>
                  ))}
                  {isAdmin && (
                    <>
                      <div className="pt-2 pb-1 border-t border-slate-100 dark:border-slate-800">
                        <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Admin</span>
                      </div>
                      {mobileAdminLinks.map((link) => (
                        <Link
                          key={link.path}
                          to={link.path}
                          onMouseEnter={() => prefetchRoute(link.path)}
                          onFocus={() => prefetchRoute(link.path)}
                          onTouchStart={() => prefetchRoute(link.path)}
                          onClick={() => setMobileMenuOpen(false)}
                          className="px-3 py-2 text-sm font-semibold text-brand-blue-600 dark:text-brand-blue-400 hover:bg-brand-blue-50 dark:hover:bg-brand-blue-950/40"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

