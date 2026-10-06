import React from 'react';
import { Printer, Download, Sparkles, MapPin, Mail, Phone, Globe, Linkedin, Github } from 'lucide-react';
import { CVData, CVTemplateId } from '../../types';
import { Button } from '../common/Button';
import { formatMonthYear } from '../../lib/utils';

interface CVPreviewProps {
  cvData: CVData;
  templateId: CVTemplateId;
  onTemplateChange: (t: CVTemplateId) => void;
}

export const CVPreview: React.FC<CVPreviewProps> = ({
  cvData,
  templateId,
  onTemplateChange,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const { personalInfo, summary, experience, education, skills, projects } = cvData;

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Action Controls Bar (hidden during printing) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-card">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Template:</span>
          <div className="flex items-center gap-1.5">
            {[
              { id: 'modern-navy', label: 'Modern Nairobi' },
              { id: 'executive-classic', label: 'Executive Classic' },
              { id: 'clean-minimalist', label: 'Clean Emerald' },
            ].map(tpl => (
              <button
                key={tpl.id}
                onClick={() => onTemplateChange(tpl.id as CVTemplateId)}
                className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-all ${
                  templateId === tpl.id
                    ? 'bg-brand-blue-900 dark:bg-brand-blue-600 text-white border-brand-blue-900'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {tpl.label}
              </button>
            ))}
          </div>
        </div>

        <Button
          size="sm"
          variant="accent"
          onClick={handlePrint}
          leftIcon={<Printer className="w-4 h-4" />}
        >
          Print / Download PDF
        </Button>
      </div>

      {/* Rendered CV Document Sheet */}
      <div className="flex-1 overflow-y-auto bg-slate-200 dark:bg-slate-950 p-2 sm:p-4 rounded-2xl flex justify-center">
        <div
          id="printable-cv"
          className={`cv-sheet w-full max-w-[210mm] min-h-[297mm] bg-white text-slate-900 p-8 sm:p-12 shadow-2xl rounded-xl transition-all ${
            templateId === 'modern-navy' ? 'border-t-8 border-brand-blue-900' : ''
          } ${templateId === 'clean-minimalist' ? 'border-l-8 border-brand-green-500' : ''}`}
        >
          {/* Header Section */}
          <header className={`mb-6 pb-6 border-b ${
            templateId === 'executive-classic' ? 'text-center border-slate-300' : 'border-slate-200'
          }`}>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              {personalInfo.fullName || 'Your Name'}
            </h1>
            <p className="text-sm font-semibold text-brand-blue-900 mt-1">
              {personalInfo.headline || 'Full-Stack Software Engineer'}
            </p>

            {/* Contact Pills */}
            <div className={`flex flex-wrap gap-x-4 gap-y-1.5 mt-3 text-xs text-slate-600 ${
              templateId === 'executive-classic' ? 'justify-center' : ''
            }`}>
              {personalInfo.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {personalInfo.location}
                </span>
              )}
              {personalInfo.email && (
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3 text-slate-400" />
                  {personalInfo.email}
                </span>
              )}
              {personalInfo.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  {personalInfo.phone}
                </span>
              )}
              {personalInfo.website && (
                <span className="flex items-center gap-1">
                  <Globe className="w-3 h-3 text-slate-400" />
                  {personalInfo.website}
                </span>
              )}
              {personalInfo.linkedin && (
                <span className="flex items-center gap-1">
                  <Linkedin className="w-3 h-3 text-slate-400" />
                  {personalInfo.linkedin}
                </span>
              )}
            </div>
          </header>

          {/* Professional Summary */}
          {summary && (
            <section className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-brand-blue-900 border-b border-slate-200 pb-1 mb-2">
                Professional Summary
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {summary}
              </p>
            </section>
          )}

          {/* Work Experience */}
          {experience && experience.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-brand-blue-900 border-b border-slate-200 pb-1 mb-3">
                Experience & Attachments
              </h2>
              <div className="space-y-4">
                {experience.map((exp, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between text-xs sm:text-sm">
                      <span className="font-bold text-slate-900">
                        {exp.position} <span className="font-medium text-slate-600">at {exp.company}</span>
                      </span>
                      <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                        {formatMonthYear(exp.startDate)} – {exp.isCurrent ? 'Present' : formatMonthYear(exp.endDate)}
                      </span>
                    </div>
                    {exp.location && (
                      <div className="text-[11px] text-slate-500 italic">{exp.location} • {exp.employmentType}</div>
                    )}
                    <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line mt-1">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-brand-blue-900 border-b border-slate-200 pb-1 mb-3">
                Education
              </h2>
              <div className="space-y-3">
                {education.map((edu, idx) => (
                  <div key={idx} className="space-y-0.5 text-xs sm:text-sm">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                      <span className="font-bold text-slate-900">
                        {edu.degree} in {edu.fieldOfStudy}
                      </span>
                      <span className="text-xs text-slate-500">
                        {edu.startDate ? edu.startDate.substring(0, 4) : ''} – {edu.isCurrent ? 'Present' : (edu.endDate ? edu.endDate.substring(0, 4) : '')}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600">
                      {edu.institution} {edu.grade ? `• ${edu.grade}` : ''}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Featured Projects */}
          {projects && projects.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-brand-blue-900 border-b border-slate-200 pb-1 mb-3">
                Key Projects & Proof of Work
              </h2>
              <div className="space-y-3">
                {projects.map((proj, idx) => (
                  <div key={idx} className="space-y-1 text-xs sm:text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{proj.title}</span>
                      {proj.link && <span className="text-xs text-brand-blue-600 underline">{proj.link}</span>}
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">{proj.description}</p>
                    {proj.tags && proj.tags.length > 0 && (
                      <div className="text-[11px] text-slate-500">
                        Tech: {proj.tags.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills Grid */}
          {skills && skills.length > 0 && (
            <section className="mb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-brand-blue-900 border-b border-slate-200 pb-1 mb-2.5">
                Technical & Core Competencies
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded bg-slate-100 text-slate-800 font-medium"
                  >
                    {skill.skillName}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

