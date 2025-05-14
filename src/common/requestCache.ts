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
        const valuePromise = valueFactory(); // start fetching the value 
        if (this.cache.size >= this.maxSize) { // check cache size and remove the oldest entry if necessary
            const firstKey = this.cache.keys().next().value;
            if (firstKey) {
                this.cache.delete(firstKey);
            }
        }
        const value = await valuePromise;
        this.cache.set(key, value);
        return value;
    }
}
