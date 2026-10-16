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

      {/* ================================================================
          HERO SECTION — Cinematic, editorial, premium
          ================================================================ */}
      <section className="relative overflow-hidden bg-white dark:bg-black editorial-glow">
        {/* Cinematic ambient background video layer */}
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden opacity-20 dark:opacity-25 motion-reduce:hidden"
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

        {/* Ambient background pulse — CSS only */}
        <div
          className="pointer-events-none absolute -top-64 -right-64 h-[700px] w-[700px] rounded-full bg-brand-blue-50 dark:bg-brand-blue-950/20 blur-3xl hero-ambient"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-brand-green-50 dark:bg-brand-green-950/15 blur-3xl hero-ambient"
          style={{ animationDelay: '4s' }}
          aria-hidden="true"
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[.92fr_1.08fr] lg:gap-14 lg:px-8 lg:py-28">
          {/* ---- Left: Copy ---- */}
          <div className="max-w-2xl">
            <BrandLogo variant="full" to="/" className="mb-6" imageClassName="w-24 sm:w-28" />

            {/* Africa signal badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-green-200/80 bg-brand-green-50/80 px-4 py-2 text-xs font-bold text-brand-green-800 backdrop-blur-sm dark:border-brand-green-800/60 dark:bg-brand-green-950/50 dark:text-brand-green-300">
              <span className="h-2 w-2 rounded-full bg-brand-green-500 animate-pulse" aria-hidden="true" />
              <span>Made for Africa&apos;s next generation of talent</span>
            </div>

            {/* Headline — editorial, strong, combining precision sans with Instrument Serif */}
            <h1 className="text-[2.75rem] font-extrabold leading-[1.08] tracking-tight text-slate-950 dark:text-[#F5F5F5] sm:text-5xl lg:text-[3.5rem]">
              Build Your <span className="font-serif italic font-normal tracking-normal text-brand-blue-800 dark:text-brand-blue-300">Skills</span>.<br />
              Launch Your <span className="font-serif italic font-normal tracking-normal text-brand-green-700 dark:text-brand-green-400">Career</span>.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg sm:leading-8">
              Your journey from learning to meaningful career opportunities starts here.
              Build your profile, prepare your materials, and find your next step.
            </p>

            {/* CTAs */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link to="/register" className="w-full sm:w-auto">
                <Button size="lg" variant="primary" rightIcon={<ArrowRight className="h-5 w-5" />} className="w-full shadow-lg shadow-brand-blue-900/10 dark:shadow-none">
                  Create a Profile
                </Button>
              </Link>
              <Link to="/opportunities" className="w-full sm:w-auto">
                <Button size="lg" variant="secondary" leftIcon={<Search className="h-5 w-5" />} className="w-full">
                  Explore Opportunities
                </Button>
              </Link>
            </div>

            {/* Feature pills */}
            <div className="mt-9 flex flex-wrap gap-x-5 gap-y-3 border-t border-slate-200/80 pt-6 dark:border-white/[0.08]">
              {['CV builder', 'Skills profile', 'Opportunity catalog', 'Application tracker'].map((label) => (
                <span key={label} className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 sm:text-sm">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-green-600 dark:text-brand-green-400" />{label}
                </span>
              ))}
            </div>
          </div>

          {/* ---- Right: Hero product card ---- */}
          <div className="relative mx-auto w-full max-w-xl">
            {/* Decorative background glow */}
            <div className="absolute -inset-4 rounded-[2.25rem] bg-gradient-to-br from-brand-blue-50/80 to-brand-green-50/50 dark:from-brand-blue-950/30 dark:to-brand-green-950/20 blur-xl" aria-hidden="true" />
            <div className="relative rounded-[1.75rem] cinematic-glass p-5 shadow-hero dark:border-white/[0.09] dark:bg-[#111111]/90 sm:p-7">
              {/* Hero photograph */}
              <CareerPhoto
                photo={careerPhotos.nigeriaProfessional}
                priority
                sizes="(max-width: 1024px) 100vw, 44vw"
                className="mb-5 shadow-card"
                imageClassName="aspect-[16/9]"
              />

              {/* Card header */}
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5 dark:border-white/[0.07]">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[.14em] text-brand-green-700 dark:text-brand-green-400">Your career workspace</p>
                  <p className="mt-2 text-xl font-extrabold text-slate-900 dark:text-[#F5F5F5]">Build momentum, step by step.</p>
                </div>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-blue-50 text-brand-blue-700 dark:bg-brand-blue-950/60 dark:text-brand-blue-300">
                  <Rocket className="h-5 w-5" />
                </div>
              </div>

              {/* Mini feature rows */}
              <div className="space-y-3 py-5">
                {[
                  { icon: GraduationCap, title: 'Develop your skills', text: 'Explore resources and learning goals', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' },
                  { icon: FileText, title: 'Present your strengths', text: 'Build your CV and portfolio', color: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300' },
                  { icon: Briefcase, title: 'Find your next opportunity', text: 'Discover roles and track applications', color: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300' },
                ].map((item, index) => (
                  <div key={item.title} className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white/60 p-3.5 backdrop-blur-xs transition-colors hover:border-slate-200 dark:border-white/[0.06] dark:bg-white/[0.02] dark:hover:border-white/[0.12]">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.color}`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-900 dark:text-[#F5F5F5]">{item.title}</p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.text}</p>
                    </div>
                    <span className="text-xs font-bold text-slate-300 dark:text-slate-600">0{index + 1}</span>
                  </div>
                ))}
              </div>

              {/* Location tag */}
              <div className="flex items-center gap-2 rounded-xl bg-slate-50/80 px-4 py-3 text-xs font-medium text-slate-600 dark:bg-white/[0.04] dark:text-slate-300">
                <MapPin className="h-4 w-4 text-brand-green-600" />
                Designed for students and professionals across Africa
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          CAREER JOURNEY — 6 steps, subtle entrance
          ================================================================ */}
      <section
        ref={sectionJourney as React.RefObject<HTMLElement>}
        className="reveal-on-scroll py-20 bg-slate-50/60 dark:bg-[#0A0A0A] border-y border-slate-200/80 dark:border-white/[0.06]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 grid items-center gap-6 lg:mb-16 lg:grid-cols-[1fr_20rem] lg:gap-12">
            <div className="max-w-2xl">
              <h2 className="text-xs font-bold uppercase tracking-wider text-brand-green-600 dark:text-brand-green-400 mb-2">
                Your Career Journey
              </h2>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-[#F5F5F5]">
                From learning to <span className="font-serif italic font-normal text-brand-blue-800 dark:text-brand-blue-400">career growth</span>
              </h3>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                A clear set of steps to help you prepare, find opportunities, and keep moving forward.
              </p>
            </div>
            <CareerPhoto photo={careerPhotos.womenInTechnology} className="mx-auto w-full max-w-sm lg:max-w-none" sizes="(max-width: 1024px) 100vw, 320px" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {steps.map((step, i) => (
              <div
                key={step.number}
                className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover dark:border-white/[0.07] dark:bg-[#111111] sm:p-6"
                style={{ transitionDelay: `${i * 40}ms` }}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-blue-50 text-brand-blue-700 transition-colors group-hover:bg-brand-blue-100 dark:bg-brand-blue-950/50 dark:text-brand-blue-300 dark:group-hover:bg-brand-blue-900/60">
                  <step.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <div className="mb-1 text-[10px] font-bold tracking-[.14em] text-brand-green-700 dark:text-brand-green-400">STEP {step.number}</div>
                  <h4 className="mb-2 text-base font-bold text-slate-900 dark:text-[#F5F5F5]">
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

      {/* ================================================================
          PAN-AFRICAN FOCUS
          ================================================================ */}
      <section
        ref={sectionAfrica as React.RefObject<HTMLElement>}
        className="reveal-on-scroll py-16 sm:py-20 bg-white dark:bg-black"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-9 max-w-2xl">
            <p className="mb-2 text-xs font-bold uppercase tracking-[.14em] text-brand-green-700 dark:text-brand-green-400">Opportunities across borders</p>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-[#F5F5F5] sm:text-4xl">
              Built for Africa. <span className="font-serif italic font-normal text-brand-green-700 dark:text-brand-green-400">Designed for Opportunity.</span>
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
              Connecting African talent with the skills, opportunities, and resources they need to build successful careers.
            </p>
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

      {/* ================================================================
          CAREER TOOLS SHOWCASE
          ================================================================ */}
      <section
        ref={sectionTools as React.RefObject<HTMLElement>}
        className="reveal-on-scroll py-20 bg-slate-50/60 dark:bg-[#0A0A0A] border-y border-slate-200/80 dark:border-white/[0.06]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-brand-green-600 dark:text-brand-green-400 mb-2">
              Integrated Suite
            </h2>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-[#F5F5F5]">
              Purpose-Built <span className="font-serif italic font-normal text-brand-green-700 dark:text-brand-green-400">Career Tools</span>
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
                    <div className="w-12 h-12 rounded-2xl bg-brand-blue-50 dark:bg-brand-blue-950/50 text-brand-blue-700 dark:text-brand-blue-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <tool.icon className="w-6 h-6" />
                    </div>
                    <Badge variant="green" size="sm">{tool.badge}</Badge>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-[#F5F5F5] mb-2">
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

      {/* ================================================================
          OPPORTUNITY DISCOVERY PREVIEW
          ================================================================ */}
      <section
        ref={sectionOpps as React.RefObject<HTMLElement>}
        className="reveal-on-scroll py-20 bg-white dark:bg-black"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-brand-green-600 dark:text-brand-green-400 mb-2">
                Featured Opportunities
              </h2>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F5F5F5]">
                Explore Opportunities in Kenya & Africa
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Catalog preview. Confirm deadlines and application details with the original listing source.
              </p>
              <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-2">
                Some entries are sample data for preview and have not been independently verified.
              </p>
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

      {/* ================================================================
          PRACTICAL WORKSPACE TEASER
          ================================================================ */}
      <section className="py-20 bg-slate-50/60 dark:bg-[#0A0A0A] border-y border-slate-200/80 dark:border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 sm:p-10">
            <div className="max-w-2xl">
              <h2 className="text-xs font-bold uppercase tracking-wider text-brand-green-600 dark:text-brand-green-400 mb-2">A practical workspace</h2>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F5F5F5]">Keep your next career steps in one place</h3>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                Build your profile, prepare application materials, explore the catalog, and track the roles you apply to.
                Check opportunity details with the original source before applying.
              </p>
              <Link to="/register" className="inline-flex mt-6">
                <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>Create a profile</Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* ================================================================
          FAQ ACCORDION
          ================================================================ */}
      <section className="py-20 bg-white dark:bg-black border-t border-slate-200/80 dark:border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F5F5F5]">
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
                className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-white/[0.07] rounded-2xl overflow-hidden transition-all shadow-soft"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 font-bold text-sm text-slate-900 dark:text-[#F5F5F5]"
                  aria-expanded={openFaq === idx}
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${openFaq === idx ? 'rotate-180 text-brand-green-500' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-white/[0.06] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          FINAL CTA — cinematic, confident
          ================================================================ */}
      <section
        ref={sectionCta as React.RefObject<HTMLElement>}
        className="reveal-on-scroll py-24 relative overflow-hidden"
      >
        {/* Deep navy background with subtle texture */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-blue-900 via-brand-blue-950 to-slate-950" aria-hidden="true" />
        {/* Ambient glow accents */}
        <div className="absolute inset-0 opacity-20" aria-hidden="true">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-green-500 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-brand-blue-400 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-green-500/40 bg-brand-green-500/10 px-4 py-2 text-xs font-bold text-brand-green-300 mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-green-400 animate-pulse" aria-hidden="true" />
            Built for Africa. Designed for Opportunity.
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
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
