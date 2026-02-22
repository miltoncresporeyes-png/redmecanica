const cache: Map<string, { data: any; timestamp: number }> = new Map();

const DEFAULT_TTL = 5 * 60 * 1000;

export const cacheService = {
  get<T>(key: string, ttl: number = DEFAULT_TTL): T | null {
    const item = cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > ttl) {
      cache.delete(key);
      return null;
    }
    
    return item.data as T;
  },

  set<T>(key: string, data: T): void {
    cache.set(key, { data, timestamp: Date.now() });
  },

  delete(key: string): void {
    cache.delete(key);
  },

  clear(): void {
    cache.clear();
  },

  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern);
    for (const key of cache.keys()) {
      if (regex.test(key)) {
        cache.delete(key);
      }
    }
  },
};

export default cacheService;
