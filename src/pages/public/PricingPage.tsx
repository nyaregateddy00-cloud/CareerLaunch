import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Footer } from '../../components/layout/Footer';

export const PricingPage: React.FC = () => {
  const plans = [
    {
      name: 'Free Campus Starter',
      badge: 'Current tools',
      description: 'Tools available in the current CareerLaunch deployment.',
      price: 'Included in preview',
      period: 'No paid tier',
      features: [
        'Browse published opportunity listings and check each source',
        'Profile, skills, education, and experience workspace',
        'CV builder with browser print-to-PDF',
        'Portfolio builder with section-by-section visibility settings',
        'Application tracker and saved opportunities',
        'Learning progress for published career resources',
      ],
      cta: 'Create an account',
      ctaVariant: 'secondary' as const,
      popular: false,
    },
    {
      name: 'Career Accelerator Pro',
      badge: 'Concept preview',
      description: 'A possible paid feature set; subscriptions and entitlements are not implemented.',
      price: 'KES 950',
      period: 'Illustrative only',
      features: [
        'AI career advice when server-side provider settings are configured',
        'AI feedback for interview practice when configured',
        'Career roadmap and account activity snapshot',
        'Personalized application-material feedback using facts you provide',
      ],
      cta: 'Explore available tools',
      ctaVariant: 'accent' as const,
      popular: true,
    },
    {
      name: 'University & Enterprise',
      badge: 'Future concept',
      description: 'Institution and recruiter tools are not available in this deployment.',
      price: 'Not offered',
      period: 'not available',
      features: ['No institution or recruiter subscription is currently offered.'],
      cta: 'View product features',
      ctaVariant: 'primary' as const,
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 dark:bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 flex-1 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="green" size="md">Plan preview</Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            CareerLaunch plan concepts
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Only the current tools are available. Paid plans, billing, subscriptions, and institutional services are not enabled in this deployment.
          </p>
          <p role="note" className="mx-auto max-w-xl rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
            Pricing and paid-plan features shown here are illustrative only. No payment will be taken through this page.
          </p>

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
                      {p.price}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      {p.period}
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
                <Link to={p.name === 'Free Campus Starter' ? '/register' : '/features'} className="w-full block">
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

