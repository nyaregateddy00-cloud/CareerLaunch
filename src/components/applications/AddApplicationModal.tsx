import React, { useState, useEffect } from 'react';
import { JobApplication, ApplicationStage } from '../../types';
import { Modal } from '../common/Modal';
import { Input, Textarea } from '../common/Input';
import { Button } from '../common/Button';

interface AddApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (app: JobApplication) => void;
  initialApplication?: JobApplication | null;
  userId: string;
}

const STAGES: ApplicationStage[] = ['Saved', 'Applied', 'Shortlisted', 'Interview', 'Offer', 'Rejected'];
const STAGES: ApplicationStage[] = ['Saved', 'Applied', 'Shortlisted', 'Assessment', 'Interview', 'Offer', 'Rejected', 'Withdrawn'];

export const AddApplicationModal: React.FC<AddApplicationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialApplication,
  userId,
}) => {
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [stage, setStage] = useState<ApplicationStage>('Applied');
  const [dateApplied, setDateApplied] = useState('');
  const [deadline, setDeadline] = useState('');
  const [salary, setSalary] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialApplication) {
      setCompany(initialApplication.company || '');
      setPosition(initialApplication.position || '');
      setStage(initialApplication.stage || 'Applied');
      setDateApplied(initialApplication.dateApplied || '');
      setDeadline(initialApplication.deadline || '');
      setSalary(initialApplication.salary || '');
      setJobUrl(initialApplication.jobUrl || '');
      setInterviewDate(initialApplication.interviewDate ? initialApplication.interviewDate.split('T')[0] : '');
      setFollowUpDate(initialApplication.followUpDate || '');
      setNotes(initialApplication.notes || '');
    } else {
      setCompany('');
      setPosition('');
      setStage('Applied');
      setDateApplied(new Date().toISOString().split('T')[0]);
      setDeadline('');
      setSalary('');
      setJobUrl('');
      setInterviewDate('');
      setFollowUpDate('');
      setNotes('');
    }
  }, [initialApplication, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !position.trim()) return;

    onSave({
      id: initialApplication?.id || `app-${Date.now()}`,
      userId,
      company: company.trim(),
      position: position.trim(),
      stage,
      dateApplied: dateApplied || new Date().toISOString().split('T')[0],
      deadline: deadline || undefined,
      salary: salary || undefined,
      jobUrl: jobUrl || undefined,
      interviewDate: interviewDate ? `${interviewDate}T10:00:00Z` : undefined,
      followUpDate: followUpDate || undefined,
      notes: notes || undefined,
      updatedAt: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialApplication ? 'Edit Application' : 'Add Opportunity Application'}
      subtitle="Track your applications systematically from submission to offer"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Company / Employer"
            required
            placeholder="e.g. Safaricom PLC, Equity Bank"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
          <Input
            label="Position / Role"
            required
            placeholder="e.g. Software Engineer, Attachment"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Pipeline Stage
            </label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value as ApplicationStage)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue-500"
            >
              {STAGES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <Input
            label="Date Applied"
            type="date"
            value={dateApplied}
            onChange={(e) => setDateApplied(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Salary / Stipend Range"
            placeholder="e.g. KES 140,000 / mo or $2,000"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          />
          <Input
            label="Deadline / Expiry"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>

        {stage === 'Interview' && (
          <Input
            label="Interview Scheduled Date"
            type="date"
            value={interviewDate}
            onChange={(e) => setInterviewDate(e.target.value)}
            helperText="Set a date to see reminders on your dashboard"
          />
        )}

        {(stage === 'Assessment' || stage === 'Interview' || stage === 'Shortlisted' || stage === 'Applied') && (
          <Input
            label="Follow-up Reminder Date"
            type="date"
            value={followUpDate}
            onChange={(e) => setFollowUpDate(e.target.value)}
            helperText="Get a dashboard nudge to follow up on this date"
          />
        )}

        <Input
          label="Job Posting URL"
          placeholder="https://company.com/careers/..."
          value={jobUrl}
          onChange={(e) => setJobUrl(e.target.value)}
        />

        <Textarea
          label="Notes / Referral / Follow-up Strategy"
          rows={3}
          placeholder="Key contacts, interview prep notes, referral code, or questions to ask..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {initialApplication ? 'Save Changes' : 'Add Application'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

