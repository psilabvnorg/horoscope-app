import { useState, useEffect, useRef } from 'react';

interface UseAsyncDataOptions<T> {
  loader: () => Promise<T>;
  fallback: T;
  cacheKey?: string;
  dependencies?: any[];
}

// Global cache for async data
const dataCache = new Map<string, any>();

export function useAsyncData<T>({
  loader,
  fallback,
  cacheKey,
  dependencies = [],
}: UseAsyncDataOptions<T>): { data: T; loading: boolean; error: Error | null } {
  const [data, setData] = useState<T>(() => {
    // Check cache first
    if (cacheKey && dataCache.has(cacheKey)) {
      return dataCache.get(cacheKey);
    }
    return fallback;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      // Check cache first
      if (cacheKey && dataCache.has(cacheKey)) {
        if (!cancelled && mountedRef.current) {
          setData(dataCache.get(cacheKey));
        }
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await loader();
        
        if (!cancelled && mountedRef.current) {
          setData(result);
          
          // Cache the result
          if (cacheKey) {
            dataCache.set(cacheKey, result);
          }
        }
      } catch (err) {
        if (!cancelled && mountedRef.current) {
          const error = err instanceof Error ? err : new Error('Failed to load data');
          setError(error);
          setData(fallback);
        }
      } finally {
        if (!cancelled && mountedRef.current) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, dependencies);

  return { data, loading, error };
}

// Utility to clear cache
export function clearDataCache(key?: string) {
  if (key) {
    dataCache.delete(key);
  } else {
    dataCache.clear();
  }
}
