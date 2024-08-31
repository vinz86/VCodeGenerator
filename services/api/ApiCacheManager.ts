interface CacheEntry {
    timestamp: number;
    data: any;
}

export class ApiCacheManager {
    private static instance: ApiCacheManager;
    private cache: Map<string, CacheEntry> = new Map();
    private cacheDuration: number = 5 * 60 * 1000; // 5 minuti di durata della cache

    private constructor(cacheDuration?: number) {
        if (cacheDuration) this.cacheDuration = cacheDuration;
    }

    public static getInstance(cacheDuration?: number): ApiCacheManager {
        if (!ApiCacheManager.instance) {
            ApiCacheManager.instance = cacheDuration ? new ApiCacheManager(cacheDuration) : new ApiCacheManager();
        }
        return ApiCacheManager.instance;
    }

    public get(key: string): any | null {
        const entry = this.cache.get(key);
        if (entry && (Date.now() - entry.timestamp) < this.cacheDuration) {
            return entry.data;
        }
        return null;
    }

    public set(key: string, data: any): void {
        this.cache.set(key, {
            timestamp: Date.now(),
            data: data
        });
    }

    public clear(): void {
        this.cache.clear();
    }
}
