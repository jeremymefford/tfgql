export async function parallelizeBounded<T, R>(
  iterableItems: Iterable<T>,
  concurrency: number,
  operation: (item: T) => Promise<R>
): Promise<R[]> {
  const items = Array.isArray(iterableItems) ? iterableItems : Array.from(iterableItems);
  const results: R[] = new Array(items.length);
  const inflight = new Set<Promise<void>>();
  let i = 0;

  function schedule(index: number, item: T) {
    const p = operation(item)
      .then((result) => {
        results[index] = result;
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
  return results;
}