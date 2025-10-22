import { applicationConfiguration } from "./conf";
import { logger } from "./logger";

export class RequestCache {
  private cache: Map<string, unknown>;
  private readonly maxSize;
  private inFlight: Map<string, Promise<unknown>>;

  constructor() {
    this.cache = new Map();
    this.maxSize = applicationConfiguration.requestCacheMaxSize;
    this.inFlight = new Map();
  }

  genKey(entityType: string, id: string): string {
    return `${entityType}:${id}`;
  }

  async set<T>(entityType: string, id: string, value: T): Promise<T> {
    if (value === null || value === undefined) {
      return value;
    }
    const key = this.genKey(entityType, id);

    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }

    this.cache.set(key, value);

    return value;
  }

  async getOrSet<T>(
    entityType: string,
    id: string,
    valueFactory: () => Promise<T>,
  ): Promise<T> {
    const key = this.genKey(entityType, id);

    if (this.cache.has(key)) {
      logger.debug({ key }, "Cache hit");
      return this.cache.get(key) as T;
    }

    if (this.inFlight.has(key)) {
      logger.debug({ key }, "Awaiting in-flight value");
      return this.inFlight.get(key) as Promise<T>;
    }

    const valuePromise: Promise<T> = valueFactory()
      .then((value) => {
        this.set(entityType, id, value);
        return value;
      })
      .finally(() => this.inFlight.delete(key));

    this.inFlight.set(key, valuePromise);
    return valuePromise;
  }
}
