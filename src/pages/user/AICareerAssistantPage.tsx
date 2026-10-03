import React from 'react';
import { Bot, Sparkles, FileText, Briefcase, GraduationCap, Target } from 'lucide-react';
import { AIChatWindow } from '../../components/ai/AIChatWindow';
import { PageHeader } from '../../components/common/PageHeader';
import { Badge } from '../../components/common/Badge';

export const AICareerAssistantPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="CareerLaunch AI Assistant"
        subtitle="Your personalized AI career coach for African tech markets, CV reviews, and interview prep."
        breadcrumbs={[{ label: 'CareerLaunch AI' }]}
        badge={
          <Badge variant="green" size="sm">
            AI Assistant
          </Badge>
        }
      />

      <AIChatWindow />
    </div>
  );
};
