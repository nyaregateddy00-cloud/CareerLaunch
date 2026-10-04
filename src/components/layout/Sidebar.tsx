import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  Kanban,
  FileText,
  Globe,
  Sparkles,
  Bot,
  BookOpen,
  Bookmark,
  User,
  Settings,
  Shield,
  Users,
  Briefcase,
  BarChart3,
  ArrowUpRight,
  Bell
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BrandLogo } from '../branding/BrandLogo';

export const Sidebar: React.FC = () => {
  const { user, isAdmin } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Find Opportunities', path: '/opportunities', icon: Search },
    { label: 'Application Tracker', path: '/applications', icon: Kanban },
    { label: 'CV Builder', path: '/cv-builder', icon: FileText },
    { label: 'Portfolio Builder', path: '/portfolio-builder', icon: Globe },
    { label: 'Skills & Gaps', path: '/skills', icon: Sparkles },
    { label: 'CareerLaunch AI', path: '/ai-assistant', icon: Bot, isHighlight: true },
    { label: 'Saved Opportunities', path: '/saved-opportunities', icon: Bookmark },
    { label: 'Learning & Playbooks', path: '/learning', icon: BookOpen },
    { label: 'Notifications', path: '/notifications', icon: Bell },
    { label: 'Profile', path: '/profile', icon: User },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const adminNavItems = [
    { label: 'Admin Dashboard', path: '/admin', icon: Shield },
    { label: 'Manage Users', path: '/admin/users', icon: Users },
    { label: 'Manage Opportunities', path: '/admin/opportunities', icon: Briefcase },
    { label: 'Manage Resources', path: '/admin/resources', icon: BookOpen },
    { label: 'Platform Analytics', path: '/admin/analytics', icon: BarChart3 },
  ];

  const strength = user?.profileStrength || 75;

  return (
    <aside className="w-64 flex-shrink-0 hidden md:flex flex-col border-r border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 min-h-[calc(100vh-4rem)] p-4 select-none">
      <BrandLogo to="/dashboard" className="mb-5 px-1 py-1" />
      {/* User Mini Card */}
      {user && (
        <div className="mb-5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <img
              src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={user.fullName}
              className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
            />
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.fullName}</h4>
              <p className="text-[11px] text-slate-500 capitalize truncate">{user.role.replace('_', ' ')}</p>
            </div>
          </div>

          {/* Profile Strength Progress Bar */}
          <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-slate-500 font-medium">Profile Strength</span>
              <span className="font-bold text-brand-green-600 dark:text-brand-green-400">{strength}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-brand-green-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${strength}%` }}
              />
            </div>
            {strength < 100 && (
              <Link
                to="/profile"
                className="mt-1.5 text-[10px] text-brand-blue-700 dark:text-brand-blue-400 font-semibold inline-flex items-center gap-0.5 hover:underline"
              >
                Complete profile <ArrowUpRight className="w-2.5 h-2.5" />
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Main Navigation Items */}
      <div className="flex-1 space-y-1 overflow-y-auto">
        <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Main Menu
        </div>
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-brand-blue-900 text-white shadow-sm dark:bg-brand-blue-600'
                  : item.isHighlight
                  ? 'text-brand-green-600 dark:text-brand-green-400 hover:bg-brand-green-50 dark:hover:bg-brand-green-950/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`
            }
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{item.label}</span>
            {item.isHighlight && (
              <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded bg-brand-green-100 text-brand-green-800 dark:bg-brand-green-900/60 dark:text-brand-green-300">
                AI
              </span>
            )}
          </NavLink>
        ))}

        {/* Admin Navigation Section */}
        {isAdmin && (
          <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800 space-y-1">
            <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-blue-700 dark:text-brand-blue-400">
              Admin Console
            </div>
            {adminNavItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-brand-blue-100 text-brand-blue-900 dark:bg-brand-blue-950 dark:text-brand-blue-300 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`
                }
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            ))}
          </div>
        )}
      </div>

      {/* Quick Launch Shareable Portfolio Link */}
      {user && (
        <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800">
          <Link
            to={`/u/${user.fullName.toLowerCase().replace(/\s+/g, '')}`}
            target="_blank"
            className="w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-brand-green-500" />
              Public Portfolio
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>
      )}
    </aside>
  );
};

