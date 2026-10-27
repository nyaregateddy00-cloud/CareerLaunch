import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card } from '../../components/common/Card';
import { BrandLogo } from '../../components/branding/BrandLogo';

export const ResetPasswordPage: React.FC = () => {
  const { completePasswordReset, isLoading, authError, authNotice } = useAuth();
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (await completePasswordReset(password)) {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-white dark:bg-black text-slate-900 dark:text-[#f8fafc]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <BrandLogo variant="full" className="mb-4" imageClassName="w-24 sm:w-28" />
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">Choose a new password</h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Please enter at least 8 characters for your new password.</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Card className="p-7 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="New password"
              type="password"
              minLength={8}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
              leftIcon={<Lock className="w-4 h-4" />}
            />

            {authError && <p role="alert" className="text-xs text-rose-600 dark:text-rose-400">{authError}</p>}
            {authNotice && <p role="status" className="text-xs text-emerald-700 dark:text-emerald-400">{authNotice}</p>}

            <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>
              Update Password
            </Button>

            <div className="text-center pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Sign In
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
