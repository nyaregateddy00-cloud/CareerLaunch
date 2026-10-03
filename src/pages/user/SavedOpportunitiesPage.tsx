import React, { useState, useEffect } from 'react';
import { Bookmark, Search } from 'lucide-react';
import { mockStorage } from '../../lib/mockStorage';
import { Opportunity } from '../../types';
import { OpportunityCard } from '../../components/opportunities/OpportunityCard';
import { OpportunityDetailModal } from '../../components/opportunities/OpportunityDetailModal';
import { EmptyState } from '../../components/common/EmptyState';
import { PageHeader } from '../../components/common/PageHeader';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { useToast } from '../../hooks/useToast';
import { Link } from 'react-router-dom';

export const SavedOpportunitiesPage: React.FC = () => {
  const { showToast } = useToast();
  const [savedIds, setSavedIds] = useState<string[]>(() => mockStorage.getSavedOpportunityIds());
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);

  const loadData = () => {
    const ids = mockStorage.getSavedOpportunityIds();
    setSavedIds(ids);
    const all = mockStorage.getOpportunities();
    setOpportunities(all.filter((o) => ids.includes(o.id)));
  };

  useEffect(() => {
    loadData();
    window.addEventListener('careerlaunch_storage_change', loadData);
    return () => window.removeEventListener('careerlaunch_storage_change', loadData);
  }, []);

  const handleToggleSave = (id: string) => {
    const wasSaved = savedIds.includes(id);
    mockStorage.toggleSaveOpportunity(id);
    loadData();
    showToast(
      wasSaved ? 'Removed from saved opportunities' : 'Saved opportunity bookmark',
      'info'
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Saved Opportunities"
        subtitle="Opportunities bookmarked for review, customized CV tailoring, and application submission."
        breadcrumbs={[{ label: 'Saved Opportunities' }]}
        badge={
          <Badge variant="amber" size="sm">
            {opportunities.length} Saved
          </Badge>
        }
      />

      {opportunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              isSaved={true}
              onToggleSave={handleToggleSave}
              onSelect={(o) => setSelectedOpp(o)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Bookmark className="w-8 h-8 text-amber-500" />}
          title="No saved opportunities yet"
          description="Browse thousands of jobs, internships, and scholarships across Kenya and Africa to save roles for later."
          action={
            <Link to="/opportunities">
              <Button size="sm" variant="primary">
                Browse Opportunities
              </Button>
            </Link>
          }
        />
      )}

      <OpportunityDetailModal
        opportunity={selectedOpp}
        isOpen={Boolean(selectedOpp)}
        onClose={() => setSelectedOpp(null)}
        isSaved={selectedOpp ? savedIds.includes(selectedOpp.id) : false}
        onToggleSave={handleToggleSave}
      />
    </div>
  );
};
