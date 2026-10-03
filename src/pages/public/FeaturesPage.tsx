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

export const FeaturesPage: React.FC = () => {
  const features = [
    {
      title: 'Interactive CV Builder',
      subtitle: 'ATS-Proof Resumes Built in Minutes',
      desc: 'Craft structured, modern CVs formatted specifically for applicant tracking systems used by multinationals and banks across Africa. Includes 3 tailored design templates and instant PDF generation with clean print styling.',
      points: [
        'Multi-template switching (Modern Nairobi, Executive ATS, Clean Minimal)',
        'Built-in AI summary and bullet point enhancer',
        'One-click download as clean A4 PDF',
        'Integrated skills and project highlights',
      ],
      icon: FileText,
      link: '/cv-builder',
    },
    {
      title: 'Shareable Portfolio Engine',
      subtitle: 'Proof of Work on Your Own Custom URL',
      desc: 'Every user claims their personal vanity link (careerlaunch.co.ke/u/username). Showcase deployed web applications, GitHub repos, case studies, and recommendations without coding a portfolio from scratch.',
      points: [
        'Instant live URL for social media and job applications',
        'Direct "Hire Me" contact integration',
        'Featured projects showcase with responsive imagery and live demo links',
        'Mobile-optimized for smartphone-first recruiters',
      ],
      icon: Globe,
      link: '/portfolio-builder',
    },
    {
      title: 'Opportunity Discovery Engine',
      subtitle: 'Genuine African Opportunities, Zero Spam',
      desc: 'Discover verified jobs, NITA attachments, internships, scholarships, and remote freelance contracts. Filter by work mode (hybrid, remote, on-site), experience level, and verified salary ranges.',
      points: [
        'Accredited Kenyan industrial attachments with NITA clearance notes',
        'Transparent salary and stipend data in KES and USD',
        'One-click bookmarking and application tracking',
        'Verified corporate and tech hub listings',
      ],
      icon: Search,
      link: '/opportunities',
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
      subtitle: 'Know Exactly What Skills Employers Demand',
      desc: 'Benchmark your current technical and soft skills against verified job descriptions from top employers like Safaricom, Equity Group, Microsoft ADC, and Andela.',
      points: [
        'Dynamic Match Score percentage for target career roles',
        'Identifies missing high-priority and medium-priority skills',
        'Curated resource recommendations for every identified gap',
        'Organized skill categorization and proficiency ratings',
      ],
      icon: Sparkles,
      link: '/skills',
    },
    {
      title: 'CareerLaunch AI',
      subtitle: 'Your African Career Intelligence Assistant',
      desc: 'An AI assistant trained on African hiring dynamics, local interview nuances, and tech stacks. Get instant feedback on your CV summary, generate company-specific cover letters, and simulate technical interviews.',
      points: [
        'Context-aware responses tailored to Kenyan and African ecosystems',
        'Pre-built prompts for CV polish, cover letters, and interview simulations',
        'Clean modular architecture ready for custom API key integration',
        'Real-time career guidance 24/7',
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
            Complete Toolkit for Modern Career Growth
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            From your first campus attachment to high-impact international remote roles, CareerLaunch gives you every tool required to succeed.
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

              <div className="w-full lg:w-5/12 bg-slate-100 dark:bg-slate-800/60 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700 flex flex-col items-center justify-center text-center min-h-[220px]">
                <feat.icon className="w-16 h-16 text-brand-blue-900 dark:text-brand-blue-400 opacity-60 mb-3" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Live Feature in CareerLaunch</span>
                <span className="text-xs text-slate-400 mt-1">Ready for instant use without complex setups</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

