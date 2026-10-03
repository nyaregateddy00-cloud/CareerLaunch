import React from 'react';
import { Rocket, Target, Shield, Users, Globe, ArrowRight, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Footer } from '../../components/layout/Footer';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 dark:bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 flex-1 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-green-50 dark:bg-brand-green-950 text-brand-green-700 dark:text-brand-green-300 border border-brand-green-200 dark:border-brand-green-800">
            <span>Our Mission & Vision</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            Empowering the Next Generation of African Talent
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            CareerLaunch was founded to bridge the critical transition gap between university education and meaningful, high-growth employment in Africa’s digital economy.
          </p>
        </div>

        {/* Vision Statement Card */}
        <div className="bg-brand-blue-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold">The Problem We Are Solving</h2>
            <p className="text-sm sm:text-base text-brand-blue-200 leading-relaxed">
              Every year, over 10 million young Africans enter the labor market. In Kenya alone, hundreds of thousands of university and TVET graduates struggle with fragmented job postings, generic unoptimized CVs, lack of portfolio guidance, and outdated attachment protocols.
            </p>
            <p className="text-sm sm:text-base text-brand-blue-200 leading-relaxed">
              CareerLaunch provides an integrated, AI-guided career tech engine that equips candidates with proof-of-work portfolios, skill gap intelligence, and direct connections to vetted employers across Nairobi, Kigali, Lagos, and remote global markets.
            </p>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-brand-blue-50 dark:bg-brand-blue-950 text-brand-blue-700 dark:text-brand-blue-300 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Proof of Work Over Paper</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              We champion working prototypes, live links, and verified technical competencies rather than static paper credentials.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-brand-green-50 dark:bg-brand-green-950 text-brand-green-700 dark:text-brand-green-300 flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Transparent & Vetted</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Every attachment, internship, and job listed on our platform is verified with clear compensation, responsibilities, and zero application fees.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Pan-African & Global Reach</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Starting with Kenya's vibrant tech ecosystem, we expand opportunities across East, West, and Southern Africa, including high-paying remote roles.
            </p>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center pt-8">
          <Link to="/register">
            <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Join the CareerLaunch Movement
            </Button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

