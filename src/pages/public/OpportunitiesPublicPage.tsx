import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { OpportunityFilterBar } from '../../components/opportunities/OpportunityFilterBar';
import { OpportunityCard } from '../../components/opportunities/OpportunityCard';
import { OpportunityDetailModal } from '../../components/opportunities/OpportunityDetailModal';
import { EmptyState } from '../../components/common/EmptyState';
import { mockStorage } from '../../lib/mockStorage';
import { Opportunity } from '../../types';
import { Search } from 'lucide-react';
import { Footer } from '../../components/layout/Footer';

export const OpportunitiesPublicPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialType = searchParams.get('type') || 'All';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>(initialType);
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>('All');
  const [selectedExp, setSelectedExp] = useState<string>('All');
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [savedOppIds, setSavedOppIds] = useState<string[]>(() => mockStorage.getSavedOpportunityIds());

  const allOpportunities = mockStorage.getOpportunities();

  const filteredOpportunities = useMemo(() => {
    return allOpportunities.filter((opp) => {
      if (opp.status !== 'published') return false;

      // Search Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = opp.title.toLowerCase().includes(q);
        const matchesCompany = opp.company.toLowerCase().includes(q);
        const matchesTags = opp.tags.some(t => t.toLowerCase().includes(q));
        const matchesDesc = opp.description.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCompany && !matchesTags && !matchesDesc) return false;
      }

      // Type filter
      if (selectedType !== 'All' && opp.type !== selectedType) return false;

      // Work Mode filter
      if (selectedWorkMode !== 'All' && opp.workMode !== selectedWorkMode) return false;

      // Experience Level filter
      if (selectedExp !== 'All' && opp.experienceLevel !== selectedExp) return false;

      return true;
    });
  }, [allOpportunities, searchQuery, selectedType, selectedWorkMode, selectedExp]);

  const handleToggleSave = (id: string) => {
    mockStorage.toggleSaveOpportunity(id);
    setSavedOppIds(mockStorage.getSavedOpportunityIds());
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedType('All');
    setSelectedWorkMode('All');
    setSelectedExp('All');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex-1 space-y-8">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Find Verified Career Opportunities
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Explore industrial attachments, graduate developer intakes, pan-African scholarships, and global remote freelance contracts.
          </p>
        </div>

        {/* Filter Bar */}
        <OpportunityFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedType={selectedType}
          onTypeChange={(t) => {
            setSelectedType(t);
            setSearchParams(t !== 'All' ? { type: t } : {});
          }}
          selectedWorkMode={selectedWorkMode}
          onWorkModeChange={setSelectedWorkMode}
          selectedExp={selectedExp}
          onExpChange={setSelectedExp}
          onClearFilters={handleClearFilters}
          totalCount={filteredOpportunities.length}
        />

        {/* Grid List */}
        {filteredOpportunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOpportunities.map((opp) => (
              <OpportunityCard
                key={opp.id}
                opportunity={opp}
                isSaved={savedOppIds.includes(opp.id)}
                onToggleSave={handleToggleSave}
                onSelect={(o) => setSelectedOpp(o)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Search className="w-6 h-6" />}
            title="No opportunities match your filters"
            description="Try loosening your search keywords or switching your type / work mode filters to explore more listings."
            actionText="Reset All Filters"
            onAction={handleClearFilters}
          />
        )}
      </div>

      <OpportunityDetailModal
        opportunity={selectedOpp}
        isOpen={Boolean(selectedOpp)}
        onClose={() => setSelectedOpp(null)}
        isSaved={selectedOpp ? savedOppIds.includes(selectedOpp.id) : false}
        onToggleSave={handleToggleSave}
      />

      <Footer />
    </div>
  );
};

