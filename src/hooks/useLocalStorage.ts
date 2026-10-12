import { useState, useEffect, useCallback } from 'react';

/**
 * A reactive hook that syncs state with localStorage and listens for
 * careerlaunch_storage_change custom events dispatched by mockStorage.
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
  selector?: (stored: T) => T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      const parsed = item ? (JSON.parse(item) as T) : defaultValue;
      return selector ? selector(parsed) : parsed;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    const handleChange = (e: Event) => {
      const custom = e as CustomEvent<{ key?: string }>;
      if (!custom.detail?.key || custom.detail.key === key) {
        try {
          const item = localStorage.getItem(key);
          const parsed = item ? (JSON.parse(item) as T) : defaultValue;
          setState(selector ? selector(parsed) : parsed);
        } catch {
          setState(defaultValue);
        }
      }
    };
    window.addEventListener('careerlaunch_storage_change', handleChange);
    return () => window.removeEventListener('careerlaunch_storage_change', handleChange);
  }, [key, defaultValue, selector]);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setState((prev) => {
        const next = typeof value === 'function' ? (value as (p: T) => T)(prev) : value;
        try {
          localStorage.setItem(key, JSON.stringify(next));
          window.dispatchEvent(
            new CustomEvent('careerlaunch_storage_change', { detail: { key } })
          );
        } catch (e) {
          console.error('useLocalStorage: write error', e);
        }
        return next;
      });
    },
    [key]
  );

  return [state, setValue];
}

