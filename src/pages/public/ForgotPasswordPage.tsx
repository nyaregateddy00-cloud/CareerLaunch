import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card } from '../../components/common/Card';
import { useAuth } from '../../context/AuthContext';
import { BrandLogo } from '../../components/branding/BrandLogo';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const { resetPassword, isLoading, authError, authNotice } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    await resetPassword(email);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <BrandLogo variant="full" className="mb-4" imageClassName="w-24 sm:w-28" />
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Reset your password
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Enter your account email and we’ll send a reset link if recovery is configured.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
              />

              {authError && <p role="alert" className="text-sm text-rose-600">{authError}</p>}
              {authNotice && <p role="status" className="text-sm text-emerald-700">{authNotice}</p>}
              <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>
                Send reset link
              </Button>

              <div className="text-center pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
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

