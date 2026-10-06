import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Mail,
  ExternalLink,
  Github,
  Linkedin,
  Twitter,
  Calendar,
  Sparkles,
  ArrowRight,
  Briefcase,
  GraduationCap
} from 'lucide-react';
import { PublicPortfolioProfile, Project, Experience, Education, UserSkill } from '../../types';
import { Button } from '../common/Button';
import { formatMonthYear } from '../../lib/utils';
import { BrandLogo } from '../branding/BrandLogo';
import { safeExternalUrl } from '../../lib/utils';

interface PublicPortfolioViewProps {
  user: PublicPortfolioProfile;
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
  const githubUrl = safeExternalUrl(user.githubUrl);
  const linkedinUrl = safeExternalUrl(user.linkedinUrl);
  const twitterUrl = safeExternalUrl(user.twitterUrl);
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors selection:bg-brand-green-500 selection:text-white">
      {/* Top Banner Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <BrandLogo to="/" />

          <div className="flex items-center gap-3">
            {user.email && <a href={`mailto:${user.email}`}>
              <Button size="sm" variant="accent" leftIcon={<Mail className="w-3.5 h-3.5" />}>
                Get in Touch
              </Button>
            </a>}
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <section className="py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800 bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="relative inline-block mb-6">
            {user.avatarUrl ? <img src={user.avatarUrl} alt="" className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover border-4 border-white dark:border-slate-800 shadow-xl mx-auto" /> : <div aria-hidden="true" className="grid h-28 w-28 sm:h-36 sm:w-36 place-items-center rounded-3xl border-4 border-white bg-brand-blue-900 text-3xl font-bold text-white shadow-xl mx-auto">{user.fullName.split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase()}</div>}
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            {user.fullName}
          </h1>

          <p className="mt-3 text-base sm:text-xl font-semibold text-brand-blue-900 dark:text-brand-blue-300 max-w-2xl mx-auto">
            {user.headline}
          </p>

          {user.location && <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
            <MapPin className="w-4 h-4 text-brand-green-500" />
            {user.location}
          </p>}

          <p className="mt-6 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {user.bio}
          </p>

          {/* Social Links */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {githubUrl && (
              <a href={githubUrl} target="_blank" rel="noreferrer">
                <Button size="sm" variant="secondary" leftIcon={<Github className="w-4 h-4" />}>
                  GitHub
                </Button>
              </a>
            )}
            {linkedinUrl && (
              <a href={linkedinUrl} target="_blank" rel="noreferrer">
                <Button size="sm" variant="secondary" leftIcon={<Linkedin className="w-4 h-4" />}>
                  LinkedIn
                </Button>
              </a>
            )}
            {twitterUrl && (
              <a href={twitterUrl} target="_blank" rel="noreferrer">
                <Button size="sm" variant="secondary" leftIcon={<Twitter className="w-4 h-4" />}>
                  Twitter / X
                </Button>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-16 space-y-16">
        {/* Featured Projects Grid */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Selected Projects & Proof of Work</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Projects selected by the portfolio owner
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-card hover:shadow-lg transition-all flex flex-col justify-between"
              >
                {safeExternalUrl(proj.imageUrl) && (
                  <div className="h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={safeExternalUrl(proj.imageUrl)}
                      alt={proj.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
                      {proj.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                      {proj.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {proj.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                    {safeExternalUrl(proj.link) && (
                      <a href={safeExternalUrl(proj.link)} target="_blank" rel="noreferrer">
                        <Button size="sm" variant="accent" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                          Live Demo
                        </Button>
                      </a>
                    )}
                    {safeExternalUrl(proj.githubLink) && (
                      <a href={safeExternalUrl(proj.githubLink)} target="_blank" rel="noreferrer">
                        <Button size="sm" variant="secondary" leftIcon={<Github className="w-3.5 h-3.5" />}>
                          Source Code
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {projects.length === 0 && <p className="text-sm text-slate-500">No projects have been selected for this public portfolio.</p>}
          </div>
        </section>

        {/* Experience Timeline */}
        <section>
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-brand-green-500" />
              Work Experience & Attachments
            </h2>
          </div>

          <div className="space-y-6 relative before:absolute before:inset-0 before:left-4 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
            {experience.map((exp) => (
              <div key={exp.id} className="relative pl-10">
                <span className="absolute left-2.5 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-brand-green-500 bg-white dark:bg-slate-900" />
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-card">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      {exp.position} <span className="text-brand-blue-700 dark:text-brand-blue-400 font-semibold">@ {exp.company}</span>
                    </h3>
                    <span className="text-xs font-semibold text-slate-400">
                      {formatMonthYear(exp.startDate)} – {exp.isCurrent ? 'Present' : formatMonthYear(exp.endDate)}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mb-3">{exp.location} • {exp.employmentType}</div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {exp.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skills & Competencies */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-card">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-green-500" />
            Skills & Technical Stack
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {skills.map((s) => (
              <span
                key={s.id}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-brand-blue-50 dark:bg-brand-blue-950/60 text-brand-blue-900 dark:text-brand-blue-300 border border-brand-blue-100 dark:border-brand-blue-900/60"
              >
                {s.skillName} • <span className="opacity-70 text-[10px]">{s.proficiencyLevel}</span>
              </span>
            ))}
          </div>
        </section>

        {/* Final CTA Contact Box */}
        {user.email && <section className="text-center py-12 px-6 rounded-3xl bg-brand-blue-900 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Interested in working together?
            </h2>
            <p className="text-sm text-brand-blue-200 leading-relaxed">
              Contact me using the email address I chose to make public.
            </p>
            <div className="pt-2">
              <a href={`mailto:${user.email}`}>
                <Button size="lg" variant="accent" leftIcon={<Mail className="w-5 h-5" />}>
                  Contact {user.fullName.split(' ')[0]} Directly
                </Button>
              </a>
            </div>
          </div>
        </section>}
      </main>

      {/* Mini Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500">
        Powered by <Link to="/" className="font-bold text-brand-blue-700 dark:text-brand-green-400">CareerLaunch</Link> — Build Your Skills. Launch Your Career.
      </footer>
    </div>
  );
};

