import { applicationConfiguration } from "../conf";

export async function parallelizeBounded<T, R>(
  iterableItems: Iterable<T>,
  operation: (item: T) => Promise<R>,
  concurrency: number = applicationConfiguration.graphqlBatchSize,
): Promise<R[]> {
  const items = Array.isArray(iterableItems)
    ? iterableItems
    : Array.from(iterableItems);
  const results: R[] = new Array(items.length);
  const inflight = new Set<Promise<void>>();
  const errors: unknown[] = [];
  let i = 0;
  // Logging: bounded parallel processing can be tricky; emit minimal debug
  // Lazy import to avoid circular import at module top
  const { logger } = await import("../logger");
  logger.debug(
    { total: items.length, concurrency },
    "parallelizeBounded start",
  );

  function schedule(index: number, item: T) {
    const p = operation(item)
      .then((result) => {
        results[index] = result;
      })
      .catch((err) => {
        errors.push(err);
      })
      .finally(() => {
        inflight.delete(p);
      });
    inflight.add(p);
    return p;
  }

  for (; i < items.length; i++) {
    if (inflight.size >= concurrency) {
      await Promise.race(inflight);
    }
    schedule(i, items[i]);
  }

  await Promise.all(inflight);

  if (errors.length > 0) {
    throw errors[0];
  }

  logger.debug({ total: items.length }, "parallelizeBounded complete");
  return results;
}
