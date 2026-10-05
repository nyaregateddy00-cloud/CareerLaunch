import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Users,
  Briefcase,
  Layers,
  Globe,
  TrendingUp,
  Plus,
  ArrowRight,
  BarChart3,
  BookOpen
} from 'lucide-react';
import { mockStorage } from '../../lib/mockStorage';
import { Opportunity } from '../../types';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export const AdminDashboardPage: React.FC = () => {
  const stats = mockStorage.getAdminStats();
  const opportunities = mockStorage.getOpportunities().slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="blue" size="sm">Admin Console</Badge>
            <span className="text-xs text-slate-400">Headquarters Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Shield className="w-7 h-7 text-brand-blue-700 dark:text-brand-blue-400" />
            Platform Administration
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Monitor user growth, verify employer opportunity listings, and manage learning resources across Africa.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/opportunities">
            <Button size="sm" variant="accent" leftIcon={<Plus className="w-4 h-4" />}>
              Add Opportunity
            </Button>
          </Link>
        </div>
      </div>

      {/* Admin Metrics Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 flex flex-col justify-between" hoverEffect>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Total Candidates</span>
            <div className="w-9 h-9 rounded-xl bg-brand-blue-50 dark:bg-brand-blue-950 text-brand-blue-700 dark:text-brand-blue-300 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats.totalUsers.toLocaleString()}
            </div>
            <div className="text-xs font-semibold text-brand-green-600 dark:text-brand-green-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+{stats.weeklyGrowthRate}% this month</span>
            </div>
          </div>
        </Card>

        <Card className="p-5 flex flex-col justify-between" hoverEffect>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Active Opportunities</span>
            <div className="w-9 h-9 rounded-xl bg-brand-green-50 dark:bg-brand-green-950 text-brand-green-700 dark:text-brand-green-300 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-brand-green-600 dark:text-brand-green-400">
              {stats.activeOpportunities}
            </div>
            <div className="text-xs text-slate-500 mt-1">Verified partner listings</div>
          </div>
        </Card>

        <Card className="p-5 flex flex-col justify-between" hoverEffect>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Applications Tracked</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats.applicationsTracked.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 mt-1">Through Kanban boards</div>
          </div>
        </Card>

        <Card className="p-5 flex flex-col justify-between" hoverEffect>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Portfolios Published</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats.totalPortfolios.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 mt-1">Live vanity /u/ URLs</div>
          </div>
        </Card>
      </div>

      {/* Grid: Left = Recent Opportunities, Right = Regional Representation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Opportunities */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Recent Opportunity Postings
            </h3>
            <Link to="/admin/opportunities" className="text-xs font-bold text-brand-blue-700 dark:text-brand-green-400 hover:underline">
              Manage All
            </Link>
          </div>

          <Card className="divide-y divide-slate-100 dark:divide-slate-800 p-0 overflow-hidden">
            {opportunities.map((opp) => (
              <div key={opp.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{opp.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{opp.company} • {opp.location} ({opp.type})</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={opp.status === 'published' ? 'green' : 'default'} size="sm">
                    {opp.status}
                  </Badge>
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* Regional Breakdown */}
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-brand-green-500" />
            Regional Candidate Distribution
          </h3>

          <Card className="p-5 space-y-3">
            {stats.regionalDistribution.map((reg, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{reg.region}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{reg.count.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-1.5 rounded-full bg-brand-blue-600 dark:bg-brand-green-500"
                    style={{ width: `${(reg.count / 14850) * 100}%` }}
                  />
                </div>
              </div>
            ))}

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <Link to="/admin/analytics">
                <Button variant="ghost" size="sm" className="w-full justify-between" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  View Full Analytics
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

