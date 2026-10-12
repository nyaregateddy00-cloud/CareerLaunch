import React from 'react';
import { BarChart3, TrendingUp, Users, Globe, Building2, Sparkles, Download } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { mockStorage } from '../../lib/mockStorage';

export const AdminAnalyticsPage: React.FC = () => {
  const stats = mockStorage.getAdminStats();

  const universityStats = [
    { name: 'University of Nairobi (UoN)', count: 3200, pct: '26%' },
    { name: 'Jomo Kenyatta University (JKUAT)', count: 2850, pct: '23%' },
    { name: 'Strathmore University & iLab', count: 2100, pct: '17%' },
    { name: 'Moringa School Bootcamp', count: 1950, pct: '16%' },
    { name: 'Kenyatta University (KU)', count: 1400, pct: '11%' },
    { name: 'USIU-Africa & Others', count: 900, pct: '7%' },
  ];

  const topSkills = [
    { skill: 'React & TypeScript', count: '4,820 candidates', demand: 'High' },
    { skill: 'Python (FastAPI / Pandas)', count: '4,150 candidates', demand: 'High' },
    { skill: 'Node.js & Express', count: '3,700 candidates', demand: 'High' },
    { skill: 'SQL & Database Architecture', count: '3,450 candidates', demand: 'Very High' },
    { skill: 'Figma & Mobile UX Design', count: '2,800 candidates', demand: 'High' },
    { skill: 'Docker & Cloud Deployment', count: '2,200 candidates', demand: 'Surging' },
  ];

  const topEmployers = [
    { company: 'Safaricom PLC', activeRoles: 14, applications: 1840 },
    { company: 'Equity Group Holdings', activeRoles: 8, applications: 1220 },
    { company: 'Microsoft ADC Nairobi', activeRoles: 6, applications: 980 },
    { company: 'Andela Africa', activeRoles: 11, applications: 890 },
    { company: 'KCB Bank Kenya', activeRoles: 5, applications: 750 },
  ];

  const handleExportCSV = () => {
    alert('Exporting Platform Analytics CSV for Q3 2026...');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-7 h-7 text-brand-blue-700 dark:text-brand-blue-400" />
            Platform Analytics & Regional Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time analytics across candidate demographics, university talent pipelines, and employer demand.
          </p>
        </div>

        <Button size="sm" variant="secondary" onClick={handleExportCSV} leftIcon={<Download className="w-4 h-4" />}>
          Export Analytics CSV
        </Button>
      </div>

      {/* Grid: University Pipeline & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* University Talent Pipeline */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">University Talent Pipeline</h3>
              <p className="text-xs text-slate-500">Candidate representation by higher learning institution</p>
            </div>
            <Users className="w-5 h-5 text-brand-blue-700" />
          </div>

          <div className="space-y-3">
            {universityStats.map((uni, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{uni.name}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{uni.count.toLocaleString()} ({uni.pct})</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-2 rounded-full bg-brand-blue-700 dark:bg-brand-blue-500"
                    style={{ width: uni.pct }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Category Representation */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Talent Discipline Distribution</h3>
              <p className="text-xs text-slate-500">Professional focus areas across verified candidates</p>
            </div>
            <Sparkles className="w-5 h-5 text-brand-green-500" />
          </div>

          <div className="space-y-3">
            {stats.categoryDistribution.map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{cat.category}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{cat.count.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-2 rounded-full bg-brand-green-500"
                    style={{ width: `${(cat.count / 4200) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom Grid: In-Demand Skills & Top Employers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* In-Demand Skills */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Top Technical Competencies</h3>
              <p className="text-xs text-slate-500">Most listed skills on candidate CVs</p>
            </div>
            <Sparkles className="w-5 h-5 text-purple-500" />
          </div>

          <div className="space-y-2.5">
            {topSkills.map((s, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">{s.skill}</span>
                  <div className="text-[11px] text-slate-400">{s.count}</div>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-brand-green-100 text-brand-green-800 dark:bg-brand-green-950 dark:text-brand-green-300">
                  {s.demand}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Employers Activity */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Top Hiring Organizations</h3>
              <p className="text-xs text-slate-500">Application volume by partner employer</p>
            </div>
            <Building2 className="w-5 h-5 text-brand-blue-600" />
          </div>

          <div className="space-y-2.5">
            {topEmployers.map((emp, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">{emp.company}</span>
                  <div className="text-[11px] text-slate-400">{emp.activeRoles} active postings</div>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-brand-blue-700 dark:text-brand-green-400">
                    {emp.applications.toLocaleString()}
                  </span>
                  <div className="text-[10px] text-slate-400">applications received</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

