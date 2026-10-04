import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Rocket } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card } from '../../components/common/Card';

export const ResetPasswordPage: React.FC = () => {
  const { completePasswordReset, isLoading, authError, authNotice } = useAuth();
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (await completePasswordReset(password)) navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-xl bg-brand-blue-900 dark:bg-brand-blue-600 flex items-center justify-center text-white shadow-md"><Rocket className="w-5 h-5 text-brand-green-400" /></div>
          <span className="text-2xl font-extrabold tracking-tight text-brand-blue-900 dark:text-white">Career<span className="text-brand-green-500">Launch</span></span>
        </Link>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Choose a new password</h1>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="New password" type="password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" leftIcon={<Lock className="w-4 h-4" />} />
            {authError && <p role="alert" className="text-sm text-rose-600">{authError}</p>}
            {authNotice && <p role="status" className="text-sm text-emerald-700">{authNotice}</p>}
            <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>Update password</Button>
            <Link to="/login" className="flex justify-center items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"><ArrowLeft className="w-3.5 h-3.5" />Back to sign in</Link>
          </form>
        </Card>
      </div>
    </div>
  );
};
