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
              Students, graduates, and early-career professionals often have to piece together learning, application materials, and opportunity searches across different services. CareerLaunch brings those career-building steps into one workspace.
            </p>
            <p className="text-sm sm:text-base text-brand-blue-200 leading-relaxed">
              CareerLaunch helps people organize skills, learning, projects, CVs, portfolios, and opportunity searches. CareerLaunch AI availability depends on the deployment’s server configuration, and opportunity details should be confirmed with the original source.
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
              Add projects and links that help explain how you use your skills alongside your CV.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-brand-green-50 dark:bg-brand-green-950 text-brand-green-700 dark:text-brand-green-300 flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Clear Opportunity Details</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Browse published listings and follow the source link to confirm deadlines, requirements, compensation, and application instructions.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Pan-African & Global Reach</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              The catalog can include listings across African locations and remote roles. Availability depends on the listings currently published.
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

