import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Rocket, Lock, Mail, ArrowRight, UserCheck, Shield, Chrome } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card } from '../../components/common/Card';
import { INITIAL_USER_TEDDY, INITIAL_USER_AMINA, INITIAL_USER_ADMIN } from '../../lib/mockData';
import { isSupabaseConfigured } from '../../lib/supabase';

export const LoginPage: React.FC = () => {
  const { login, signInWithGoogle, switchUser, isLoading, authError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const ok = await login(email, password);
    if (ok) {
      navigate('/dashboard');
    }
  };

  const handleQuickLogin = (userId: string) => {
    switchUser(userId);
    navigate('/dashboard');
  };

  const handleGoogleLogin = async () => { await signInWithGoogle(); };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-xl bg-brand-blue-900 dark:bg-brand-blue-600 flex items-center justify-center text-white shadow-md">
            <Rocket className="w-5 h-5 text-brand-green-400" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-brand-blue-900 dark:text-white">
            Career<span className="text-brand-green-500">Launch</span>
          </span>
        </Link>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Sign in to your account
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Build your skills, manage your CV, and accelerate your career.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Card className="p-8 space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            {!isSupabaseConfigured && <p className="rounded-lg bg-amber-50 dark:bg-amber-950/40 p-3 text-xs text-amber-800 dark:text-amber-200">Demo mode: signing in with an email opens a local sample account. The password is not checked or stored.</p>}
            <Input
              label="Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
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
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                leftIcon={<Lock className="w-4 h-4" />}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In
            </Button>
          </form>

          <Button type="button" variant="secondary" className="w-full" isLoading={isLoading} onClick={handleGoogleLogin} leftIcon={<Chrome className="w-4 h-4" />}>
            Continue with Google
          </Button>

          {authError && <p role="alert" className="text-sm text-rose-600 dark:text-rose-400">{authError}</p>}

          {/* Quick Demo Personas Login Buttons */}
          {!isSupabaseConfigured && <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center mb-2">
              Demo profiles (local preview)
            </p>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin(INITIAL_USER_TEDDY.id)}
                className="w-full text-left p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-brand-green-500 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">Teddy Mwangi</span>
                  <span className="text-slate-500 ml-1.5">(CS Graduate / Job Seeker)</span>
                </div>
                <UserCheck className="w-4 h-4 text-brand-green-500" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin(INITIAL_USER_AMINA.id)}
                className="w-full text-left p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-brand-green-500 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">Amina Wanjiku</span>
                  <span className="text-slate-500 ml-1.5">(UI/UX Designer / Freelancer)</span>
                </div>
                <UserCheck className="w-4 h-4 text-brand-green-500" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin(INITIAL_USER_ADMIN.id)}
                className="w-full text-left p-2.5 rounded-xl border border-brand-blue-200 dark:border-brand-blue-800 bg-brand-blue-50/50 dark:bg-brand-blue-950/40 hover:bg-brand-blue-100 transition-all flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-brand-blue-900 dark:text-brand-blue-300">Sarah Kipchoge</span>
                  <span className="text-slate-500 ml-1.5">(Platform Administrator)</span>
                </div>
                <Shield className="w-4 h-4 text-brand-blue-600 dark:text-brand-blue-400" />
              </button>
            </div>
          </div>}

          <div className="text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-brand-blue-700 dark:text-brand-green-400 hover:underline">
              Create an account free
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

