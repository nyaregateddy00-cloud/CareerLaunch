import React, { useEffect, useState } from 'react';
import {
  Settings,
  Sun,
  Moon,
  Bell,
  Key,
  Globe,
  Shield,
  RefreshCw,
  Mail,
  Lock,
  CheckCircle2,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { PageHeader } from '../../components/common/PageHeader';
import { Badge } from '../../components/common/Badge';
import { mockStorage } from '../../lib/mockStorage';
import { useToast } from '../../hooks/useToast';
import { isSupabaseConfigured } from '../../lib/supabase';

export const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { user, resetPassword } = useAuth();
  const { showToast } = useToast();

  const [currency, setCurrency] = useState<'KES' | 'USD' | 'RWF' | 'NGN'>('KES');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [interviewReminders, setInterviewReminders] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [shareCareerContext, setShareCareerContext] = useState(false);
  const [resetBusy, setResetBusy] = useState(false);

  useEffect(() => {
    const preferences = mockStorage.getPreferences();
    setCurrency(preferences.currency);
    setEmailAlerts(preferences.emailAlerts);
    setInterviewReminders(preferences.interviewReminders);
    setWeeklyDigest(preferences.weeklyDigest);
    setShareCareerContext(preferences.shareCareerContext);
    setTheme(preferences.appearance);
  }, [user?.id, setTheme]);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    mockStorage.setPreferences({ currency, emailAlerts, interviewReminders, weeklyDigest, appearance: theme, shareCareerContext });
    showToast('Platform preferences updated successfully', 'success');
  };

  const handlePasswordReset = async () => {
    if (!user?.email || resetBusy) return;
    setResetBusy(true);
    const sent = await resetPassword(user.email);
    setResetBusy(false);
    showToast(sent ? 'If an account exists for that address, a password reset link is on its way.' : 'Password recovery needs working Supabase authentication. Please try again later.', sent ? 'success' : 'error');
  };

  const handleResetData = () => {
    if (isSupabaseConfigured) return;
    if (confirm('Reset all demo data back to default initial state?')) {
      mockStorage.resetAll();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <PageHeader
        title="Platform Settings"
        subtitle="Manage your theme, notification channels, security, and regional preferences."
        breadcrumbs={[{ label: 'Settings' }]}
      />

      {/* Account & Security Details */}
      <Card className="p-6 sm:p-8 space-y-4">
        <div className="pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-brand-blue-700 dark:text-brand-blue-400" />
              Account & Security
            </h3>
            <p className="text-xs text-slate-500">
              Authentication and security settings for your CareerLaunch account.
            </p>
          </div>
          <Badge variant={isSupabaseConfigured ? 'green' : 'amber'} size="sm">
            {isSupabaseConfigured ? 'Supabase Auth Active' : 'Local Storage Mode'}
          </Badge>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <div>
              <span className="font-semibold text-slate-900 dark:text-white">Account Email</span>
              <p className="text-slate-500">{user?.email}</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handlePasswordReset}
              disabled={resetBusy || !isSupabaseConfigured}
            >
              {resetBusy ? 'Sending…' : 'Email password reset link'}
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6 sm:p-8 space-y-3">
        <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">AI Career Coach privacy</h3>
          <p className="mt-1 text-xs leading-5 text-slate-500">By default, your saved profile, CV, skills, applications, and opportunities stay out of AI requests. Turn on this option to send relevant career context to the configured AI provider when you chat or request interview feedback.</p>
        </div>
        <label className="flex items-start gap-3 text-xs text-slate-700 dark:text-slate-300">
          <input type="checkbox" checked={shareCareerContext} onChange={(event) => setShareCareerContext(event.target.checked)} className="mt-0.5" />
          <span>Allow CareerLaunch Coach to use my career context in AI requests.</span>
        </label>
        <Button type="button" size="sm" variant="secondary" onClick={() => { const prefs = mockStorage.getPreferences(); mockStorage.setPreferences({ ...prefs, shareCareerContext, currency, emailAlerts, interviewReminders, weeklyDigest, appearance: theme }); showToast('AI privacy preference saved', 'success'); }}>Save AI privacy preference</Button>
      </Card>

      {/* Appearance & Theme */}
      <Card className="p-6 sm:p-8 space-y-4">
        <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            {theme === 'dark' ? (
              <Moon className="w-5 h-5 text-amber-400" />
            ) : (
              <Sun className="w-5 h-5 text-amber-500" />
            )}
            Interface Appearance & Theme
          </h3>
          <p className="text-xs text-slate-500">Choose between clean light and modern dark mode.</p>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-sm">
          <button
            onClick={() => setTheme('light')}
            className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 ${
              theme === 'light'
                ? 'border-brand-blue-700 bg-brand-blue-50/50 text-brand-blue-900 font-bold ring-2 ring-brand-blue-500/20'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-400 text-slate-600'
            }`}
          >
            <Sun className="w-6 h-6 text-amber-500" />
            <span className="text-xs">Light Mode</span>
          </button>

          <button
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 ${
              theme === 'dark'
                ? 'border-brand-green-500 bg-slate-900 text-white font-bold ring-2 ring-brand-green-500/20'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-400 text-slate-600'
            }`}
          >
            <Moon className="w-6 h-6 text-amber-400" />
            <span className="text-xs">Dark Mode</span>
          </button>
        </div>
      </Card>

      {/* Regional & Currency Preferences */}
      <Card className="p-6 sm:p-8 space-y-4">
        <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-brand-blue-600 dark:text-brand-blue-400" />
            Regional & Notification Preferences
          </h3>
          <p className="text-xs text-slate-500">
              Set your currency display and notification preferences. Email delivery depends on the platform notification service being configured.
          </p>
        </div>

        <form onSubmit={handleSavePreferences} className="space-y-5 max-w-lg">
          <Select
            label="Primary Currency Display"
            value={currency}
            onChange={(e) => setCurrency(e.target.value as typeof currency)}
            options={[
              { value: 'KES', label: 'Kenya Shillings (KES)' },
              { value: 'USD', label: 'US Dollars (USD)' },
              { value: 'RWF', label: 'Rwandan Francs (RWF)' },
              { value: 'NGN', label: 'Nigerian Naira (NGN)' },
            ]}
          />

          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Email Notifications
            </h4>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-brand-blue-900 focus:ring-brand-blue-500"
              />
              <span className="text-xs text-slate-700 dark:text-slate-300">
                New opportunity alerts matching your skills
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={interviewReminders}
                onChange={(e) => setInterviewReminders(e.target.checked)}
                className="w-4 h-4 rounded text-brand-blue-900 focus:ring-brand-blue-500"
              />
              <span className="text-xs text-slate-700 dark:text-slate-300">
                Application stage change & interview deadline reminders
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={weeklyDigest}
                onChange={(e) => setWeeklyDigest(e.target.checked)}
                className="w-4 h-4 rounded text-brand-blue-900 focus:ring-brand-blue-500"
              />
              <span className="text-xs text-slate-700 dark:text-slate-300">
                Weekly career digest preference (delivery requires a notification service)
              </span>
            </label>
          </div>

          <div className="pt-2">
            <Button type="submit" variant="primary" size="md">
              Save Preferences
            </Button>
          </div>
        </form>
      </Card>

      {/* Destructive preview-only reset; never expose it to a Supabase workspace. */}
      {!isSupabaseConfigured && <Card className="p-6 sm:p-8 space-y-4 border-rose-200 dark:border-rose-900/40">
        <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            Reset Demo Dataset
          </h3>
          <p className="text-xs text-slate-500">
            Clear all local modifications and restore the initial sample dataset (Teddy Mwangi,
            Safaricom, Andela, applications).
          </p>
        </div>

        <div>
          <Button variant="danger" size="sm" onClick={handleResetData}>
            Reset All Data to Factory Default
          </Button>
        </div>
      </Card>}
    </div>
  );
};
