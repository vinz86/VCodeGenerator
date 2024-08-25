interface CacheEntry {
    timestamp: number;
    data: any;
}

export class CacheManager {
    private static instance: CacheManager;
    private cache: Map<string, CacheEntry> = new Map();
    private cacheDuration: number = 5 * 60 * 1000; // 5 minuti di durata della cache

    private constructor(cacheDuration?: number) {
        if (cacheDuration) this.cacheDuration = cacheDuration;
    }

    public static getInstance(cacheDuration?: number): CacheManager {
        if (!CacheManager.instance) {
            CacheManager.instance = cacheDuration ? new CacheManager(cacheDuration) : new CacheManager();
        }
        return CacheManager.instance;
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
