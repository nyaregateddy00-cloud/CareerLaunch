import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText, Globe, Search, Kanban, Sparkles, Bot, ArrowRight, CheckCircle2
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Footer } from '../../components/layout/Footer';
import { CareerPhoto } from '../../components/landing/CareerPhoto';
import { careerPhotos } from '../../components/landing/careerPhotos';

export const FeaturesPage: React.FC = () => {
  const features = [
    {
      title: 'Interactive CV Builder',
      subtitle: 'Structured CVs with print and PDF export',
      desc: 'Add your education, work experience, projects, and skills to a structured CV layout. Use your browser print dialog to save clean, ATS-compliant PDFs.',
      points: [
        'Multi-template layout options (Modern, Executive, Minimal)',
        'Edit personal details, technical skills, projects, and education',
        'Print-friendly preview with clean margins',
        'Direct synchronization with your CareerLaunch profile',
      ],
      icon: FileText,
      link: '/cv-builder',
      photo: careerPhotos.southAfricaRemoteWork,
    },
    {
      title: 'Shareable Portfolio Engine',
      subtitle: 'Showcase projects and proof of work',
      desc: 'Create a clean, public portfolio that highlights your work, live project links, and direct contact details for recruiters and hiring managers.',
      points: [
        'Dedicated public URL on your CareerLaunch account',
        'Project showcase with screenshots and repository links',
        'Technical skill stack and verified achievements',
        'Responsive layout optimized for mobile and desktop viewing',
      ],
      icon: Globe,
      link: '/portfolio-builder',
      photo: careerPhotos.creativeFreelancer,
    },
    {
      title: 'Opportunity Discovery Engine',
      subtitle: 'Find roles, attachments, and contracts',
      desc: 'Explore curated listings for graduate jobs, industrial attachments, internships, scholarships, and remote freelance opportunities across Africa.',
      points: [
        'Filter by category, location, work mode, and experience level',
        'Transparent compensation and stipend indicators in KES and USD',
        'Save roles and move them directly into your application pipeline',
        'Verified source links and straightforward application steps',
      ],
      icon: Search,
      link: '/opportunities',
      photo: careerPhotos.kenyaDigitalLearning,
    },
    {
      title: 'Kanban Application Tracker',
      subtitle: 'Keep your job search organized',
      desc: 'Move past scattered notes and spreadsheets. Track every application through visual stages from initial bookmark to interview and offer.',
      points: [
        'Stages: Saved, Applied, Shortlisted, Interview, Offer, Closed',
        'Record interview dates, contact notes, and preparation tasks',
        'Direct tracking from discovered platform listings',
        'Real-time overview of active submissions and follow-ups',
      ],
      icon: Kanban,
      link: '/applications',
      photo: careerPhotos.africanTechTeam,
    },
    {
      title: 'Skills & Gap Analyzer',
      subtitle: 'Identify learning areas for target roles',
      desc: 'Compare your documented technical and professional skills against benchmarks for key roles in the African tech ecosystem.',
      points: [
        'Match percentage indicators for target career tracks',
        'High-priority and emerging skill recommendations',
        'Curated learning playbooks and resources for each gap',
        'Structured skill tagging across frameworks and tools',
      ],
      icon: Sparkles,
      link: '/skills',
      photo: careerPhotos.nigeriaProfessional,
    },
    {
      title: 'CareerLaunch AI Assistant',
      subtitle: 'Contextual career guidance',
      desc: 'Get tailored advice on drafting cover letters, preparing for technical interviews, and refining bullet points for African and international hiring standards.',
      points: [
        'Assistance with role-specific interview preparation',
        'Constructive feedback on CV summary statements and descriptions',
        'Powered by modern AI with direct regional market context',
        'Accessible directly from your career dashboard',
      ],
      icon: Bot,
      link: '/ai-assistant',
      photo: careerPhotos.womenInTechnology,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-slate-900 dark:text-[#f8fafc]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 flex-1 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-blue-50 dark:bg-white/[0.06] text-brand-blue-800 dark:text-brand-blue-300 border border-brand-blue-200/80 dark:border-white/10">
            <span>Platform Capabilities</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-950 dark:text-white">
            Purpose-Built <span className="font-serif italic font-normal text-brand-blue-800 dark:text-brand-blue-400">Career Tools</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Everything you need to organize your profile, prepare your materials, search for verified opportunities, and track your applications.
          </p>
        </div>

        <div className="space-y-10">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-12 p-7 sm:p-10 rounded-2xl bg-white dark:bg-[#111111] border border-slate-200/80 dark:border-white/10 shadow-sm ${
                idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className="flex-1 space-y-4">
                <div className="w-11 h-11 rounded-xl bg-brand-blue-50 dark:bg-white/[0.06] text-brand-blue-700 dark:text-brand-blue-300 flex items-center justify-center">
                  <feat.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{feat.title}</h3>
                  <p className="text-xs sm:text-sm font-semibold text-brand-green-700 dark:text-brand-green-400 mt-0.5">{feat.subtitle}</p>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{feat.desc}</p>
                <div className="space-y-2 pt-1">
                  {feat.points.map((pt, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-brand-green-600 dark:text-brand-green-400 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-3">
                  <Link to={feat.link}>
                    <Button variant="accent" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                      Open {feat.title}
                    </Button>
                  </Link>
                </div>
              </div>

              {feat.photo ? (
                <CareerPhoto photo={feat.photo} className="w-full lg:w-5/12 rounded-xl" sizes="(max-width: 1024px) 100vw, 40vw" />
              ) : (
                <div className="w-full lg:w-5/12 bg-slate-50 dark:bg-[#0A0A0A] rounded-xl p-6 border border-slate-200/80 dark:border-white/10 flex flex-col items-center justify-center text-center min-h-[220px]">
                  <feat.icon className="w-12 h-12 text-slate-400 dark:text-slate-600 mb-3" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Live Feature in CareerLaunch</span>
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
