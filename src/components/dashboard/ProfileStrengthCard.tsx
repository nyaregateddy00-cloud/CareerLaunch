import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Circle, ArrowRight, Sparkles } from 'lucide-react';
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

    return { strengthScore: user.profileStrength || score, checklist: items };
  }, [user]);

  const incompleteItems = checklist.filter((item) => !item.completed);
  const displayItems =
    incompleteItems.length > 0 ? incompleteItems.slice(0, 3) : checklist.slice(0, 3);

  return (
    <div className="bg-gradient-to-br from-brand-blue-900 to-brand-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-card relative overflow-hidden">
      {/* Background visual decoration */}
      <div className="absolute right-0 top-0 w-80 h-80 bg-brand-green-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-green-500/20 text-brand-green-300 border border-brand-green-500/30">
            <Sparkles className="w-3.5 h-3.5 text-brand-green-400" />
            <span>Profile Strength Optimization</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Your Profile Strength: <span className="text-brand-green-400">{strengthScore}%</span>
          </h2>

          <p className="text-xs sm:text-sm text-brand-blue-200 leading-relaxed">
            Profiles above 80% strength receive 4x more direct outreach from recruiters at Safaricom,
            Equity, Andela, and regional tech startups.
          </p>

          <div className="w-full bg-brand-blue-800/80 rounded-full h-3 overflow-hidden mt-3">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-brand-green-400 to-emerald-300 transition-all duration-700"
              style={{ width: `${strengthScore}%` }}
            />
          </div>
        </div>

        {/* Action recommendations list */}
        <div className="bg-brand-blue-950/80 backdrop-blur-sm border border-brand-blue-800/80 rounded-2xl p-5 min-w-[280px] sm:min-w-[320px] space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-brand-blue-300">
            {incompleteItems.length > 0 ? 'Recommended Next Steps' : 'All Milestones Completed!'}
          </h4>
          <div className="space-y-2">
            {displayItems.map((item, idx) => (
              <Link
                key={idx}
                to={item.link}
                className="flex items-center justify-between text-xs py-1.5 px-2 rounded-lg hover:bg-white/5 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  {item.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-brand-green-400 flex-shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-brand-blue-400 flex-shrink-0" />
                  )}
                  <span
                    className={`${
                      item.completed
                        ? 'text-brand-blue-200 line-through opacity-80'
                        : 'text-white font-medium'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-brand-blue-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
