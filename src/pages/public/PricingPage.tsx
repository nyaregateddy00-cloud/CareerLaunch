import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, Zap, Shield, Sparkles } from 'lucide-react';
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
      description: 'Everything essential for university students and early job seekers.',
      priceKes: '0',
      priceUsd: '0',
      period: 'forever',
      features: [
        'Full access to verified opportunity discovery',
        'Standard CV Builder with PDF download',
        'Public shareable portfolio (careerlaunch.co.ke/u/...)',
        'Kanban application tracker (up to 25 applications)',
        'Basic Skill Gap analysis',
        'Access to all public career playbooks & NITA guides',
      ],
      cta: 'Get Started Free',
      ctaVariant: 'secondary' as const,
      popular: false,
    },
    {
      name: 'Career Accelerator Pro',
      badge: 'Most Popular',
      description: 'Supercharge your job search with AI assistance and ATS optimization.',
      priceKes: billingCycle === 'monthly' ? '950' : '750',
      priceUsd: billingCycle === 'monthly' ? '8' : '6',
      period: billingCycle === 'monthly' ? '/ month' : '/ month, billed yearly',
      features: [
        'Everything in Free Campus Starter',
        'Unlimited CareerLaunch AI prompts & CV polish',
        'AI cover letter generator for African companies',
        'All 3 premium CV templates with unlimited PDF exports',
        'Interactive tech & behavioral interview simulation',
        'Unlimited Kanban application tracking',
        'Priority opportunity alerts via SMS & Email',
      ],
      cta: 'Start 14-Day Free Trial',
      ctaVariant: 'accent' as const,
      popular: true,
    },
    {
      name: 'University & Enterprise',
      badge: 'Institutions & Hubs',
      description: 'For university career offices, bootcamps, and hiring employers.',
      priceKes: 'Custom',
      priceUsd: 'Custom',
      period: 'tailored cohorts',
      features: [
        'Bulk student onboarding & NITA attachment tracking',
        'Institutional analytics dashboard & placement rates',
        'Direct employer job board posting & ATS integration',
        'Dedicated talent partnership manager in Nairobi',
        'Custom verified badges for accredited alumni',
      ],
      cta: 'Contact Partnerships',
      ctaVariant: 'primary' as const,
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 dark:bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 flex-1 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="green" size="md">Transparent African Pricing</Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Simple, Transparent Plans for Every Stage
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Start for free during campus, scale up as you land high-paying roles. M-Pesa, card, and PayPal supported.
          </p>

          {/* Monthly / Annual toggle */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-brand-blue-900 dark:bg-brand-blue-600 text-white'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                billingCycle === 'annual'
                  ? 'bg-brand-blue-900 dark:bg-brand-blue-600 text-white'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-brand-green-100 text-brand-green-800 dark:bg-brand-green-950 dark:text-brand-green-300">
                Save 25%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((p, idx) => (
            <Card
              key={idx}
              className={`flex flex-col justify-between p-8 relative ${
                p.popular
                  ? 'border-2 border-brand-green-500 shadow-xl dark:border-brand-green-500'
                  : ''
              }`}
            >
              {p.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-brand-green-500 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                    Most Recommended
                  </span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{p.name}</h3>
                  <Badge variant={p.popular ? 'green' : 'default'} size="sm">{p.badge}</Badge>
                </div>
                <p className="text-xs text-slate-500 min-h-[32px] mb-6">{p.description}</p>

                <div className="mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                      KES {p.priceKes}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      ({p.priceUsd === 'Custom' ? 'Custom' : `$${p.priceUsd} USD`}) {p.period}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    What's Included:
                  </span>
                  {p.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                      <Check className="w-4 h-4 text-brand-green-500 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Link to="/register" className="w-full block">
                  <Button variant={p.ctaVariant} size="md" className="w-full">
                    {p.cta}
                  </Button>
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

