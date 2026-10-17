import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Briefcase, ArrowRight, Chrome, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card } from '../../components/common/Card';
import { isSupabaseConfigured } from '../../lib/supabase';
import { BrandLogo } from '../../components/branding/BrandLogo';

const roleOptions: { value: UserRole; label: string }[] = [
  { value: 'student', label: 'University / College Student' },
  { value: 'graduate', label: 'Recent Graduate (0-2 yrs)' },
  { value: 'job_seeker', label: 'Active Job Seeker' },
  { value: 'freelancer', label: 'Freelancer / Independent Contractor' },
  { value: 'career_changer', label: 'Career Changer' },
];

export const RegisterPage: React.FC = () => {
  const { signup, signInWithGoogle, isLoading, authError, authNotice } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [headline, setHeadline] = useState('');
  const [registered, setRegistered] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !password) return;
    const ok = await signup(fullName.trim(), email.trim(), password, role, headline.trim());
    if (ok) {
      if (isSupabaseConfigured) {
        // Supabase requires email confirmation — show success state instead of navigating
        setRegistered(true);
      } else {
        navigate('/dashboard');
      }
    }
  };

  const handleGoogleSignup = async () => {
    await signInWithGoogle();
  };

  // Show email confirmation screen after successful registration
  if (registered) {
    return (
      <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50 dark:bg-black">
        <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
          <Card className="p-10 text-center shadow-hero dark:bg-[#111111]">
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 rounded-full bg-brand-green-50 dark:bg-brand-green-950/40 flex items-center justify-center border border-brand-green-200 dark:border-brand-green-800">
                <CheckCircle2 className="w-8 h-8 text-brand-green-600 dark:text-brand-green-400" />
              </div>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
              Account created!
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
              A confirmation link has been sent to
            </p>
            <p className="text-sm font-semibold text-brand-blue-700 dark:text-brand-blue-400 mb-6">
              {email}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-8">
              Click the link in your email to verify your account, then sign in below. Check your spam folder if you don&apos;t see it within a few minutes.
            </p>
            <Link to="/login">
              <Button variant="primary" size="lg" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Go to Sign In
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50 dark:bg-black">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <BrandLogo variant="full" className="mb-6 justify-center" imageClassName="w-24 sm:w-28" />
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Create your free account
        </h1>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
          Build Your Skills. Launch Your Career.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Card className="p-8 shadow-hero dark:bg-[#111111]">
          <div className="space-y-5">

            {/* Error Banner */}
            {authError && (
              <div role="alert" className="rounded-xl bg-rose-50 dark:bg-rose-950/40 p-4 text-sm text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-800/50">
                <p className="font-semibold">Registration failed</p>
                <p className="text-xs mt-0.5 opacity-90">{authError}</p>
              </div>
            )}

            {/* Success notice */}
            {authNotice && !registered && (
              <div role="status" className="rounded-xl bg-emerald-50 dark:bg-emerald-950/40 p-4 text-sm text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800/50">
                <p>{authNotice}</p>
              </div>
            )}

            {/* Google Sign-Up — primary for quick onboarding */}
            <Button
              type="button"
              variant="secondary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
              onClick={handleGoogleSignup}
              leftIcon={<Chrome className="w-4 h-4" />}
            >
              Sign up with Google
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-white/[0.08]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-[#111111] px-3 text-slate-400 font-semibold tracking-wider">
                  or register with email
                </span>
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleRegister} className="space-y-4">
              {!isSupabaseConfigured && (
                <p className="rounded-lg bg-amber-50 dark:bg-amber-950/40 p-3 text-xs text-amber-800 dark:text-amber-200">
                  Preview mode: profile data stays in this browser only.
                </p>
              )}

              <Input
                label="Full Name"
                required
                autoComplete="name"
                placeholder="e.g. Amina Wanjiku"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                leftIcon={<User className="w-4 h-4" />}
              />

              <Input
                label="Email Address"
                type="email"
                required
                autoComplete="email"
                placeholder="e.g. amina@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  I am primarily a:
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0f0f0f] px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue-500"
                >
                  {roleOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <Input
                label="Professional Headline (optional)"
                placeholder="e.g. Aspiring Software Engineer · University of Nairobi"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                leftIcon={<Briefcase className="w-4 h-4" />}
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    minLength={8}
                    placeholder="Minimum 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              <p className="text-[11px] text-slate-500 leading-relaxed">
                By creating an account you agree to our{' '}
                <Link to="/about" className="underline hover:text-slate-700 dark:hover:text-slate-300">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/about" className="underline hover:text-slate-700 dark:hover:text-slate-300">Privacy Policy</Link>.
              </p>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isLoading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Create My Account
              </Button>
            </form>

            {/* Footer */}
            <p className="text-center text-sm text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-brand-blue-700 dark:text-brand-green-400 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
