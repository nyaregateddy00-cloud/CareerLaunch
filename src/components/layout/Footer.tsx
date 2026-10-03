import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Mail, Heart } from 'lucide-react';
import { Button } from '../common/Button';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-blue-900 dark:bg-brand-blue-600 flex items-center justify-center text-white">
                <Rocket className="w-5 h-5 text-brand-green-400" />
              </div>
              <span className="text-xl font-black tracking-tight text-brand-blue-900 dark:text-white">
                Career<span className="text-brand-green-500">Launch</span>
              </span>
            </Link>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              Empowering university students, graduates, freelancers, and ambitious job seekers across Kenya and Africa to build skills, create high-impact CVs, and launch rewarding careers.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-brand-blue-900 dark:text-brand-green-400">
              <span className="w-2 h-2 rounded-full bg-brand-green-500"></span>
              Headquartered in Nairobi, Kenya • Serving Pan-Africa
            </div>

            {/* Newsletter input */}
            <div className="pt-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Weekly Opportunity & Career Alerts
              </p>
              <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to weekly opportunity alerts!'); }} className="flex gap-2 max-w-sm">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue-500"
                />
                <Button size="sm" variant="accent" type="submit">
                  <Mail className="w-3.5 h-3.5" />
                  Subscribe
                </Button>
              </form>
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
              <li><Link to="/opportunities?type=Attachment" className="hover:text-brand-blue-600 dark:hover:text-brand-green-400 transition-colors">Industrial Attachments (NITA)</Link></li>
              <li><Link to="/opportunities?type=Graduate%20Program" className="hover:text-brand-blue-600 dark:hover:text-brand-green-400 transition-colors">Graduate Programs 2026</Link></li>
              <li><Link to="/opportunities?type=Job" className="hover:text-brand-blue-600 dark:hover:text-brand-green-400 transition-colors">Entry & Junior Tech Jobs</Link></li>
              <li><Link to="/opportunities?type=Scholarship" className="hover:text-brand-blue-600 dark:hover:text-brand-green-400 transition-colors">African Scholarships</Link></li>
              <li><Link to="/opportunities?type=Freelance" className="hover:text-brand-blue-600 dark:hover:text-brand-green-400 transition-colors">Remote Freelance Gigs</Link></li>
              <li><Link to="/opportunities?type=Competition" className="hover:text-brand-blue-600 dark:hover:text-brand-green-400 transition-colors">Hackathons & Grants</Link></li>
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
              <li><span className="text-slate-400 cursor-pointer hover:underline">Privacy & Terms</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} CareerLaunch. “Build Your Skills. Launch Your Career.” All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-500">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>for the future of African talent.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

