import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Sun,
  Moon,
  Bell,
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
import { isSupabaseConfigured } from '../../lib/supabase';
import { BrandLogo } from '../branding/BrandLogo';
import { Avatar } from '../common/Avatar';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, switchUser, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const unreadNotifications = mockStorage.getNotifications().filter(n => !n.isRead).length;

  const publicNavLinks = [
    { label: 'Explore Opportunities', path: '/opportunities' },
    { label: 'Features', path: '/features' },
    { label: 'Resources & Guides', path: '/resources' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'About', path: '/about' },
  ];

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const isLinkActive = (path: string) => {
    return location.pathname === path;
  };
  const dashboardPath = isAdmin ? '/admin' : '/dashboard';
  const careerNavLinks = [
    { label: 'Dashboard', path: dashboardPath },
    { label: 'Find Opportunities', path: '/opportunities' },
    { label: 'Application Tracker', path: '/applications' },
    { label: 'CV Builder', path: '/cv-builder' },
    { label: 'Portfolio Builder', path: '/portfolio-builder' },
    { label: 'Skills & Gaps', path: '/skills' },
    { label: 'CareerLaunch AI', path: '/ai-assistant' },
    { label: 'Saved Opportunities', path: '/saved-opportunities' },
    { label: 'Learning & Playbooks', path: '/learning' },
    { label: 'Notifications', path: '/notifications' },
    { label: 'Profile', path: '/profile' },
    { label: 'Settings', path: '/settings' },
  ];
  const adminNavLinks = [
    { label: 'Manage Users', path: '/admin/users' },
    { label: 'Manage Opportunities', path: '/admin/opportunities' },
    { label: 'Manage Resources', path: '/admin/resources' },
    { label: 'Platform Analytics', path: '/admin/analytics' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-white/[0.06] bg-white/95 dark:bg-black/95 backdrop-blur-md transition-colors shadow-sm dark:shadow-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <BrandLogo to={isAuthenticated ? dashboardPath : '/'} showRegion />

            {/* Desktop Navigation Links */}
            {!isAuthenticated && (
              <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
                {publicNavLinks.map(link => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isLinkActive(link.path)
                        ? 'text-brand-blue-900 dark:text-brand-green-400 font-semibold'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            )}
          </div>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-1 sm:gap-2.5">
            {/* Demo Role Switcher — only visible in local/demo mode without Supabase */}
            {!isSupabaseConfigured && (
              <div className="relative">
                <button
                  onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
                  className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-brand-green-300 dark:border-brand-green-800 bg-brand-green-50 dark:bg-brand-green-950/40 text-brand-green-800 dark:text-brand-green-300 hover:bg-brand-green-100 transition-colors"
                  title="Switch persona to test different user roles"
                >
                  <span className="w-2 h-2 rounded-full bg-brand-green-500 animate-pulse"></span>
                  <span>Role: {user ? user.role.replace('_', ' ') : 'Demo'}</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                </button>

                {roleSwitcherOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#0f0f0f] rounded-xl shadow-xl border border-slate-200 dark:border-white/[0.08] py-2 z-50 animate-in fade-in zoom-in-95"
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
              </div>
            )}

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
                  className="relative hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition-colors sm:block"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-brand-green-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </Link>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Avatar src={user.avatarUrl} name={user.fullName} className="h-8 w-8 rounded-lg border border-slate-200 dark:border-slate-700" />
                    <span className="hidden md:block text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[100px] truncate">
                      {user.fullName.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#0f0f0f] rounded-2xl shadow-xl border border-slate-200 dark:border-white/[0.08] py-2 z-50 animate-in fade-in zoom-in-95"
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
                          to={dashboardPath}
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
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <nav id="mobile-navigation-menu" aria-label="Mobile navigation" className="lg:hidden max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain py-4 border-t border-slate-200 dark:border-slate-800 animate-in slide-in-from-top-2 duration-150">
            <div className="flex flex-col space-y-1">
              {publicNavLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
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
                  {careerNavLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      aria-current={isLinkActive(link.path) ? 'page' : undefined}
                      className={`px-3 py-2.5 rounded-xl text-sm hover:bg-slate-100 dark:hover:bg-slate-800 ${isLinkActive(link.path) ? 'font-semibold text-brand-blue-800 dark:text-brand-green-300' : 'text-slate-700 dark:text-slate-200'} ${link.path === '/ai-assistant' ? 'font-semibold text-brand-green-700 dark:text-brand-green-400' : ''}`}
                    >
                      {link.label}
                    </Link>
                  ))}
                  {isAdmin && (
                    <>
                      <div className="pt-2 pb-1 border-t border-slate-100 dark:border-slate-800">
                        <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-brand-blue-600 dark:text-brand-blue-400">Admin Console</span>
                      </div>
                      {adminNavLinks.map((link) => (
                        <Link key={link.path} to={link.path} onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-xl text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">{link.label}</Link>
                      ))}
                    </>
                  )}
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

