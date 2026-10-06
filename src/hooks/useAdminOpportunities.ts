import { useCallback, useEffect, useState } from 'react';
import { getAdminOpportunities } from '../lib/opportunities';
import { Opportunity } from '../types';

export function useAdminOpportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setOpportunities(await getAdminOpportunities());
    } catch {
      setError('Opportunity records could not be loaded. Check your connection and access, then retry.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { void reload(); }, [reload]);
  return { opportunities, isLoading, error, reload };
}
