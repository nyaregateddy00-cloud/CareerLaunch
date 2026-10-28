import React from 'react';
import { Link } from 'react-router-dom';
import {
  Rocket,
  MapPin,
  Mail,
  ExternalLink,
  Github,
  Linkedin,
  Twitter,
  Sparkles,
  Briefcase,
} from 'lucide-react';
import { UserProfile, Project, Experience, Education, UserSkill } from '../../types';
import { Button } from '../common/Button';
import { formatMonthYear, safeExternalUrl } from '../../lib/utils';
import { Avatar } from '../common/Avatar';
import { FallbackImage } from '../common/FallbackImage';

interface PublicPortfolioViewProps {
  user: UserProfile;
  projects: Project[];
  experience: Experience[];
  education: Education[];
  skills: UserSkill[];
}

export const PublicPortfolioView: React.FC<PublicPortfolioViewProps> = ({
  user,
  projects,
  experience,
  education,
  skills,
}) => {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-[#f8fafc] transition-colors selection:bg-brand-green-500 selection:text-white">
      {/* Top Banner Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-black/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-blue-900 dark:bg-brand-blue-700 flex items-center justify-center text-white">
              <Rocket className="w-4 h-4 text-brand-green-400" />
            </div>
            <span className="text-base font-bold tracking-tight text-brand-blue-900 dark:text-white">
              Career<span className="text-brand-green-500">Launch</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <a href={`mailto:${user.email}`}>
              <Button size="sm" variant="accent" leftIcon={<Mail className="w-3.5 h-3.5" />}>
                Get in Touch
              </Button>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <section className="py-14 sm:py-20 border-b border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-[#0A0A0A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="relative inline-block mb-5">
            <Avatar src={user.avatarUrl} name={user.fullName} alt={`${user.fullName} profile photo`} className="mx-auto h-24 w-24 rounded-2xl border-4 border-white shadow-md sm:h-32 sm:w-32 dark:border-[#111111]" fallbackClassName="text-2xl sm:text-3xl" />
            <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-brand-green-500 border-2 border-white dark:border-[#111111] flex items-center justify-center text-white shadow-xs" title="Available for hire">
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {user.fullName}
          </h1>

          <p className="mt-2 text-base sm:text-lg font-semibold text-brand-blue-800 dark:text-brand-blue-300 max-w-2xl mx-auto">
            {user.headline}
          </p>

          <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-brand-green-600 dark:text-brand-green-400" />
            {user.location}
          </p>

          <p className="mt-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {user.bio}
          </p>

          {/* Social Links */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
            {user.githubUrl && (
              <a href={user.githubUrl} target="_blank" rel="noreferrer">
                <Button size="sm" variant="secondary" leftIcon={<Github className="w-3.5 h-3.5" />}>
                  GitHub
                </Button>
              </a>
            )}
            {user.linkedinUrl && (
              <a href={user.linkedinUrl} target="_blank" rel="noreferrer">
                <Button size="sm" variant="secondary" leftIcon={<Linkedin className="w-3.5 h-3.5" />}>
                  LinkedIn
                </Button>
              </a>
            )}
            {user.twitterUrl && (
              <a href={user.twitterUrl} target="_blank" rel="noreferrer">
                <Button size="sm" variant="secondary" leftIcon={<Twitter className="w-3.5 h-3.5" />}>
                  Twitter / X
                </Button>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-14 space-y-14">
        {/* Featured Projects Grid */}
        <section>
          <div className="mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Featured Projects &amp; Work
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Software solutions and applications built for African and international users
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="bg-white dark:bg-[#111111] border border-slate-200/80 dark:border-white/10 rounded-xl overflow-hidden shadow-xs hover:border-slate-300 dark:hover:border-white/20 transition-all flex flex-col justify-between"
              >
                {safeExternalUrl(proj.imageUrl) && (
                  <div className="h-44 w-full overflow-hidden bg-slate-100 dark:bg-white/[0.04]">
                    <FallbackImage src={safeExternalUrl(proj.imageUrl)} alt={`${proj.title} project preview`} className="h-full w-full" imageClassName="h-full w-full object-cover" fallbackClassName="h-full w-full bg-slate-100 dark:bg-white/[0.04]" />
                  </div>
                )}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
                      {proj.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                      {proj.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {proj.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 pt-3 border-t border-slate-100 dark:border-white/[0.08]">
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noreferrer">
                        <Button size="sm" variant="accent" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                          Live Demo
                        </Button>
                      </a>
                    )}
                    {proj.githubLink && (
                      <a href={proj.githubLink} target="_blank" rel="noreferrer">
                        <Button size="sm" variant="secondary" leftIcon={<Github className="w-3.5 h-3.5" />}>
                          Source Code
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Experience Timeline */}
        <section>
          <div className="mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-brand-green-600 dark:text-brand-green-400" />
              Work Experience &amp; Attachments
            </h2>
          </div>

          <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200 dark:before:bg-white/10">
            {experience.map((exp) => (
              <div key={exp.id} className="relative pl-9">
                <span className="absolute left-2 top-2 w-3 h-3 rounded-full border-2 border-brand-green-500 bg-white dark:bg-black" />
                <div className="bg-white dark:bg-[#111111] border border-slate-200/80 dark:border-white/10 p-5 rounded-xl shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {exp.position} <span className="text-brand-blue-800 dark:text-brand-blue-400 font-semibold">@ {exp.company}</span>
                    </h3>
                    <span className="text-xs text-slate-400">
                      {formatMonthYear(exp.startDate)} – {exp.isCurrent ? 'Present' : formatMonthYear(exp.endDate)}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mb-2.5">{exp.location} • {exp.employmentType}</div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                    {exp.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skills & Competencies */}
        <section className="bg-white dark:bg-[#111111] border border-slate-200/80 dark:border-white/10 rounded-xl p-6 sm:p-7 shadow-xs">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-green-600 dark:text-brand-green-400" />
            Skills &amp; Technical Capabilities
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <span
                key={s.id}
                className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-white/[0.06] text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-white/10"
              >
                {s.skillName} • <span className="opacity-70 text-[11px]">{s.proficiencyLevel}</span>
              </span>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="text-center py-10 px-6 rounded-xl bg-brand-blue-900 text-white shadow-sm border border-brand-blue-800 dark:bg-[#0c1a30] dark:border-white/10">
          <div className="max-w-lg mx-auto space-y-3">
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Interested in working together?
            </h2>
            <p className="text-xs sm:text-sm text-brand-blue-100 dark:text-slate-300 leading-relaxed">
              Available for full-time engineering roles, industrial attachments, and freelance projects.
            </p>
            <div className="pt-2">
              <a href={`mailto:${user.email}`}>
                <Button size="md" variant="accent" leftIcon={<Mail className="w-4 h-4" />}>
                  Contact {user.fullName.split(' ')[0]} Directly
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Mini Footer */}
      <footer className="border-t border-slate-200/80 dark:border-white/10 py-6 text-center text-xs text-slate-500">
        Powered by <Link to="/" className="font-semibold text-brand-blue-800 dark:text-brand-green-400">CareerLaunch</Link> — Build Your Skills. Launch Your Career.
      </footer>
    </div>
  );
};
