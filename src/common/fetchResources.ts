import { evaluateWhereClause } from "./filtering/filtering";
import { WhereClause } from "./filtering/types";
import { applicationConfiguration } from "./conf";

export async function* streamResources<T, R, RFilter>(
  resources: Iterable<T>,
  operation: (resource: T) => Promise<R>,
  filter?: WhereClause<R, RFilter>
): AsyncGenerator<R> {
  const maxConcurrency = applicationConfiguration.graphqlBatchSize;
  const inflight = new Set<Promise<void>>();
  const resultsQueue: R[] = [];
  const resourceIterator = resources[Symbol.iterator]();

  const dispatch = (item: T, index: number) => {
    const p = operation(item)
      .then(result => {
        if (!filter || evaluateWhereClause(filter, result)) {
          resultsQueue.push(result);
        }
      })
      .finally(() => {
        inflight.delete(p);
      });
    inflight.add(p);
  };

  let index = 0;
  let next = resourceIterator.next();

  while (!next.done || inflight.size > 0 || resultsQueue.length > 0) {
    while (!next.done && inflight.size < maxConcurrency) {
      dispatch(next.value, index++);
      next = resourceIterator.next();
    }

    while (resultsQueue.length > 0) {
      const result = resultsQueue.shift()!;
      yield result;
    }

    if (inflight.size > 0) {
      await Promise.race(inflight);
    }
  }

}

export async function fetchResources<T, R, RFilter>(
  resources: Iterable<T>,
  operation: (resource: T) => Promise<R | null>,
  filter?: WhereClause<R, RFilter>
): Promise<R[]> {
  const results: R[] = [];
  for await (const item of streamResources(resources, operation, filter)) {
    if (item === null) {
      continue;
    }
    results.push(item);
  }
  return results;
}