import { applicationConfiguration } from "./conf";

export class RequestCache {
    private cache: Map<string, unknown>;
    private readonly maxSize;
    private inFlight: Map<string, Promise<unknown>>;

    constructor() {
        this.cache = new Map();
        this.maxSize = applicationConfiguration.requestCacheMaxSize;
        this.inFlight = new Map();
    }

    async getOrSet<T>(entityType: string, id: string, valueFactory: () => Promise<T>): Promise<T> {
        const key = `${entityType}:${id}`;
        if (this.cache.has(key)) {
            console.debug(`Cache hit for key: ${key}`);
            return this.cache.get(key) as T;
        }
        if (this.inFlight.has(key)) {
            return this.inFlight.get(key) as Promise<T>;
        }

        if (this.cache.size >= this.maxSize) {
            const firstKey = this.cache.keys().next().value;
            if (firstKey) this.cache.delete(firstKey);
        }

        const valuePromise = (async () => {
            try {
                const value = await valueFactory();
                this.cache.set(key, value);
                return value;
            } finally {
                this.inFlight.delete(key);
            }
        })();

        this.inFlight.set(key, valuePromise);
        return valuePromise;
    }

}
