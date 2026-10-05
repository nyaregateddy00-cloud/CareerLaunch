import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { OpportunityFilterBar } from '../../components/opportunities/OpportunityFilterBar';
import { OpportunityCard } from '../../components/opportunities/OpportunityCard';
import { OpportunityDetailModal } from '../../components/opportunities/OpportunityDetailModal';
import { EmptyState } from '../../components/common/EmptyState';
import { mockStorage } from '../../lib/mockStorage';
import { getCachedPublishedOpportunities, getPublishedOpportunities, invalidatePublishedOpportunitiesCache } from '../../lib/opportunities';
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
  const [allOpportunities, setAllOpportunities] = useState<Opportunity[]>(() => getCachedPublishedOpportunities() ?? []);
  const [isLoading, setIsLoading] = useState(() => getCachedPublishedOpportunities() === null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let isActive = true;

    const loadOpportunities = async () => {
      try {
        const opportunities = await getPublishedOpportunities();
        if (!isActive) return;
        setAllOpportunities(opportunities);
      } catch (error) {
        if (!isActive) return;
        if (!getCachedPublishedOpportunities()) {
          setLoadError(error instanceof Error ? error.message : 'Unknown database error');
        }
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
    };

    void loadOpportunities();

    return () => {
      isActive = false;
    };
  }, [retryCount]);

  const filteredOpportunities = useMemo(() => {
    return allOpportunities.filter((opp) => {
      if (opp.status !== 'published') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = opp.title.toLowerCase().includes(q);
        const matchesCompany = opp.company.toLowerCase().includes(q);
        const matchesTags = opp.tags.some(t => t.toLowerCase().includes(q));
        const matchesDesc = opp.description.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCompany && !matchesTags && !matchesDesc) return false;
      }

      if (selectedType !== 'All' && opp.type !== selectedType) return false;
      if (selectedWorkMode !== 'All' && opp.workMode !== selectedWorkMode) return false;
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

  const handleRetry = () => {
    invalidatePublishedOpportunitiesCache();
    setLoadError(null);
    if (allOpportunities.length === 0) setIsLoading(true);
    setRetryCount((count) => count + 1);
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

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Loading opportunities">
            {[0, 1, 2].map((item) => (
              <div key={item} className="h-52 animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 motion-reduce:animate-none" />
            ))}
          </div>
        ) : loadError ? (
          <EmptyState
            icon={<Search className="w-6 h-6" />}
            title="Couldn’t load opportunities"
            description={`The opportunities database could not be reached: ${loadError}`}
            actionText="Try Again"
            onAction={handleRetry}
          />
        ) : filteredOpportunities.length > 0 ? (
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
