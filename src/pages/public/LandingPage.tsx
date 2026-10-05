import React, { useEffect, useState } from 'react';
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
  ChevronDown,
  MapPin,
  Compass,
  Send,
  LineChart,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { OpportunityCard } from '../../components/opportunities/OpportunityCard';
import { OpportunityDetailModal } from '../../components/opportunities/OpportunityDetailModal';
import { mockStorage } from '../../lib/mockStorage';
import { getPublishedOpportunities } from '../../lib/opportunities';
import { Opportunity } from '../../types';
import { Footer } from '../../components/layout/Footer';
import { AfricaMap } from '../../components/landing/AfricaMap';
import { BrandLogo } from '../../components/branding/BrandLogo';
import { CareerPhoto } from '../../components/landing/CareerPhoto';
import { careerPhotos } from '../../components/landing/careerPhotos';

export const LandingPage: React.FC = () => {
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [savedOppIds, setSavedOppIds] = useState<string[]>(() => mockStorage.getSavedOpportunityIds());
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    let isActive = true;
    void getPublishedOpportunities()
      .then((items) => { if (isActive) setOpportunities(items.slice(0, 4)); })
      .catch(() => { if (isActive) setOpportunities([]); });
    return () => { isActive = false; };
  }, []);

  const handleToggleSave = (id: string) => {
    mockStorage.toggleSaveOpportunity(id);
    setSavedOppIds(mockStorage.getSavedOpportunityIds());
  };

  const steps = [
    {
      number: '01',
      icon: GraduationCap,
      title: 'Learning',
      description: 'Explore career resources and build knowledge for your next move.',
    },
    {
      number: '02',
      icon: Sparkles,
      title: 'Skills',
      description: 'Show what you can do and identify skills to develop further.',
    },
    {
      number: '03',
      icon: FileText,
      title: 'CV & Portfolio',
      description: 'Present your experience and projects with confidence.',
    },
    {
      number: '04',
      icon: Compass,
      title: 'Opportunities',
      description: 'Explore roles, attachments, scholarships, and freelance work.',
    },
    {
      number: '05',
      icon: Send,
      title: 'Applications',
      description: 'Keep your applications organized and follow each next step.',
    },
    {
      number: '06',
      icon: LineChart,
      title: 'Career Growth',
      description: 'Learn from your progress and keep moving toward your goals.',
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
      a: "The CV builder provides a print view. Use your browser's print dialog to save or print the CV; output can vary by browser."
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
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white py-12 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 sm:py-20 lg:py-24">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-brand-blue-50/70 to-transparent dark:from-brand-blue-950/30" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[.92fr_1.08fr] lg:gap-14 lg:px-8">
          <div className="max-w-2xl">
            <BrandLogo variant="full" to="/" className="mb-5" imageClassName="w-24 sm:w-28" />
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-green-200 bg-brand-green-50 px-3.5 py-2 text-xs font-bold text-brand-green-800 dark:border-brand-green-800 dark:bg-brand-green-950/60 dark:text-brand-green-300">
              <span className="h-2 w-2 rounded-full bg-brand-green-500" aria-hidden="true" />
              Made for Africa's next generation of talent
            </div>
            <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
              Build Your Skills.<br />
              <span className="text-brand-blue-800 dark:text-brand-blue-300">Launch Your Career.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg sm:leading-8">
              Your journey from learning to meaningful career opportunities starts here. Build your profile, prepare your materials, and find your next step.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/register" className="w-full sm:w-auto">
                <Button size="lg" variant="primary" rightIcon={<ArrowRight className="h-5 w-5" />} className="w-full">Create a Profile</Button>
              </Link>
              <Link to="/opportunities" className="w-full sm:w-auto">
                <Button size="lg" variant="secondary" leftIcon={<Search className="h-5 w-5" />} className="w-full">Explore Opportunities</Button>
              </Link>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-5 gap-y-3 border-t border-slate-200 pt-6 dark:border-slate-700">
              {['CV builder', 'Skills profile', 'Opportunity catalog', 'Application tracker'].map((label) => (
                <span key={label} className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 sm:text-sm">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-green-600 dark:text-brand-green-400" />{label}
                </span>
              ))}
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-4 rounded-[2rem] bg-brand-blue-50/70 dark:bg-brand-blue-950/30" aria-hidden="true" />
            <div className="relative rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-900 sm:p-7">
              <CareerPhoto photo={careerPhotos.nigeriaProfessional} priority sizes="(max-width: 1024px) 100vw, 44vw" className="mb-5" imageClassName="aspect-[16/9]" />
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5 dark:border-slate-800">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[.14em] text-brand-green-700 dark:text-brand-green-400">Your career workspace</p>
                  <p className="mt-2 text-xl font-extrabold text-slate-900 dark:text-white">Build momentum, step by step.</p>
                </div>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-blue-50 text-brand-blue-700 dark:bg-brand-blue-950 dark:text-brand-blue-300"><Rocket className="h-5 w-5" /></div>
              </div>
              <div className="space-y-3 py-5">
                {[
                  { icon: GraduationCap, title: 'Develop your skills', text: 'Explore resources and learning goals', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' },
                  { icon: FileText, title: 'Present your strengths', text: 'Build your CV and portfolio', color: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300' },
                  { icon: Briefcase, title: 'Find your next opportunity', text: 'Discover roles and track applications', color: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300' },
                ].map((item, index) => (
                  <div key={item.title} className="flex items-center gap-4 rounded-2xl border border-slate-100 p-3.5 dark:border-slate-800">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.color}`}><item.icon className="h-5 w-5" /></div>
                    <div className="min-w-0 flex-1"><p className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</p><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.text}</p></div>
                    <span className="text-xs font-bold text-slate-300 dark:text-slate-600">0{index + 1}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"><MapPin className="h-4 w-4 text-brand-green-600" />Designed for students and professionals across Africa</div>
            </div>
          </div>
        </div>
      </section>
      {/* How CareerLaunch Works Section */}
      <section className="py-20 bg-slate-50/60 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 grid items-center gap-6 lg:mb-16 lg:grid-cols-[1fr_20rem] lg:gap-12">
            <div className="max-w-2xl">
              <h2 className="text-xs font-bold uppercase tracking-wider text-brand-green-600 dark:text-brand-green-400 mb-2">
                Your Career Journey
              </h2>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                From learning to career growth
              </h3>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                A clear set of steps to help you prepare, find opportunities, and keep moving forward.
              </p>
            </div>
            <CareerPhoto photo={careerPhotos.womenInTechnology} className="mx-auto w-full max-w-sm lg:max-w-none" sizes="(max-width: 1024px) 100vw, 320px" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {steps.map((step) => (
              <div
                key={step.number}
                className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900 sm:p-6"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-blue-50 text-brand-blue-700 transition-colors group-hover:bg-brand-blue-100 dark:bg-brand-blue-950 dark:text-brand-blue-300 dark:group-hover:bg-brand-blue-900">
                  <step.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <div className="mb-1 text-[10px] font-bold tracking-[.14em] text-brand-green-700 dark:text-brand-green-400">STEP {step.number}</div>
                  <h4 className="mb-2 text-base font-bold text-slate-900 dark:text-white">
                    {step.title}
                  </h4>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pan-African focus */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-9 max-w-2xl">
            <p className="mb-2 text-xs font-bold uppercase tracking-[.14em] text-brand-green-700 dark:text-brand-green-400">Opportunities across borders</p>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-4xl">Built for Africa. Designed for Opportunity.</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">Connecting African talent with the skills, opportunities, and resources they need to build successful careers.</p>
          </div>
          <div className="grid items-start gap-5 lg:grid-cols-[1.1fr_.9fr] lg:gap-6">
            <AfricaMap />
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-1">
              <CareerPhoto photo={careerPhotos.kenyaDigitalLearning} sizes="(max-width: 1024px) 50vw, 36vw" />
              <CareerPhoto photo={careerPhotos.southAfricaRemoteWork} sizes="(max-width: 1024px) 50vw, 36vw" />
            </div>
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
                Current opportunities published in our verified listings catalog.
              </p>
            </div>

            <Link to="/opportunities">
              <Button variant="secondary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Browse Opportunities
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-6 sm:p-10">
            <div className="grid min-w-0 items-center gap-8 lg:grid-cols-2">
            <div className="min-w-0">
              <h2 className="text-xs font-bold uppercase tracking-wider text-brand-green-600 dark:text-brand-green-400 mb-2">A practical workspace</h2>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Keep your next career steps in one place</h3>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">Build your profile, prepare application materials, explore the catalog, and track the roles you apply to. Check opportunity details with the original source before applying.</p>
              <Link to="/register" className="inline-flex mt-6"><Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>Create a profile</Button></Link>
            </div>
            <CareerPhoto photo={careerPhotos.lagosDeveloper} sizes="(max-width: 1024px) 100vw, 460px" imageClassName="object-[center_30%]" />
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

