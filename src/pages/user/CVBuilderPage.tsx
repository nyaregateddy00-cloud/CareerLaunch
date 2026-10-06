import React, { useState } from 'react';
import { FileText, Save, CheckCircle2, Sparkles } from 'lucide-react';
import { mockStorage } from '../../lib/mockStorage';
import { CVData, CVTemplateId } from '../../types';
import { CVEditor } from '../../components/cv/CVEditor';
import { CVPreview } from '../../components/cv/CVPreview';
import { Button } from '../../components/common/Button';
import { PageHeader } from '../../components/common/PageHeader';
import { Badge } from '../../components/common/Badge';
import { useToast } from '../../hooks/useToast';
import { fireCelebrationConfetti } from '../../lib/utils';
import { aiService } from '../../lib/aiService';

export const CVBuilderPage: React.FC = () => {
  const { showToast } = useToast();
  const [cvDoc, setCvDoc] = useState(() => mockStorage.getCV());
  const [templateId, setTemplateId] = useState<CVTemplateId>(cvDoc.templateId || 'modern-navy');
  const [cvData, setCvData] = useState<CVData>(cvDoc.content);
  const [aiReview, setAiReview] = useState('');
  const [aiReviewError, setAiReviewError] = useState('');
  const [reviewing, setReviewing] = useState(false);

  const reviewWithAI = async () => {
    if (reviewing) return;
    setReviewing(true); setAiReview(''); setAiReviewError('');
    const reviewData = {
      summary: cvData.summary,
      experience: cvData.experience.map(({ position, company, description }) => ({ position, company, description })),
      education: cvData.education.map(({ institution, degree, fieldOfStudy }) => ({ institution, degree, fieldOfStudy })),
      skills: cvData.skills.map(({ skillName, proficiencyLevel }) => ({ skillName, proficiencyLevel })),
      projects: cvData.projects.map(({ title, description, tags }) => ({ title, description, tags })),
      certifications: cvData.certifications.map(({ name, issuer }) => ({ name, issuer })),
    };
    const response = await aiService.sendMessage(
      `Review this CV for clarity, structure, relevance, and evidence. Give up to five specific improvements. Preserve every fact, do not invent metrics, qualifications, or experience, and say when more information is needed. This is a practical editorial review, not an ATS score.\n\nCV content:\n${JSON.stringify(reviewData).slice(0, 4800)}`,
      [], 'improve_cv',
    );
    setReviewing(false);
    if (response.success) setAiReview(response.content);
    else setAiReviewError(response.error || 'The CV review is unavailable.');
  };

  const handleDataChange = (updated: CVData) => {
    setCvData(updated);
  };

  const handleSave = () => {
    const updatedDoc = {
      ...cvDoc,
      templateId,
      content: cvData,
      updatedAt: new Date().toISOString(),
    };
    mockStorage.saveCV(updatedDoc);
    setCvDoc(updatedDoc);
    fireCelebrationConfetti();
    showToast('CV document saved successfully!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="no-print">
        <PageHeader
          title="Interactive CV Builder"
          subtitle="Build a clear CV from your saved profile details, then review it before you apply."
          breadcrumbs={[{ label: 'CV Builder' }]}
          badge={
            <Badge variant="blue" size="sm">
              Live Preview
            </Badge>
          }
          action={
            <Button
              size="md"
              variant="primary"
              onClick={handleSave}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save CV
            </Button>
          }
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="font-bold text-slate-900 dark:text-white">CV completeness checklist</h2>
          <p className="mt-1 text-xs text-slate-500">Checks whether common sections contain saved information; it does not assess hiring or ATS outcomes.</p>
          <div className="mt-3 flex flex-wrap gap-2">{[
            ['Summary', Boolean(cvData.summary.trim())], ['Experience or projects', cvData.experience.length > 0 || cvData.projects.length > 0],
            ['Skills', cvData.skills.length > 0], ['Education', cvData.education.length > 0],
          ].map(([label, complete]) => <span key={String(label)} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs ${complete ? 'border-brand-green-200 text-brand-green-800 dark:border-brand-green-900 dark:text-brand-green-300' : 'border-slate-200 text-slate-500 dark:border-slate-700'}`}><CheckCircle2 className="h-3.5 w-3.5" />{String(label)}{complete ? ' added' : ' to add'}</span>)}</div>
        </div>
        <div className="flex flex-col justify-center gap-2"><Button variant="secondary" onClick={reviewWithAI} disabled={reviewing} leftIcon={<Sparkles className="h-4 w-4" />}>{reviewing ? 'Reviewing…' : 'Review with AI'}</Button><p className="max-w-xs text-[10px] leading-4 text-slate-500">Sends CV content without your contact details to the configured AI provider when you request a review.</p></div>
      </div>
      {aiReviewError && <p role="alert" className="text-sm text-rose-600">{aiReviewError}</p>}
      {aiReview && <div className="whitespace-pre-wrap rounded-2xl border border-brand-green-200 bg-brand-green-50 p-5 text-sm leading-6 text-slate-800 dark:border-brand-green-900 dark:bg-brand-green-950/30 dark:text-slate-100"><h2 className="mb-2 font-bold">Career Coach CV feedback</h2>{aiReview}</div>}

      {/* Split Pane: Left Editor, Right Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: CV Editor Form (hidden on print) */}
        <div className="no-print lg:col-span-5 h-[800px]">
          <CVEditor cvData={cvData} onChange={handleDataChange} />
        </div>

        {/* Right: Live Formatted Preview (visible on print) */}
        <div className="lg:col-span-7 h-[800px]">
          <CVPreview
            cvData={cvData}
            templateId={templateId}
            onTemplateChange={setTemplateId}
          />
        </div>
      </div>
    </div>
  );
};
