import React, { useState } from 'react';
import { FileText, Save, CheckCircle2 } from 'lucide-react';
import { mockStorage } from '../../lib/mockStorage';
import { CVData, CVTemplateId } from '../../types';
import { CVEditor } from '../../components/cv/CVEditor';
import { CVPreview } from '../../components/cv/CVPreview';
import { Button } from '../../components/common/Button';
import { PageHeader } from '../../components/common/PageHeader';
import { Badge } from '../../components/common/Badge';
import { useToast } from '../../hooks/useToast';
import { fireCelebrationConfetti } from '../../lib/utils';

export const CVBuilderPage: React.FC = () => {
  const { showToast } = useToast();
  const [cvDoc, setCvDoc] = useState(() => mockStorage.getCV());
  const [templateId, setTemplateId] = useState<CVTemplateId>(cvDoc.templateId || 'modern-navy');
  const [cvData, setCvData] = useState<CVData>(cvDoc.content);

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
          subtitle="Real-time live preview and ATS-optimized formatting for Kenyan and multinational employers."
          breadcrumbs={[{ label: 'CV Builder' }]}
          badge={
            <Badge variant="blue" size="sm">
              ATS-Optimized
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
