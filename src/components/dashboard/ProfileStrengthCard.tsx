import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { UserProfile } from '../../types';
import { mockStorage } from '../../lib/mockStorage';
import { calculateProfileStrength } from '../../lib/utils';

interface ProfileStrengthCardProps {
  user: UserProfile;
}

export const ProfileStrengthCard: React.FC<ProfileStrengthCardProps> = ({ user }) => {
  const { strengthScore, checklist } = useMemo(() => {
    const edu = mockStorage.getEducation().filter((e) => e.userId === user.id);
    const exp = mockStorage.getExperience().filter((e) => e.userId === user.id);
    const skills = mockStorage.getUserSkills().filter((s) => s.userId === user.id);
    const projects = mockStorage.getProjects().filter((p) => p.userId === user.id);
    const portfolio = mockStorage.getPortfolio();

    const { score } = calculateProfileStrength(user, skills, exp, edu, projects);

    const items = [
      {
        label: 'Add university / college education',
        completed: edu.length > 0,
        link: '/profile',
      },
      {
        label: 'List your attachment or work experience',
        completed: exp.length > 0,
        link: '/profile',
      },
      {
        label: 'Add at least 3 technical or professional skills',
        completed: skills.length >= 3,
        link: '/skills',
      },
      {
        label: 'Showcase at least 1 project with demo or GitHub link',
        completed: projects.length > 0,
        link: '/profile',
      },
      {
        label: 'Generate your professional CV in the CV Builder',
        completed: Boolean(user.headline && user.headline.length > 5),
        link: '/cv-builder',
      },
      {
        label: 'Publish your shareable public portfolio (/u/username)',
        completed: Boolean(portfolio.isPublished),
        link: '/portfolio-builder',
      },
    ];

    return { strengthScore: score, checklist: items };
  }, [user]);

  const incompleteItems = checklist.filter((item) => !item.completed);
  const displayItems =
    incompleteItems.length > 0 ? incompleteItems.slice(0, 3) : checklist.slice(0, 3);

  return (
    <div className="bg-brand-blue-900 dark:bg-[#0c1a30] text-white rounded-xl p-6 sm:p-7 shadow-xs border border-brand-blue-800/80 dark:border-white/10 relative overflow-hidden">
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-lg">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-brand-green-500/20 text-brand-green-300 border border-brand-green-500/30">
            <span>Profile Completion</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Profile Strength: <span className="text-brand-green-400">{strengthScore}%</span>
          </h2>

          <p className="text-xs sm:text-sm text-brand-blue-100 dark:text-slate-300 leading-relaxed">
            A complete profile helps you generate stronger CVs and present your qualifications cleanly to employers.
          </p>

          <div className="w-full bg-brand-blue-950 dark:bg-black/40 rounded-full h-2 overflow-hidden mt-3 border border-white/10">
            <div
              className="h-2 rounded-full bg-brand-green-500 transition-all duration-500"
              style={{ width: `${strengthScore}%` }}
            />
          </div>
        </div>

        {/* Action recommendations list */}
        <div className="bg-brand-blue-950/90 dark:bg-[#111111] border border-brand-blue-800/80 dark:border-white/10 rounded-lg p-4 min-w-[280px] sm:min-w-[320px] space-y-2">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-brand-blue-200 dark:text-slate-400">
            {incompleteItems.length > 0 ? 'Recommended next steps' : 'Profile checklist'}
          </h4>
          <div className="space-y-1.5">
            {displayItems.map((item, idx) => (
              <Link
                key={idx}
                to={item.link}
                className="flex items-center justify-between text-xs py-1 px-1.5 rounded hover:bg-white/5 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  {item.completed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-green-400 shrink-0" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  )}
                  <span
                    className={`${
                      item.completed
                        ? 'text-brand-blue-200/70 line-through'
                        : 'text-white font-medium'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-brand-blue-300 dark:text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
