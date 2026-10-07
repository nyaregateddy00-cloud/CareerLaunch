import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { OpportunityFilterBar } from '../../components/opportunities/OpportunityFilterBar';
import { OpportunityCard } from '../../components/opportunities/OpportunityCard';
import { OpportunityDetailModal } from '../../components/opportunities/OpportunityDetailModal';
import { EmptyState } from '../../components/common/EmptyState';
import { mockStorage } from '../../lib/mockStorage';
import { getCachedPublishedOpportunities, getPublishedOpportunities, invalidatePublishedOpportunitiesCache } from '../../lib/opportunities';
import { Opportunity } from '../../types';
import { Search, Sparkles, BookmarkPlus, ShieldCheck, Bell, BellOff, Trash2 } from 'lucide-react';
import { Footer } from '../../components/layout/Footer';
import { useAuth } from '../../context/AuthContext';
import { matchOpportunityToProfile } from '../../lib/opportunities';
import { deleteSavedOpportunitySearch, getSavedOpportunitySearches, SavedOpportunitySearch, saveOpportunitySearch, setSavedSearchAlerts } from '../../lib/opportunitySearches';
import { useToast } from '../../hooks/useToast';
import { isSupabaseConfigured } from '../../lib/supabase';

export const OpportunitiesPublicPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialType = searchParams.get('type') || 'All';
  const initialCountry = searchParams.get('country') || 'All';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>(initialType);
  const [selectedCountry, setSelectedCountry] = useState<string>(initialCountry);
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>('All');
  const [selectedExp, setSelectedExp] = useState<string>('All');
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [savedOppIds, setSavedOppIds] = useState<string[]>(() => mockStorage.getSavedOpportunityIds());
  const [allOpportunities, setAllOpportunities] = useState<Opportunity[]>(() => getCachedPublishedOpportunities() ?? []);
  const [isLoading, setIsLoading] = useState(() => getCachedPublishedOpportunities() === null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'closing' | 'match'>('newest');
  const [savedSearches, setSavedSearches] = useState<SavedOpportunitySearch[]>([]);

  useEffect(() => {
    setSelectedType(searchParams.get('type') || 'All');
    setSelectedCountry(searchParams.get('country') || 'All');
  }, [searchParams]);

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

  useEffect(() => {
    if (!user) { setSavedSearches([]); return; }
    let active = true;
    void getSavedOpportunitySearches(user.id).then((items) => { if (active) setSavedSearches(items); });
    return () => { active = false; };
  }, [user]);

  const filteredOpportunities = useMemo(() => {
    const filtered = allOpportunities.filter((opp) => {
      if (opp.status !== 'published') return false;
      if (verifiedOnly && opp.verificationStatus !== 'verified') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = opp.title.toLowerCase().includes(q);
        const matchesCompany = opp.company.toLowerCase().includes(q);
        const matchesTags = opp.tags.some(t => t.toLowerCase().includes(q));
        const matchesDesc = opp.description.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCompany && !matchesTags && !matchesDesc) return false;
      }

      if (selectedType !== 'All' && opp.type !== selectedType) return false;
      if (selectedCountry !== 'All' && opp.country.toLowerCase() !== selectedCountry.toLowerCase()) return false;
      if (selectedWorkMode !== 'All' && opp.workMode !== selectedWorkMode) return false;
      if (selectedExp !== 'All' && opp.experienceLevel !== selectedExp) return false;

      return true;
    });
    const scores = new Map(filtered.map((opportunity) => [opportunity.id, matchOpportunityToProfile(opportunity, user)?.score ?? -1]));
    return [...filtered].sort((a, b) => {
      if (sortBy === 'match' && user) return (scores.get(b.id) ?? -1) - (scores.get(a.id) ?? -1);
      if (sortBy === 'closing') return (a.deadline ? new Date(a.deadline).getTime() : Number.MAX_SAFE_INTEGER) - (b.deadline ? new Date(b.deadline).getTime() : Number.MAX_SAFE_INTEGER);
      return new Date(b.discoveredAt ?? b.createdAt).getTime() - new Date(a.discoveredAt ?? a.createdAt).getTime();
    });
  }, [allOpportunities, searchQuery, selectedType, selectedCountry, selectedWorkMode, selectedExp, verifiedOnly, sortBy, user]);

  const saveCurrentSearch = async () => {
    if (!user) return;
    const label = [searchQuery.trim(), selectedType !== 'All' ? selectedType : '', selectedCountry !== 'All' ? selectedCountry : '', selectedWorkMode !== 'All' ? selectedWorkMode : ''].filter(Boolean).join(' · ') || 'All opportunities';
    const savedTo = await saveOpportunitySearch(user.id, {
      label: label.slice(0, 80),
      filters: { query: searchQuery.trim(), type: selectedType, country: selectedCountry, workMode: selectedWorkMode, experienceLevel: selectedExp },
      alertsEnabled: true,
    });
    setSavedSearches(await getSavedOpportunitySearches(user.id));
    showToast(savedTo === 'account'
      ? 'Search saved to your account. In-app alerts are created when an administrator publishes a matching opportunity.'
      : 'Search saved in this browser. Apply the latest database migration to sync it to your account and enable alerts.', savedTo === 'account' ? 'success' : 'info');
  };

  const toggleSearchAlert = async (search: SavedOpportunitySearch) => {
    if (!user) return;
    const next = !search.alertsEnabled;
    setSavedSearches((items) => items.map((item) => item.label === search.label ? { ...item, alertsEnabled: next } : item));
    const synced = await setSavedSearchAlerts(user.id, search, next);
    if (!synced && isSupabaseConfigured) showToast('Alert preference could not sync to your account. Apply the latest migration and retry.', 'error');
  };

  const removeSearch = async (search: SavedOpportunitySearch) => {
    if (!user) return;
    setSavedSearches((items) => items.filter((item) => item.label !== search.label));
    const synced = await deleteSavedOpportunitySearch(user.id, search);
    if (!synced && isSupabaseConfigured) showToast('Saved search could not sync to your account. Apply the latest migration and retry.', 'error');
  };

  const opportunityMatches = useMemo(() => new Map(
    allOpportunities.map((opportunity) => [opportunity.id, matchOpportunityToProfile(opportunity, user)])
  ), [allOpportunities, user]);

  const handleToggleSave = (id: string) => {
    const isNewlySaved = !savedOppIds.includes(id);
    mockStorage.toggleSaveOpportunity(id);
    setSavedOppIds(mockStorage.getSavedOpportunityIds());
    const opportunity = allOpportunities.find((item) => item.id === id);
    if (isNewlySaved && user && opportunity) mockStorage.addNotification({
      userId: user.id,
      title: 'Opportunity saved',
      message: `${opportunity.title} at ${opportunity.company} was added to your saved list. Check the original listing for updates.`,
      type: 'opportunity',
      actionUrl: '/saved-opportunities',
    });
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedType('All');
    setSelectedCountry('All');
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
      <div className="mx-auto w-full min-w-0 max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex-1 space-y-8">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Explore Career Opportunities
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Browse the listings currently published in CareerLaunch. Confirm eligibility, requirements, deadlines, and application details with each original source.
          </p>
        </div>

        {user && savedSearches.length > 0 && <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"><div className="mb-3 flex items-center justify-between"><h2 className="text-sm font-bold text-slate-900 dark:text-white">Saved opportunity alerts</h2><span className="text-[11px] text-slate-500">In-app notifications when matching listings are published</span></div><div className="flex flex-wrap gap-2">{savedSearches.map((search) => <div key={search.label} className="inline-flex max-w-full items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800"><span className="max-w-[200px] truncate text-xs font-medium text-slate-700 dark:text-slate-300">{search.label}</span><button type="button" onClick={() => void toggleSearchAlert(search)} className="rounded-md p-1 text-slate-500 hover:bg-white hover:text-brand-blue-700 dark:hover:bg-slate-700" aria-label={`${search.alertsEnabled ? 'Turn off' : 'Turn on'} alerts for ${search.label}`}>{search.alertsEnabled ? <Bell className="h-3.5 w-3.5" /> : <BellOff className="h-3.5 w-3.5" />}</button><button type="button" onClick={() => void removeSearch(search)} className="rounded-md p-1 text-slate-400 hover:bg-white hover:text-rose-600 dark:hover:bg-slate-700" aria-label={`Remove ${search.label}`}><Trash2 className="h-3.5 w-3.5" /></button></div>)}</div></div>}

        <OpportunityFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedType={selectedType}
          onTypeChange={(t) => {
            setSelectedType(t);
            const next = new URLSearchParams(searchParams);
            if (t === 'All') next.delete('type'); else next.set('type', t);
            setSearchParams(next);
          }}
          selectedWorkMode={selectedWorkMode}
          onWorkModeChange={setSelectedWorkMode}
          selectedExp={selectedExp}
          onExpChange={setSelectedExp}
          onClearFilters={handleClearFilters}
          totalCount={filteredOpportunities.length}
          selectedCountry={selectedCountry}
          additionalCountries={[...new Set(allOpportunities.map((opportunity) => opportunity.country))]}
          onCountryChange={(country) => {
            setSelectedCountry(country);
            const next = new URLSearchParams(searchParams);
            if (country === 'All') next.delete('country'); else next.set('country', country);
            setSearchParams(next);
          }}
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
            {user && <button
              type="button"
              aria-pressed={sortBy === 'match'}
              onClick={() => setSortBy((value) => value === 'match' ? 'newest' : 'match')}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${sortBy === 'match' ? 'border-brand-green-500 bg-brand-green-50 text-brand-green-800 dark:bg-brand-green-950/50 dark:text-brand-green-300' : 'border-slate-200 bg-white text-slate-600 hover:border-brand-green-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'}`}
            >
              <Sparkles className="h-4 w-4" />
              {sortBy === 'match' ? 'Showing best matches' : 'Sort by best match'}
            </button>}
            <button type="button" aria-pressed={verifiedOnly} onClick={() => setVerifiedOnly((value) => !value)} className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${verifiedOnly ? 'border-brand-green-500 bg-brand-green-50 text-brand-green-800 dark:bg-brand-green-950/50 dark:text-brand-green-300' : 'border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'}`}><ShieldCheck className="h-4 w-4" /> Verified only</button>
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value as typeof sortBy)} aria-label="Sort opportunities" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"><option value="newest">Newest</option><option value="closing">Closing soon</option>{user && <option value="match">Best match</option>}</select>
            {user && <button type="button" onClick={() => void saveCurrentSearch()} className="inline-flex items-center gap-2 rounded-xl border border-brand-blue-200 bg-white px-4 py-2 text-sm font-semibold text-brand-blue-700 hover:bg-brand-blue-50 dark:border-slate-700 dark:bg-slate-900 dark:text-brand-green-300"><BookmarkPlus className="h-4 w-4" /> Save search & alert</button>}
            </div>
            {user && sortBy === 'match' && <p className="text-xs text-slate-500 dark:text-slate-400">Heuristic text estimates use profile details, recorded skills, and location. They are not employer match scores.</p>}
          </div>

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
                matchScore={opportunityMatches.get(opp.id)?.score}
                matchedSkills={opportunityMatches.get(opp.id)?.matchedSkills}
                matchExplanation={opportunityMatches.get(opp.id)?.explanation}
                potentialGaps={opportunityMatches.get(opp.id)?.potentialGaps}
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
