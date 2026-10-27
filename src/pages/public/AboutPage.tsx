import React from 'react';
import { Target, Shield, Globe, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Footer } from '../../components/layout/Footer';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-slate-900 dark:text-[#f8fafc]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 flex-1 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-green-50 dark:bg-brand-green-950/60 text-brand-green-800 dark:text-brand-green-300 border border-brand-green-200 dark:border-brand-green-800/60">
            <span>Our Mission &amp; Purpose</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-950 dark:text-white">
            Built for Africa. <span className="font-serif italic font-normal text-brand-green-700 dark:text-brand-green-400">Designed for Opportunity.</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            CareerLaunch helps people build skills, create stronger career profiles, discover opportunities, and connect with employers across Kenya and the African continent.
          </p>
        </div>

        {/* Vision Statement Card */}
        <div className="bg-brand-blue-900 text-white rounded-2xl p-8 sm:p-10 shadow-sm relative overflow-hidden dark:bg-[#0c1a30] dark:border dark:border-white/10">
          <div className="relative z-10 max-w-2xl space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Bridging the Early-Career Transition</h2>
            <p className="text-sm sm:text-base text-brand-blue-100 dark:text-slate-300 leading-relaxed">
              Every year, millions of ambitious young Africans graduate from universities and technical colleges. Many face fragmented job listings, unformatted CVs, a lack of practical project showcases, and unclear attachment requirements.
            </p>
            <p className="text-sm sm:text-base text-brand-blue-100 dark:text-slate-300 leading-relaxed">
              CareerLaunch brings together structured CV building, portfolio presentation, skill gap identification, and opportunity tracking in a single, focused workspace.
            </p>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-brand-blue-50 dark:bg-white/[0.06] text-brand-blue-700 dark:text-brand-blue-300 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Demonstrated Capability</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              We focus on tangible projects, documented skills, and clear achievements rather than abstract claims.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-brand-green-700 dark:text-brand-green-300 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Transparent Listings</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Opportunities provide clear expectations, location requirements, and application instructions with zero hidden fees.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-300 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Regional &amp; Remote Scope</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Anchored in Kenya's thriving tech ecosystem, connecting talent to opportunities across East, West, and Southern Africa.
            </p>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center pt-6">
          <Link to="/register">
            <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Create Your Career Profile
            </Button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};
