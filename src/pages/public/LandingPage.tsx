import React, { useState, useEffect, useRef } from 'react';
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
import { Opportunity } from '../../types';
import { Footer } from '../../components/layout/Footer';
import { AfricaMap } from '../../components/landing/AfricaMap';
import { BrandLogo } from '../../components/branding/BrandLogo';
import { CareerPhoto } from '../../components/landing/CareerPhoto';
import { careerPhotos } from '../../components/landing/careerPhotos';

/* ---------- Section Reveal Hook ---------- */
function useSectionReveal() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('revealed');
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

export const LandingPage: React.FC = () => {
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [savedOppIds, setSavedOppIds] = useState<string[]>(() => mockStorage.getSavedOpportunityIds());
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const opportunities = mockStorage.getOpportunities().slice(0, 4);

  const sectionJourney = useSectionReveal();
  const sectionAfrica = useSectionReveal();
  const sectionTools = useSectionReveal();
  const sectionOpps = useSectionReveal();
  const sectionCta = useSectionReveal();

  const handleToggleSave = (id: string) => {
    mockStorage.toggleSaveOpportunity(id);
    setSavedOppIds(mockStorage.getSavedOpportunityIds());
  };

  const steps = [
    {
      number: '01',
      icon: GraduationCap,
      title: 'Learning & Foundations',
      description: 'Explore practical career playbooks, technical roadmaps, and attachment guides tailored for Africa.',
    },
    {
      number: '02',
      icon: Sparkles,
      title: 'Skills & Gap Analysis',
      description: 'Document your verified technical skills and analyze your gaps against current market benchmarks.',
    },
    {
      number: '03',
      icon: FileText,
      title: 'CV & Live Portfolio',
      description: 'Generate ATS-friendly CVs and publish a shareable web portfolio highlighting your projects.',
    },
    {
      number: '04',
      icon: Compass,
      title: 'Opportunity Discovery',
      description: 'Explore verified industrial attachments, graduate intakes, scholarships, and remote contracts.',
    },
    {
      number: '05',
      icon: Send,
      title: 'Application Pipeline',
      description: 'Keep your submissions organized through a dedicated Kanban tracker from saved to offer.',
    },
    {
      number: '06',
      icon: LineChart,
      title: 'Career Advancement',
      description: 'Build measurable momentum, track your progress, and connect directly with hiring employers.',
    },
  ];

  const tools = [
    {
      icon: FileText,
      title: 'Interactive CV Builder',
      desc: 'Create structured, ATS-compliant CVs across modern templates. Print or save directly to PDF.',
      link: '/cv-builder',
      badge: 'Templates',
    },
    {
      icon: Globe,
      title: 'Shareable Portfolio Engine',
      desc: 'Showcase your real-world projects, live demo links, and contact channels on a personal public page.',
      link: '/portfolio-builder',
      badge: 'Portfolio',
    },
    {
      icon: Search,
      title: 'Opportunity Discovery',
      desc: 'Filter verified graduate roles, industrial attachments, internships, and remote freelance opportunities.',
      link: '/opportunities',
      badge: 'Verified',
    },
    {
      icon: Kanban,
      title: 'Kanban Application Tracker',
      desc: 'Track submissions visually across Saved, Applied, Interview, and Offer stages without spreadsheets.',
      link: '/applications',
      badge: 'Workflow',
    },
    {
      icon: Sparkles,
      title: 'Skill Gap Analyzer',
      desc: 'Audit your current stack against benchmarks for software, design, data, and infrastructure roles.',
      link: '/skills',
      badge: 'Intelligence',
    },
    {
      icon: Bot,
      title: 'CareerLaunch AI Coach',
      desc: 'Get role-specific interview simulation, cover letter drafts, and CV phrasing assistance.',
      link: '/ai-assistant',
      badge: 'AI Powered',
    },
  ];

  const faqs = [
    {
      q: "Who is CareerLaunch designed for?",
      a: "CareerLaunch is purpose-built for African university students, TVET graduates, early-career tech professionals, and remote freelancers navigating internships, attachments, and full-time employment."
    },
    {
      q: "How does the industrial attachment support work for Kenyan students?",
      a: "The catalog features verified industrial attachment opportunities aligned with NITA guidelines and degree curriculum requirements, allowing students to track requirements and deadlines accurately."
    },
    {
      q: "Can I download my CV as a PDF?",
      a: "Yes. The CV Builder renders clean, print-optimized layouts that convert cleanly to standard PDF via your browser's print dialog."
    },
    {
      q: "What makes CareerLaunch different from generic job boards?",
      a: "Rather than an unvetted bulletin board, CareerLaunch is a complete career workspace that links skill development, portfolio creation, application tracking, and verified opportunity discovery."
    },
    {
      q: "How does the AI assistant help my career preparation?",
      a: "The assistant provides contextual interview simulations, checks CV bullet points for clarity and impact, and helps tailor cover letters to African and multinational hiring standards."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black text-slate-900 dark:text-[#f8fafc]">

      {/* ================================================================
          HERO SECTION — Editorial, confident, cinematic
          ================================================================ */}
      <section className="relative overflow-hidden bg-white dark:bg-black border-b border-slate-200/80 dark:border-white/[0.08]">
        {/* Ambient background video layer */}
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden opacity-15 dark:opacity-20 motion-reduce:hidden"
          aria-hidden="true"
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="h-full w-full object-cover object-center filter saturate-50 contrast-125"
            poster="/careerlaunch-logo.jpeg"
          >
            <source
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260729_102822_0e6c87e8-c141-4744-bf32-ad30db296371.mp4"
              type="video/mp4"
            />
          </video>
          {/* Layered cinematic gradient overlays for pristine readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/80 to-white dark:from-black/95 dark:via-black/85 dark:to-black" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/60 to-transparent dark:from-black/90 dark:via-black/60 dark:to-transparent" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1fr_1fr] lg:gap-14 lg:px-8 lg:py-24">
          {/* ---- Left: Brand & Copy ---- */}
          <div className="max-w-2xl">
            <BrandLogo variant="full" to="/" className="mb-6" imageClassName="w-24 sm:w-28" />

            {/* Regional Signal */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-green-300 dark:border-brand-green-800/80 bg-brand-green-50/80 dark:bg-brand-green-950/60 px-3.5 py-1.5 text-xs font-semibold text-brand-green-800 dark:text-brand-green-300">
              <span className="h-2 w-2 rounded-full bg-brand-green-500" aria-hidden="true" />
              <span>Built for Africa. Designed for Opportunity.</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.08] tracking-tight text-slate-950 dark:text-white">
              Build Your <span className="font-serif italic font-normal tracking-normal text-brand-blue-800 dark:text-brand-blue-400">Skills</span>.<br />
              Launch Your <span className="font-serif italic font-normal tracking-normal text-brand-green-700 dark:text-brand-green-400">Career</span>.
            </h1>

            <p className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              CareerLaunch helps people build skills, create stronger career profiles, discover opportunities, and connect with employers across Kenya and the African market.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/register" className="w-full sm:w-auto">
                <Button size="lg" variant="primary" rightIcon={<ArrowRight className="h-4 w-4" />} className="w-full">
                  Create Your Profile
                </Button>
              </Link>
              <Link to="/opportunities" className="w-full sm:w-auto">
                <Button size="lg" variant="secondary" leftIcon={<Search className="h-4 w-4" />} className="w-full">
                  Explore Opportunities
                </Button>
              </Link>
            </div>

            {/* Trust Points */}
            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 border-t border-slate-200/80 dark:border-white/[0.08] pt-5 text-xs font-medium text-slate-600 dark:text-slate-400">
              {['ATS-Compliant CV Builder', 'Shareable Portfolio', 'Verified Opportunity Catalog', 'Kanban Application Tracker'].map((label) => (
                <span key={label} className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-brand-green-600 dark:text-brand-green-400" />
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* ---- Right: Hero Card ---- */}
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#111111] p-5 sm:p-7 shadow-sm">
              <CareerPhoto
                photo={careerPhotos.nigeriaProfessional}
                priority
                sizes="(max-width: 1024px) 100vw, 44vw"
                className="mb-5 shadow-xs"
                imageClassName="aspect-[16/10] rounded-xl"
              />

              <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-white/[0.08] pb-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-brand-green-700 dark:text-brand-green-400">Career Operating System</p>
                  <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">Structured progress at every step.</p>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-blue-50 dark:bg-white/[0.06] text-brand-blue-700 dark:text-brand-blue-300">
                  <Rocket className="h-5 w-5" />
                </div>
              </div>

              <div className="space-y-2.5 py-4">
                {[
                  { icon: GraduationCap, title: 'Build verified competencies', text: 'Document skills and learn from curated guides' },
                  { icon: FileText, title: 'Present polished materials', text: 'Structure your CV and shareable portfolio' },
                  { icon: Briefcase, title: 'Discover verified openings', text: 'Find attachments, graduate roles, and contracts' },
                ].map((item, idx) => (
                  <div key={item.title} className="flex items-center gap-3.5 rounded-xl border border-slate-100 dark:border-white/[0.06] bg-slate-50/60 dark:bg-white/[0.02] p-3 transition-colors">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white dark:bg-[#161616] text-brand-blue-900 dark:text-brand-green-400 border border-slate-200/60 dark:border-white/10">
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{item.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{item.text}</p>
                    </div>
                    <span className="text-xs font-semibold text-slate-400 dark:text-slate-600">0{idx + 1}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-slate-50 dark:bg-white/[0.03] px-3.5 py-2.5 text-xs text-slate-600 dark:text-slate-400">
                <MapPin className="h-4 w-4 text-brand-green-600 shrink-0" />
                <span>Serving students, graduates, and hiring teams across Africa</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          CAREER JOURNEY — 6 steps
          ================================================================ */}
      <section
        ref={sectionJourney as React.RefObject<HTMLElement>}
        className="reveal-on-scroll py-16 sm:py-20 bg-slate-50/60 dark:bg-[#0A0A0A] border-b border-slate-200/80 dark:border-white/[0.08]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 grid items-center gap-6 lg:mb-16 lg:grid-cols-[1fr_20rem] lg:gap-12">
            <div className="max-w-2xl">
              <h2 className="text-xs font-bold uppercase tracking-wider text-brand-green-700 dark:text-brand-green-400 mb-2">
                Your Career Journey
              </h2>
              <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                From learning to <span className="font-serif italic font-normal text-brand-blue-800 dark:text-brand-blue-400">career growth</span>
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                A structured pathway designed to help you build competencies, prepare professional materials, and track your opportunities.
              </p>
            </div>
            <CareerPhoto photo={careerPhotos.womenInTechnology} className="mx-auto w-full max-w-sm lg:max-w-none rounded-xl" sizes="(max-width: 1024px) 100vw, 320px" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="flex items-start gap-3.5 rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-white/[0.08] dark:bg-[#111111]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-blue-50 dark:bg-white/[0.06] text-brand-blue-800 dark:text-brand-blue-300">
                  <step.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <div className="mb-1 text-[10px] font-bold tracking-wider uppercase text-brand-green-700 dark:text-brand-green-400">STEP {step.number}</div>
                  <h4 className="mb-1 text-sm font-bold text-slate-900 dark:text-white">
                    {step.title}
                  </h4>
                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          PAN-AFRICAN NETWORK
          ================================================================ */}
      <section
        ref={sectionAfrica as React.RefObject<HTMLElement>}
        className="reveal-on-scroll py-16 sm:py-20 bg-white dark:bg-black border-b border-slate-200/80 dark:border-white/[0.08]"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-9 max-w-2xl">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-green-700 dark:text-brand-green-400">Regional &amp; Remote Scope</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white">
              Built for Africa. <span className="font-serif italic font-normal text-brand-green-700 dark:text-brand-green-400">Designed for Opportunity.</span>
            </h2>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Connecting African talent with the skills, opportunities, and resources they need to build successful careers.
            </p>
          </div>
          <div className="grid items-start gap-6 lg:grid-cols-[1.1fr_.9fr]">
            <AfricaMap />
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
              <CareerPhoto photo={careerPhotos.kenyaDigitalLearning} sizes="(max-width: 1024px) 50vw, 36vw" className="rounded-xl" />
              <CareerPhoto photo={careerPhotos.southAfricaRemoteWork} sizes="(max-width: 1024px) 50vw, 36vw" className="rounded-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          CAREER TOOLS SHOWCASE
          ================================================================ */}
      <section
        ref={sectionTools as React.RefObject<HTMLElement>}
        className="reveal-on-scroll py-16 sm:py-20 bg-slate-50/60 dark:bg-[#0A0A0A] border-b border-slate-200/80 dark:border-white/[0.08]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-brand-green-700 dark:text-brand-green-400 mb-2">
              Integrated Workspace
            </h2>
            <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Purpose-Built <span className="font-serif italic font-normal text-brand-blue-800 dark:text-brand-blue-400">Career Tools</span>
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Every tool works together to organize your profile, materials, and job search.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool, idx) => (
              <Card key={idx} hoverEffect className="flex flex-col justify-between p-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-brand-blue-50 dark:bg-white/[0.06] text-brand-blue-700 dark:text-brand-blue-300 flex items-center justify-center">
                      <tool.icon className="w-5 h-5" />
                    </div>
                    <Badge variant="green" size="sm">{tool.badge}</Badge>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
                    {tool.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-5">
                    {tool.desc}
                  </p>
                </div>

                <Link
                  to={tool.link}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-blue-700 dark:text-brand-green-400 hover:underline"
                >
                  Explore Tool <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          OPPORTUNITY DISCOVERY PREVIEW
          ================================================================ */}
      <section
        ref={sectionOpps as React.RefObject<HTMLElement>}
        className="reveal-on-scroll py-16 sm:py-20 bg-white dark:bg-black border-b border-slate-200/80 dark:border-white/[0.08]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-brand-green-700 dark:text-brand-green-400 mb-2">
                Curated Listings
              </h2>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Explore Opportunities in Kenya &amp; Pan-Africa
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Explore verified attachments, developer roles, scholarships, and freelance opportunities.
              </p>
            </div>

            <Link to="/opportunities">
              <Button variant="secondary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Browse All ({mockStorage.getOpportunities().length})
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

      {/* ================================================================
          FAQ ACCORDION
          ================================================================ */}
      <section className="py-16 sm:py-20 bg-slate-50/60 dark:bg-[#0A0A0A] border-b border-slate-200/80 dark:border-white/[0.08]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Common questions about accounts, opportunities, and career tools.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-[#111111] border border-slate-200/80 dark:border-white/[0.08] rounded-xl overflow-hidden transition-all shadow-xs"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-slate-900 dark:text-white"
                  aria-expanded={openFaq === idx}
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${openFaq === idx ? 'rotate-180 text-brand-green-500' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-white/[0.06] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          FINAL CTA
          ================================================================ */}
      <section
        ref={sectionCta as React.RefObject<HTMLElement>}
        className="reveal-on-scroll py-20 bg-white dark:bg-black"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-brand-blue-900 text-white p-8 sm:p-14 text-center space-y-5 dark:bg-[#0c1a30] dark:border dark:border-white/10 shadow-sm">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-green-400/40 bg-brand-green-500/10 px-3.5 py-1 text-xs font-semibold text-brand-green-300">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-green-400" aria-hidden="true" />
              Build Your Skills. Launch Your Career.
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Ready to take the next step in your career?
            </h2>
            <p className="text-xs sm:text-base text-brand-blue-100 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
              Create your profile today, generate your ATS-compliant CV, and explore verified opportunities across Africa.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/register" className="w-full sm:w-auto">
                <Button size="lg" variant="accent" rightIcon={<ArrowRight className="w-4 h-4" />} className="w-full">
                  Create Your Account
                </Button>
              </Link>
              <Link to="/opportunities" className="w-full sm:w-auto">
                <Button size="lg" variant="secondary" className="w-full">
                  Browse Opportunities
                </Button>
              </Link>
            </div>
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
