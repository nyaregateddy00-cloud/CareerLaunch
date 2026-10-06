import React, { useEffect, useState } from 'react';
import { Briefcase, Plus, Search, Trash2, Edit2, CheckCircle2, Building2 } from 'lucide-react';
import { deleteOpportunity, getAdminOpportunities, saveOpportunity } from '../../lib/opportunities';
import { Opportunity, OpportunityType, WorkMode, ExperienceLevel } from '../../types';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Input, Textarea } from '../../components/common/Input';
import { formatDate } from '../../lib/utils';

export const AdminOpportunitiesPage: React.FC = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOpp, setEditingOpp] = useState<Opportunity | null>(null);
  const [search, setSearch] = useState('');
  const [loadError, setLoadError] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [country, setCountry] = useState('');
  const [type, setType] = useState<OpportunityType>('Job');
  const [workMode, setWorkMode] = useState<WorkMode | null>(null);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('All Levels');
  const [salaryRange, setSalaryRange] = useState('');
  const [deadline, setDeadline] = useState('');
  const [description, setDescription] = useState('');
  const [applicationUrl, setApplicationUrl] = useState('');
  const [source, setSource] = useState('');
  const [requirementsText, setRequirementsText] = useState('');
  const [tagsText, setTagsText] = useState('');
  const [status, setStatus] = useState<Opportunity['status']>('draft');

  const loadData = async () => {
    try {
      setOpportunities(await getAdminOpportunities());
      setLoadError(null);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Could not load opportunity listings.');
    }
  };

  useEffect(() => { void loadData(); }, []);

  const openAddModal = () => {
    setEditingOpp(null);
    setTitle('');
    setCompany('');
    setLocation('');
    setCountry('');
    setType('Job');
    setWorkMode(null);
    setExperienceLevel('All Levels');
    setSalaryRange('');
    setDeadline('');
    setDescription('');
    setApplicationUrl('');
    setSource(''); setRequirementsText(''); setTagsText(''); setStatus('draft');
    setIsModalOpen(true);
  };

  const openEditModal = (opp: Opportunity) => {
    setEditingOpp(opp);
    setTitle(opp.title);
    setCompany(opp.company);
    setLocation(opp.location);
    setCountry(opp.country);
    setType(opp.type);
    setWorkMode(opp.workMode || 'Hybrid');
    setExperienceLevel(opp.experienceLevel);
    setSalaryRange(opp.salaryRange || '');
    setDeadline(opp.deadline || '');
    setDescription(opp.description);
    setApplicationUrl(opp.applicationUrl || '');
    setSource(opp.source || ''); setRequirementsText(opp.requirements.join(', ')); setTagsText(opp.tags.join(', ')); setStatus(opp.status);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !company.trim() || !location.trim() || !country.trim() || !source.trim()) return;

    const oppToSave: Opportunity = {
      id: editingOpp?.id || `opp-${Date.now()}`,
      title,
      company,
      location,
      country,
      type,
      workMode,
      experienceLevel,
      salaryRange,
      currency: 'KES',
      deadline: deadline || undefined,
      description,
      requirements: requirementsText.split(',').map((item) => item.trim()).filter(Boolean),
      tags: tagsText.split(',').map((item) => item.trim()).filter(Boolean),
      applicationUrl: applicationUrl || undefined,
      source,
      status,
      createdAt: editingOpp?.createdAt || new Date().toISOString(),
    };

    try {
      const saved = await saveOpportunity(oppToSave);
      setOpportunities((current) => [saved, ...current.filter((item) => item.id !== saved.id)]);
      setLoadError(null);
      setIsModalOpen(false);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Could not save the opportunity. Check the Supabase admin policy and schema.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this opportunity?')) {
      try {
        await deleteOpportunity(id);
        setOpportunities((current) => current.filter((opportunity) => opportunity.id !== id));
      } catch (error) {
        setLoadError(error instanceof Error ? error.message : 'Could not delete the opportunity.');
      }
    }
  };

  const filteredOpps = opportunities.filter((o) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return o.title.toLowerCase().includes(q) || o.company.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Briefcase className="w-7 h-7 text-brand-green-500" />
            Opportunity Management ({opportunities.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">Manage opportunity listings. Confirm details with the original publisher before changing a draft to published.</p>
        </div>

        <Button size="sm" variant="accent" onClick={openAddModal} leftIcon={<Plus className="w-4 h-4" />}>
          Post New Opportunity
        </Button>
      </div>

      {loadError && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200">{loadError}</p>}

      {/* Search Filter */}
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by title or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue-500"
        />
      </div>

      {/* Table Card */}
      <Card className="p-0 overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Opportunity Title</th>
                <th className="px-6 py-3.5">Company</th>
                <th className="px-6 py-3.5">Type & Mode</th>
                <th className="px-6 py-3.5">Salary / Stipend</th>
                <th className="px-6 py-3.5">Deadline</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredOpps.map((opp) => (
                <tr key={opp.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-850/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900 dark:text-white">{opp.title}</div>
                    <div className="text-[11px] text-slate-400">{opp.location}</div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200">
                    {opp.company}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Badge variant="blue" size="sm">{opp.type}</Badge>
                      <Badge variant="outline" size="sm">{opp.workMode}</Badge>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-brand-green-600 dark:text-brand-green-400">
                    {opp.salaryRange || 'Competitive'}
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {opp.deadline ? formatDate(opp.deadline) : 'Open'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(opp)}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(opp.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingOpp ? 'Edit Opportunity' : 'Post New Opportunity'}
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Opportunity Title"
            required
            placeholder="e.g. Graduate Software Engineer"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Company / Employer"
              required
              placeholder="e.g. Safaricom PLC"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
            <Input
              label="Location"
              required
              placeholder="City, region, remote, or specify in description"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <Input label="Country" required placeholder="Country where this opportunity is available" value={country} onChange={(e) => setCountry(e.target.value)} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as OpportunityType)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs focus:outline-none"
              >
                <option value="Job">Job</option>
                <option value="Internship">Internship</option>
                <option value="Attachment">Attachment</option>
                <option value="Graduate Program">Graduate Program</option>
                <option value="Scholarship">Scholarship</option>
                <option value="Freelance">Freelance</option>
                <option value="Competition">Competition</option>
                <option value="Fellowship">Fellowship</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Volunteering">Volunteering</option>
                <option value="Event">Event</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Work Mode
              </label>
              <select
                value={workMode}
                onChange={(e) => setWorkMode((e.target.value || null) as WorkMode | null)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs focus:outline-none"
              >
                <option value="">Not specified</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Experience
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value as ExperienceLevel)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs focus:outline-none"
              >
                <option value="Student/Intern">Student/Intern</option>
                <option value="Entry Level">Entry Level</option>
                <option value="Mid Level">Mid Level</option>
                <option value="Senior Level">Senior Level</option>
                <option value="All Levels">All Levels / Not specified</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Salary / Monthly Stipend"
              placeholder="e.g. KES 140,000 / mo"
              value={salaryRange}
              onChange={(e) => setSalaryRange(e.target.value)}
            />
            <Input
              label="Application Deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>

          <Input
            label="Application Link"
            placeholder="https://company.com/careers/..."
            value={applicationUrl}
            onChange={(e) => setApplicationUrl(e.target.value)}
          />

          <Input label="Original source / publisher" required placeholder="Employer careers page, scholarship provider, event organizer…" value={source} onChange={(e) => setSource(e.target.value)} />

          <Textarea label="Requirements (comma-separated)" rows={2} value={requirementsText} onChange={(e) => setRequirementsText(e.target.value)} placeholder="Enter only requirements stated by the original publisher" />
          <Input label="Tags (comma-separated)" value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="Optional search tags" />

          <Textarea
            label="Description & Responsibilities"
            rows={4}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div><label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">Listing status</label><select value={status} onChange={(event) => setStatus(event.target.value as Opportunity['status'])} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-900"><option value="draft">Draft — not visible to candidates</option><option value="published">Published — visible in the catalog</option><option value="closed">Closed</option></select></div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingOpp ? 'Save Changes' : status === 'published' ? 'Publish listing' : 'Save draft'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

