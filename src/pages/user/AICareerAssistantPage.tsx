import React from 'react';
import { AIChatWindow } from '../../components/ai/AIChatWindow';
import { PageHeader } from '../../components/common/PageHeader';
import { Badge } from '../../components/common/Badge';

export const AICareerAssistantPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="CareerLaunch AI Assistant"
        subtitle="Contextual career guidance, interview simulations, and application refinement for African tech markets."
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
