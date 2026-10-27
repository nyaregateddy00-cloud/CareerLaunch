import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Footer } from '../../components/layout/Footer';

export const PricingPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const plans = [
    {
      name: 'Free Campus Starter',
      badge: 'Always Free',
      description: 'Essential career tools for university students and early job seekers.',
      priceKes: '0',
      priceUsd: '0',
      period: 'forever',
      features: [
        'Full access to opportunity discovery & filters',
        'Standard CV Builder with print & PDF export',
        'Public shareable portfolio page',
        'Kanban application tracker (up to 25 applications)',
        'Basic Skill Gap analysis against market benchmarks',
        'Access to African career playbooks & attachment guides',
      ],
      cta: 'Get Started Free',
      ctaVariant: 'secondary' as const,
      popular: false,
    },
    {
      name: 'Career Accelerator Pro',
      badge: 'Most Popular',
      description: 'Comprehensive toolkit with AI-assisted reviews and expanded tracking.',
      priceKes: billingCycle === 'monthly' ? '950' : '750',
      priceUsd: billingCycle === 'monthly' ? '8' : '6',
      period: billingCycle === 'monthly' ? '/ month' : '/ month, billed yearly',
      features: [
        'Everything in Free Campus Starter',
        'CareerLaunch AI career guidance & interview simulations',
        'AI cover letter drafting & CV phrasing refinement',
        'All 3 professionally designed CV templates',
        'Unlimited Kanban application tracking',
        'Priority opportunity notifications & saved filters',
      ],
      cta: 'Start 14-Day Free Trial',
      ctaVariant: 'accent' as const,
      popular: true,
    },
    {
      name: 'University & Enterprise',
      badge: 'Institutions',
      description: 'For university career offices, TVET colleges, and hiring partners.',
      priceKes: 'Custom',
      priceUsd: 'Custom',
      period: 'tailored cohorts',
      features: [
        'Cohort student onboarding & attachment tracking',
        'Institutional placement rates and reporting',
        'Direct employer opportunity posting',
        'Dedicated talent partnership manager in Nairobi',
        'Custom verified institution badges for alumni',
      ],
      cta: 'Contact Partnerships',
      ctaVariant: 'primary' as const,
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-slate-900 dark:text-[#f8fafc]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 flex-1 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="green" size="md">Transparent African Pricing</Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Simple, Accessible Plans for Every Stage
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Compare the current plan preview. Subscription checkout and payment processing are not active in this preview deployment.
          </p>

          {/* Monthly / Annual toggle */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-brand-blue-900 dark:bg-brand-blue-700 text-white'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >Monthly Billing</button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                billingCycle === 'annual'
                  ? 'bg-brand-blue-900 dark:bg-brand-blue-700 text-white'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-green-100 text-brand-green-900 dark:bg-brand-green-950 dark:text-brand-green-300">
                Save 25%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((p, idx) => (
            <Card
              key={idx}
              className={`flex flex-col justify-between p-7 relative ${
                p.popular ? 'border-2 border-brand-green-600 dark:border-brand-green-500' : ''
              }`}
            >
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-brand-green-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                    Recommended
                  </span>
                </div>
              )}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">{p.name}</h3>
                  <Badge variant={p.popular ? 'green' : 'default'} size="sm">{p.badge}</Badge>
                </div>
                <p className="text-xs text-slate-500 min-h-[32px] mb-5">{p.description}</p>
                <div className="mb-5 pb-5 border-b border-slate-100 dark:border-white/[0.08]">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                      KES {p.priceKes}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      ({p.priceUsd === 'Custom' ? 'Custom' : `$${p.priceUsd} USD`}) {p.period}
                    </span>
                  </div>
                </div>
                <div className="space-y-2.5 mb-6">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Included features:</span>
                  {p.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <Check className="w-3.5 h-3.5 text-brand-green-600 dark:text-brand-green-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-2">
                <Link to="/register" className="w-full block">
                  <Button variant={p.ctaVariant} size="md" className="w-full">{p.cta}</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};
