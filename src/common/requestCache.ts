import { applicationConfiguration } from "./conf";

export class RequestCache {
    private cache: Map<string, unknown>;
    private readonly maxSize;

    constructor() {
        this.cache = new Map();
        this.maxSize = applicationConfiguration.requestCacheMaxSize;
    }

    async getOrSet<T>(entityType: string, id: string, valueFactory: () => Promise<T>): Promise<T> {
        const key = `${entityType}:${id}`;
        if (this.cache.has(key)) {
            console.debug(`Cache hit for key: ${key}`);
            return this.cache.get(key) as T;
        }
        const valuePromise = valueFactory(); 
        if (this.cache.size >= this.maxSize) { 
            const firstKey = this.cache.keys().next().value;
            if (firstKey) {
                this.cache.delete(firstKey);
            }
        }
        try {
            const value = await valuePromise;
            this.cache.set(key, value);
            return value;
        } catch (error) {
            console.error(`Error while setting cache for key: ${key}`, error);
            throw error; 
        }
    }

}
