import { evaluateWhereClause } from "./filtering/filtering";
import { WhereClause } from "./filtering/types";

export async function batchResourceFetch<T, R>(
  resources: T[],
  operation: (resource: T) => Promise<R>,
  filter?: WhereClause<R>,
  batchSize = 10
): Promise<R[]> {
  const results: R[] = [];

  for (let i = 0; i < resources.length; i += batchSize) {
    const batch = resources.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(operation));
    const filteredResults = filter
      ? batchResults.filter(item => evaluateWhereClause(filter, item))
      : batchResults;
    results.push(...filteredResults);
  }

  return results;
}
