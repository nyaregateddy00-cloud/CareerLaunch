import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Chrome, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card } from '../../components/common/Card';
import { isSupabaseConfigured } from '../../lib/supabase';
import { BrandLogo } from '../../components/branding/BrandLogo';
import { INITIAL_USER_TEDDY, INITIAL_USER_AMINA, INITIAL_USER_ADMIN } from '../../lib/mockData';
import { UserCheck, Shield } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, signInWithGoogle, switchUser, isLoading, authError, authNotice } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    const ok = await login(email, password);
    if (ok) {
      navigate('/dashboard');
    }
  };

  const handleGoogleLogin = async () => {
    await signInWithGoogle();
  };

  const handleQuickLogin = (userId: string) => {
    switchUser(userId);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50 dark:bg-black">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <BrandLogo variant="full" className="mb-6 justify-center" imageClassName="w-24 sm:w-28" />
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Welcome back
        </h1>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
          Sign in to your CareerLaunch account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Card className="p-8 shadow-hero dark:bg-[#111111]">
          <div className="space-y-5">
            {/* Success / Notice Banner */}
            {authNotice && (
              <div role="status" className="rounded-xl bg-emerald-50 dark:bg-emerald-950/40 p-4 text-sm text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800/50">
                <p className="font-semibold mb-0.5">Check your inbox</p>
                <p className="text-xs opacity-90">{authNotice}</p>
              </div>
            )}

            {/* Error Banner */}
            {authError && (
              <div role="alert" className="rounded-xl bg-rose-50 dark:bg-rose-950/40 p-4 text-sm text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-800/50">
                <p className="font-semibold">Sign-in failed</p>
                <p className="text-xs mt-0.5 opacity-90">{authError}</p>
              </div>
            )}

            {/* Main Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                leftIcon={<Mail className="w-4 h-4" />}
              />

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-brand-blue-700 dark:text-brand-green-400 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    leftIcon={<Lock className="w-4 h-4" />}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isLoading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Sign In
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-white/[0.08]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-[#111111] px-3 text-slate-400 font-semibold tracking-wider">
                  or continue with
                </span>
              </div>
            </div>

            {/* Google Sign-In */}
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              isLoading={isLoading}
              onClick={handleGoogleLogin}
              leftIcon={<Chrome className="w-4 h-4" />}
            >
              Continue with Google
            </Button>

            {/* Demo Personas — only shown in non-production / demo environments */}
            {!isSupabaseConfigured && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center mb-2">
                  Demo profiles (local preview only)
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { user: INITIAL_USER_TEDDY, label: 'CS Graduate / Job Seeker', icon: <UserCheck className="w-4 h-4 text-brand-green-500" /> },
                    { user: INITIAL_USER_AMINA, label: 'UI/UX Designer / Freelancer', icon: <UserCheck className="w-4 h-4 text-brand-green-500" /> },
                    { user: INITIAL_USER_ADMIN, label: 'Platform Administrator', icon: <Shield className="w-4 h-4 text-brand-blue-500" /> },
                  ].map(({ user, label, icon }) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => handleQuickLogin(user.id)}
                      className="w-full text-left p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-brand-green-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">{user.fullName}</span>
                        <span className="text-slate-500 ml-1.5">({label})</span>
                      </div>
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <p className="text-center text-sm text-slate-500 dark:text-slate-400">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="font-semibold text-brand-blue-700 dark:text-brand-green-400 hover:underline">
                Create one free
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
