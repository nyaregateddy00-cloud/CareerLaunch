import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Rocket, User, Mail, Lock, Briefcase, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card } from '../../components/common/Card';

export const RegisterPage: React.FC = () => {
  const { signup, isLoading } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [password, setPassword] = useState('');
  const [headline, setHeadline] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) return;
    const ok = await signup(fullName, email, role, headline);
    if (ok) {
      navigate('/dashboard');
    }
  };

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
          Create your CareerLaunch profile
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          “Build Your Skills. Launch Your Career.”
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Card className="p-8 space-y-6">
          <form onSubmit={handleRegister} className="space-y-4">
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

