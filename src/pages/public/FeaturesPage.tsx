import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Globe,
  Search,
  Kanban,
  Sparkles,
  Bot,
  ArrowRight,
  CheckCircle2,
  Lock,
  Zap,
  Smartphone
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Footer } from '../../components/layout/Footer';
import { CareerPhoto } from '../../components/landing/CareerPhoto';
import { careerPhotos } from '../../components/landing/careerPhotos';

export const FeaturesPage: React.FC = () => {
  const features = [
    {
      title: 'Interactive CV Builder',
      subtitle: 'Structured CVs with a print view',
      desc: 'Add your career details to a CV layout and preview the result. Use your browser print dialog to save a PDF.',
      points: [
        'Multi-template switching (Modern Nairobi, Executive ATS, Clean Minimal)',
        'Edit profile, skills, projects, education, and experience',
        'Print-friendly CV preview',
        'Integrated skills and project highlights',
      ],
      icon: FileText,
      link: '/cv-builder',
      photo: careerPhotos.southAfricaRemoteWork,
    },
    {
      title: 'Shareable Portfolio Engine',
      subtitle: 'Organize and preview your work',
      desc: 'Create a portfolio profile and preview it on the domain where CareerLaunch is deployed.',
      points: [
        'Shareable route on the current deployment',
        'Direct "Hire Me" contact integration',
        'Featured projects showcase with responsive imagery and live demo links',
        'Mobile-optimized for smartphone-first recruiters',
      ],
      icon: Globe,
      link: '/portfolio-builder',
    },
    {
      title: 'Opportunity Discovery Engine',
      subtitle: 'Browse the opportunity catalog',
      desc: 'Explore job, internship, attachment, scholarship, and freelance listings. Verify deadlines, pay, and requirements with the original source.',
      points: [
        'Filter by location, work mode, experience, and opportunity type',
        'Transparent salary and stipend data in KES and USD',
        'One-click bookmarking and application tracking',
        'Listings may be sample data and are not independently verified',
      ],
      icon: Search,
      link: '/opportunities',
      photo: careerPhotos.kenyaDigitalLearning,
    },
    {
      title: 'Kanban Application Tracker',
      subtitle: 'Master Every Stage of Your Pipeline',
      desc: 'Stop losing track of jobs in spreadsheet chaos. Manage your applications through visual stages: Saved → Applied → Shortlisted → Interview → Offer → Rejected.',
      points: [
        'Visual drag & drop and quick stage transitions',
        'Interview date reminders and preparation notes',
        'Direct tracking from discovered platform opportunities',
        'Conversion rate statistics and pipeline metrics',
      ],
      icon: Kanban,
      link: '/applications',
    },
    {
      title: 'Skills & Role Gap Analyzer',
      subtitle: 'Explore skills for roles you are considering',
      desc: 'Review your skills against sample role profiles. These examples are not connected to live employer job specifications.',
      points: [
        'Dynamic Match Score percentage for target career roles',
        'Identifies missing high-priority and medium-priority skills',
        'Curated resource recommendations for every identified gap',
        'Organized skill categorization and proficiency ratings',
      ],
      icon: Sparkles,
      link: '/skills',
      photo: careerPhotos.nigeriaProfessional,
    },
    {
      title: 'CareerLaunch AI',
      subtitle: 'Assistant interface',
      desc: 'Assistant responses require a configured AI service. Availability depends on the current deployment.',
      points: [
        'Open the assistant interface from your dashboard',
        'AI functionality must be configured by the deployment operator',
      ],
      icon: Bot,
      link: '/ai-assistant',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 dark:bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 flex-1 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-blue-50 dark:bg-brand-blue-950 text-brand-blue-700 dark:text-brand-blue-300 border border-brand-blue-200 dark:border-brand-blue-800">
            <span>Platform Capabilities</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            Career Tools for Your Next Step
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Explore the tools available to organize your profile, career materials, opportunity search, and applications.
          </p>
        </div>

        <div className="space-y-12">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-12 p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card ${
                idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className="flex-1 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-blue-50 dark:bg-brand-blue-950 text-brand-blue-700 dark:text-brand-blue-300 flex items-center justify-center">
                  <feat.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{feat.title}</h3>
                  <p className="text-sm font-semibold text-brand-green-600 dark:text-brand-green-400 mt-0.5">{feat.subtitle}</p>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{feat.desc}</p>
                <div className="space-y-2 pt-2">
                  {feat.points.map((pt, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-brand-green-500 flex-shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4">
                  <Link to={feat.link}>
                    <Button variant="accent" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                      Try {feat.title}
                    </Button>
                  </Link>
                </div>
              </div>

              {feat.photo ? (
                <CareerPhoto photo={feat.photo} className="w-full lg:w-5/12" sizes="(max-width: 1024px) 100vw, 40vw" />
              ) : (
                <div className="w-full lg:w-5/12 bg-slate-100 dark:bg-slate-800/60 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700 flex flex-col items-center justify-center text-center min-h-[220px]">
                  <feat.icon className="w-16 h-16 text-brand-blue-900 dark:text-brand-blue-400 opacity-60 mb-3" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Live Feature in CareerLaunch</span>
                  <span className="text-xs text-slate-400 mt-1">Ready for instant use without complex setups</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

