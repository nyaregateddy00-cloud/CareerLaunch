import React, { useState } from 'react';
import {
  MapPin,
  Calendar,
  Building2,
  ExternalLink,
  Bookmark,
  CheckCircle2,
  Sparkles,
  Layers
} from 'lucide-react';
import { Opportunity } from '../../types';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { formatDate, fireCelebrationConfetti } from '../../lib/utils';
import { mockStorage } from '../../lib/mockStorage';
import { useAuth } from '../../context/AuthContext';

interface OpportunityDetailModalProps {
  opportunity: Opportunity | null;
  isOpen: boolean;
  onClose: () => void;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
}

export const OpportunityDetailModal: React.FC<OpportunityDetailModalProps> = ({
  opportunity,
  isOpen,
  onClose,
  isSaved = false,
  onToggleSave,
}) => {
  const { user } = useAuth();
  const [tracked, setTracked] = useState(false);

  if (!opportunity) return null;

  const handleTrackApplication = () => {
    if (!user) return;
    mockStorage.saveApplication({
      id: `app-${Date.now()}`,
      userId: user.id,
      opportunityId: opportunity.id,
      company: opportunity.company,
      position: opportunity.title,
      stage: 'Applied',
      dateApplied: new Date().toISOString().split('T')[0],
      deadline: opportunity.deadline,
      salary: opportunity.salaryRange,
      jobUrl: opportunity.applicationUrl,
      notes: `Tracked directly from CareerLaunch opportunity discovery. Source: ${opportunity.source}.`,
      updatedAt: new Date().toISOString(),
    });
    setTracked(true);
    fireCelebrationConfetti();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={opportunity.title} maxWidth="2xl">
      <div className="space-y-6">
        {/* Header with Company Logo & Quick Details */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            {opportunity.companyLogo ? (
              <img
                src={opportunity.companyLogo}
                alt={opportunity.company}
                className="w-16 h-16 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-brand-blue-50 dark:bg-brand-blue-950 flex items-center justify-center text-brand-blue-700 dark:text-brand-blue-300">
                <Building2 className="w-8 h-8" />
              </div>
            )}
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">{opportunity.company}</h4>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5" />
                {opportunity.location}, {opportunity.country}
              </p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Badge variant="blue" size="sm">{opportunity.type}</Badge>
                <Badge variant="green" size="sm">{opportunity.workMode}</Badge>
                <Badge variant="outline" size="sm">{opportunity.experienceLevel}</Badge>
              </div>
            </div>
          </div>

          <button
            onClick={() => onToggleSave?.(opportunity.id)}
            className={`p-2 rounded-xl border transition-colors ${
              isSaved
                ? 'bg-brand-green-50 dark:bg-brand-green-950/60 border-brand-green-300 text-brand-green-600 dark:text-brand-green-400'
                : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-brand-green-500' : ''}`} />
          </button>
        </div>

        {/* Highlights: Compensation, Deadline, Source */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-100 dark:border-slate-800">
          <div>
            <div className="text-[11px] font-medium text-slate-400 uppercase">Estimated Compensation</div>
            <div className="text-sm font-bold text-brand-green-600 dark:text-brand-green-400 mt-0.5">
              {opportunity.salaryRange || 'Competitive Stipend'}
            </div>
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-400 uppercase">Application Deadline</div>
            <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {opportunity.deadline ? formatDate(opportunity.deadline) : 'Rolling Basis'}
            </div>
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-400 uppercase">Source Verification</div>
            <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-green-500" />
              {opportunity.source}
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-2">
            Role Overview
          </h5>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
            {opportunity.description}
          </p>
        </div>

        {/* Requirements */}
        {opportunity.requirements && opportunity.requirements.length > 0 && (
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-2.5">
              Key Requirements & Qualifications
            </h5>
            <ul className="space-y-2">
              {opportunity.requirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-green-500 mt-2 flex-shrink-0" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tags */}
        <div className="pt-2">
          <div className="flex flex-wrap gap-1.5">
            {opportunity.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Action CTAs */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Button
            variant="secondary"
            size="md"
            onClick={handleTrackApplication}
            disabled={tracked}
            leftIcon={<Layers className="w-4 h-4 text-brand-blue-700 dark:text-brand-blue-400" />}
            className="w-full sm:w-auto"
          >
            {tracked ? 'Tracked in Applications ✓' : 'Add to Application Tracker'}
          </Button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {opportunity.applicationUrl && (
              <a
                href={opportunity.applicationUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto"
              >
                <Button
                  variant="accent"
                  size="md"
                  rightIcon={<ExternalLink className="w-4 h-4" />}
                  className="w-full sm:w-auto"
                >
                  Apply on Employer Site
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

