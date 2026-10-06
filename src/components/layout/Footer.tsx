import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../common/Button';
import { BrandLogo } from '../branding/BrandLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="space-y-2">
              <BrandLogo to="/" />
              <p className="pl-[50px] text-xs font-medium text-slate-500 dark:text-slate-400">Build Your Skills. Launch Your Career.</p>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              A career workspace for students, graduates, freelancers, and job seekers building their next step across Africa.
            </p>
            <div className="pt-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Explore the opportunity catalog
              </p>
              <Link to="/opportunities"><Button size="sm" variant="accent">Browse opportunities</Button></Link>
            </div>
          </div>

          {/* Column: Career Platform */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Career Platform
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/opportunities" className="hover:text-brand-blue-600 dark:hover:text-brand-green-400 transition-colors">Explore Opportunities</Link></li>
              <li><Link to="/cv-builder" className="hover:text-brand-blue-600 dark:hover:text-brand-green-400 transition-colors">Interactive CV Builder</Link></li>
              <li><Link to="/portfolio-builder" className="hover:text-brand-blue-600 dark:hover:text-brand-green-400 transition-colors">Shareable Portfolio</Link></li>
              <li><Link to="/applications" className="hover:text-brand-blue-600 dark:hover:text-brand-green-400 transition-colors">Applications Tracker</Link></li>
              <li><Link to="/skills" className="hover:text-brand-blue-600 dark:hover:text-brand-green-400 transition-colors">Skill Gap Analyzer</Link></li>
              <li><Link to="/ai-assistant" className="hover:text-brand-blue-600 dark:hover:text-brand-green-400 transition-colors">CareerLaunch AI</Link></li>
            </ul>
          </div>

          {/* Column: Opportunity Types */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Opportunities
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/opportunities?type=Attachment" className="hover:text-brand-blue-600 dark:hover:text-brand-green-400 transition-colors">Attachments</Link></li>
              <li><Link to="/opportunities?type=Graduate%20Program" className="hover:text-brand-blue-600 dark:hover:text-brand-green-400 transition-colors">Graduate programs</Link></li>
              <li><Link to="/opportunities?type=Job" className="hover:text-brand-blue-600 dark:hover:text-brand-green-400 transition-colors">Jobs</Link></li>
              <li><Link to="/opportunities?type=Scholarship" className="hover:text-brand-blue-600 dark:hover:text-brand-green-400 transition-colors">Scholarships</Link></li>
              <li><Link to="/opportunities?type=Freelance" className="hover:text-brand-blue-600 dark:hover:text-brand-green-400 transition-colors">Freelance opportunities</Link></li>
              <li><Link to="/opportunities?type=Hackathon" className="hover:text-brand-blue-600 dark:hover:text-brand-green-400 transition-colors">Hackathons</Link></li>
            </ul>
          </div>

          {/* Column: Company & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Company & Help
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/about" className="hover:text-brand-blue-600 dark:hover:text-brand-green-400 transition-colors">About Us</Link></li>
              <li><Link to="/features" className="hover:text-brand-blue-600 dark:hover:text-brand-green-400 transition-colors">Features Overview</Link></li>
              <li><Link to="/resources" className="hover:text-brand-blue-600 dark:hover:text-brand-green-400 transition-colors">Learning Resources</Link></li>
              <li><Link to="/pricing" className="hover:text-brand-blue-600 dark:hover:text-brand-green-400 transition-colors">Pricing & Plans</Link></li>
              <li><Link to="/contact" className="hover:text-brand-blue-600 dark:hover:text-brand-green-400 transition-colors">Contact Support</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} CareerLaunch. “Build Your Skills. Launch Your Career.” All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

