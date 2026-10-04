import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Rocket,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  FileText,
  Globe,
  Briefcase,
  Search,
  Bot,
  Kanban,
  GraduationCap,
  Building2,
  ChevronDown,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Star,
  Users
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { OpportunityCard } from '../../components/opportunities/OpportunityCard';
import { OpportunityDetailModal } from '../../components/opportunities/OpportunityDetailModal';
import { mockStorage } from '../../lib/mockStorage';
import { Opportunity } from '../../types';
import { Footer } from '../../components/layout/Footer';

export const LandingPage: React.FC = () => {
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [savedOppIds, setSavedOppIds] = useState<string[]>(() => mockStorage.getSavedOpportunityIds());
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const opportunities = mockStorage.getOpportunities().slice(0, 4);

  const handleToggleSave = (id: string) => {
    mockStorage.toggleSaveOpportunity(id);
    setSavedOppIds(mockStorage.getSavedOpportunityIds());
  };

  const steps = [
    {
      number: '01',
      title: 'Learn & Upskill',
      description: 'Explore career resources, attachment guidance, and interview preparation.',
    },
    {
      number: '02',
      title: 'Map Your Skills',
      description: 'Record your skills and identify areas to develop for your target roles.',
    },
    {
      number: '03',
      title: 'Craft CV & Portfolio',
      description: 'Create a structured CV and organize projects into a portfolio.',
    },
    {
      number: '04',
      title: 'Discover & Apply',
      description: 'Browse jobs, internships, attachments, scholarships, and freelance listings.',
    },
    {
      number: '05',
      title: 'Track & Grow',
      description: 'Track application stages and plan the next step in your career journey.',
    },
  ];

  const tools = [
    {
      icon: FileText,
      title: 'Interactive CV Builder',
      desc: 'Build a structured CV and use the browser print dialog to save a PDF.',
      link: '/cv-builder',
      badge: 'Popular',
    },
    {
      icon: Globe,
      title: 'Shareable Portfolio',
      desc: 'Organize your projects and profile details into a portfolio preview.',
      link: '/portfolio-builder',
      badge: 'Portfolio',
    },
    {
      icon: Search,
      title: 'Opportunity Engine',
      desc: 'Browse the opportunity catalog. Confirm deadlines and application details with the original source.',
      link: '/opportunities',
      badge: 'Catalog',
    },
    {
      icon: Kanban,
      title: 'Kanban Application Tracker',
      desc: 'Move cards seamlessly from Saved to Applied, Interview, and Offer. Never miss a submission deadline again.',
      link: '/applications',
      badge: 'Organized',
    },
    {
      icon: Sparkles,
      title: 'Skill Gap Analyzer',
      desc: 'Record skills and explore learning areas for roles you are interested in.',
      link: '/skills',
      badge: 'Skills',
    },
    {
      icon: Bot,
      title: 'CareerLaunch AI',
      desc: 'Open the assistant area to see the tools available in this deployment.',
      link: '/ai-assistant',
      badge: 'Assistant',
    },
  ];

  const faqs = [
    {
      q: "Can I try CareerLaunch?",
      a: "You can explore public pages and create a profile. Available account features depend on the current deployment configuration."
    },
    {
      q: "How does the industrial attachment support work for Kenyan university students?",
      a: "The catalog may include attachment listings and guidance. Check each listing source for current requirements, accreditation, deadlines, and application instructions."
    },
    {
      q: "Can I download my CV as a PDF?",
      a: "The CV builder provides a print view. Use your browser’s print dialog to save or print the CV; output can vary by browser."
    },
    {
      q: "What makes CareerLaunch different from generic job boards?",
      a: "CareerLaunch brings profile building, career resources, CV and portfolio tools, opportunity browsing, and application tracking together. Confirm listing details with the original source."
    },
    {
      q: "How does CareerLaunch AI assist with my applications?",
      a: "AI features depend on a configured provider service. Availability can differ between deployments; review the assistant page to see what is enabled."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        {/* Subtle decorative background blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-brand-blue-50/60 dark:from-brand-blue-950/20 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Tag Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-brand-green-50 dark:bg-brand-green-950/60 text-brand-green-700 dark:text-brand-green-300 border border-brand-green-200 dark:border-brand-green-800 shadow-sm mb-6 animate-in fade-in slide-in-from-top-3">
            <span className="w-2 h-2 rounded-full bg-brand-green-500 animate-ping"></span>
            <span>🇰🇪 Launching African Tech & Professional Careers</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-950 dark:text-white max-w-4xl mx-auto leading-[1.1]">
            Build Your Skills.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue-900 via-brand-blue-700 to-brand-green-500 dark:from-white dark:via-brand-blue-300 dark:to-brand-green-400">
              Launch Your Career.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            A practical workspace for students, graduates, freelancers, and job seekers building their next career step.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <Link to="/register" className="w-full sm:w-auto">
              <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-5 h-5" />} className="w-full">
                Create a Profile
              </Button>
            </Link>
            <Link to="/opportunities" className="w-full sm:w-auto">
              <Button size="lg" variant="secondary" leftIcon={<Search className="w-5 h-5" />} className="w-full">
                Explore Opportunities
              </Button>
            </Link>
          </div>

          {/* Product capabilities instead of unverified popularity claims */}
          <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-5 max-w-4xl mx-auto text-left">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300"><FileText className="w-4 h-4 text-brand-green-600" />CV builder</div>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300"><Sparkles className="w-4 h-4 text-brand-green-600" />Skills profile</div>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300"><Search className="w-4 h-4 text-brand-green-600" />Opportunity catalog</div>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300"><Briefcase className="w-4 h-4 text-brand-green-600" />Application tracker</div>
          </div>\n        </div>\n      </section>

      {/* How CareerLaunch Works Section */}
      <section className="py-20 bg-slate-50/60 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-brand-green-600 dark:text-brand-green-400 mb-2">
              The Career Trajectory
            </h2>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              How CareerLaunch Works
            </h3>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              A continuous flywheel moving you from learning directly to high-impact career growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 lg:gap-6">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-card hover:shadow-md transition-all relative flex flex-col justify-between"
              >
                <div>
                  <div className="text-3xl font-black text-slate-200 dark:text-slate-800 mb-3">
                    {step.number}
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    {step.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Career Tools Showcase */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-brand-green-600 dark:text-brand-green-400 mb-2">
              Integrated Suite
            </h2>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Purpose-Built Career Tools
            </h3>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              Tools to organize your profile, application materials, and opportunity search.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool, idx) => (
              <Card key={idx} hoverEffect className="flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-blue-50 dark:bg-brand-blue-950 text-brand-blue-700 dark:text-brand-blue-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <tool.icon className="w-6 h-6" />
                    </div>
                    <Badge variant="green" size="sm">{tool.badge}</Badge>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {tool.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                    {tool.desc}
                  </p>
                </div>

                <Link
                  to={tool.link}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue-700 dark:text-brand-green-400 group-hover:translate-x-1 transition-transform"
                >
                  Explore Tool <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Opportunity Discovery Preview */}
      <section className="py-20 bg-slate-50/60 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-brand-green-600 dark:text-brand-green-400 mb-2">
                Featured Opportunities
              </h2>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Explore Opportunities in Kenya & Africa
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Catalog preview. Confirm deadlines and application details with the original listing source.
              </p>
              <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-2">Some entries are sample data for preview and have not been independently verified.</p>
            </div>

            <Link to="/opportunities">
              <Button variant="secondary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Browse Opportunities ({mockStorage.getOpportunities().length})
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {opportunities.map((opp) => (
              <OpportunityCard
                key={opp.id}
                opportunity={opp}
                isSaved={savedOppIds.includes(opp.id)}
                onToggleSave={handleToggleSave}
                onSelect={(o) => setSelectedOpp(o)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Product workspace preview */}
      <section className="py-20 bg-slate-50/60 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 sm:p-10">
            <div className="max-w-2xl">
              <h2 className="text-xs font-bold uppercase tracking-wider text-brand-green-600 dark:text-brand-green-400 mb-2">A practical workspace</h2>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Keep your next career steps in one place</h3>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">Build your profile, prepare application materials, explore the catalog, and track the roles you apply to. Check opportunity details with the original source before applying.</p>
              <Link to="/register" className="inline-flex mt-6"><Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>Create a profile</Button></Link>
            </div>
          </Card>
        </div>
      </section>
      {/* FAQ Accordion */}
      <section className="py-20 bg-slate-50/60 dark:bg-slate-900/40 border-t border-slate-200/80 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Everything you need to know about launching your career on CareerLaunch.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 font-bold text-sm text-slate-900 dark:text-white"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180 text-brand-green-500' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 bg-gradient-to-br from-brand-blue-900 via-brand-blue-950 to-slate-950 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Ready to launch your career trajectory?
          </h2>
          <p className="text-base sm:text-lg text-brand-blue-200 max-w-2xl mx-auto leading-relaxed">
            Create a profile, prepare your application materials, and keep your search organized.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" variant="accent" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Create Your Account Now
              </Button>
            </Link>
            <Link to="/opportunities">
              <Button size="lg" variant="secondary">
                Search Openings
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Detail Modal */}
      <OpportunityDetailModal
        opportunity={selectedOpp}
        isOpen={Boolean(selectedOpp)}
        onClose={() => setSelectedOpp(null)}
        isSaved={selectedOpp ? savedOppIds.includes(selectedOpp.id) : false}
        onToggleSave={handleToggleSave}
      />

      <Footer />
    </div>
  );
};

