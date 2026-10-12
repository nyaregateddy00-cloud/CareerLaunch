import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Briefcase, ArrowRight, Chrome } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card } from '../../components/common/Card';
import { isSupabaseConfigured } from '../../lib/supabase';
import { BrandLogo } from '../../components/branding/BrandLogo';

export const RegisterPage: React.FC = () => {
  const { signup, signInWithGoogle, isLoading, authError, authNotice } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [password, setPassword] = useState('');
  const [headline, setHeadline] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) return;
    const ok = await signup(fullName, email, password, role, headline);
    if (ok) {
      navigate('/dashboard');
    }
  };

  const handleGoogleSignup = async () => { await signInWithGoogle(); };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <BrandLogo variant="full" className="mb-4" imageClassName="w-24 sm:w-28" />
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Create your CareerLaunch profile
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          “Build Your Skills. Launch Your Career.”
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Card className="p-8 space-y-6">
          <form onSubmit={handleRegister} className="space-y-4">
            {!isSupabaseConfigured && <p className="rounded-lg bg-amber-50 dark:bg-amber-950/40 p-3 text-xs text-amber-800 dark:text-amber-200">Demo mode: profile data stays in this browser. A real account requires Supabase to be configured.</p>}
            <Input
              label="Full Name"
              required
              placeholder="e.g. Teddy Mwangi"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              leftIcon={<User className="w-4 h-4" />}
            />

            <Input
              label="Email Address"
              type="email"
              required
              placeholder="e.g. student@uonbi.ac.ke"
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
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue-500"
              >
                <option value="student">University / College Student</option>
                <option value="graduate">Recent Graduate (0-2 yrs)</option>
                <option value="job_seeker">Active Job Seeker</option>
                <option value="freelancer">Freelancer / Independent Contractor</option>
                <option value="career_changer">Career Changer</option>
              </select>
            </div>

            <Input
              label="Professional Headline / Target Role"
              placeholder="e.g. Aspiring Full-Stack Software Engineer"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              leftIcon={<Briefcase className="w-4 h-4" />}
            />

            <Input
              label="Password"
              type="password"
              required
              minLength={8}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <div className="text-[11px] text-slate-500">
              By creating an account, you agree to our Terms of Service and Privacy Policy.
            </div>

            <Button
              type="submit"
              variant="accent"
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Launch My Account
            </Button>
          </form>

          <Button type="button" variant="secondary" className="w-full" isLoading={isLoading} onClick={handleGoogleSignup} leftIcon={<Chrome className="w-4 h-4" />}>
            Sign up with Google
          </Button>
          {isSupabaseConfigured && <p className="text-center text-[11px] text-slate-500">Google accounts start with the Job Seeker role. You can complete your career profile after signing in.</p>}

          {authError && <p role="alert" className="text-sm text-rose-600 dark:text-rose-400">{authError}</p>}
          {authNotice && <p role="status" className="text-sm text-emerald-700 dark:text-emerald-400">{authNotice}</p>}

          <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-brand-blue-700 dark:text-brand-green-400 hover:underline">
              Sign in
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

