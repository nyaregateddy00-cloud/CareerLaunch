import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Mail, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card } from '../../components/common/Card';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setError('Password recovery is not connected yet. Please contact support to regain access.');
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
          Reset your password
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Password recovery is not available until account authentication is connected.
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

              {error && <p role="alert" className="text-sm text-rose-600">{error}</p>}
              <Button type="submit" variant="primary" size="lg" className="w-full">
                Check Recovery Availability
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

