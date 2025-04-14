import { evaluateWhereClause } from "./filtering/filtering";
import { WhereClause } from "./filtering/types";
import { applicationConfiguration } from "./conf";

export async function batchResourceFetch<T, R, RFilter>(
  resources: T[],
  operation: (resource: T) => Promise<R>,
  filter?: WhereClause<R, RFilter>
): Promise<R[]> {
  const results: R[] = [];
  const batchSize = applicationConfiguration.graphqlBatchSize;

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
