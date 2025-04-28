import { WhereClause } from './filtering/types';
import { axiosClient } from './httpClient';
import type { ListResponse } from './types/jsonApi';
import { evaluateWhereClause } from './filtering/filtering';
import { DomainMapper } from './middleware/domainMapper';
import { applicationConfiguration } from './conf';


export async function* streamPages<T, TFilter = {}>(
  endpoint: string,
  mapper: DomainMapper<any, T>,
  params: Record<string, any> = {},
  filter?: WhereClause<T, TFilter>
): AsyncGenerator<T[], void, unknown> {
  const baseParams = { ...(params || {}), 'page[size]': applicationConfiguration.tfcPageSize};

  const firstRes = await axiosClient.get<ListResponse<T>>(endpoint, { params: baseParams });
  const pagination = firstRes.data.meta?.pagination;
  const totalPages = pagination?.['total-pages'] ?? 1;

  const firstMapped = firstRes.data.data.map(mapper.map);
  const firstFiltered = filter
    ? firstMapped.filter(item => evaluateWhereClause(filter, item))
    : firstMapped;
  yield firstFiltered;

  if (totalPages <= 1) return;

  const remainingPages = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
  const inflight = new Set<Promise<T[]>>();

  async function loadPage(page: number): Promise<T[]> {
    const res = await axiosClient.get<ListResponse<T>>(endpoint, {
      params: { ...baseParams, 'page[number]': page }
    });
    const mapped = res.data.data.map(mapper.map);
    return filter ? mapped.filter(item => evaluateWhereClause(filter, item)) : mapped;
  }

  while (remainingPages.length > 0 || inflight.size > 0) {
    while (inflight.size < applicationConfiguration.graphqlBatchSize && remainingPages.length > 0) {
      const page = remainingPages.shift()!;
      const p = loadPage(page).then(items => {
        inflight.delete(p);
        return items;
      });
      inflight.add(p);
    }

    const completed = await Promise.race(inflight);
    yield completed;
  }
}

export async function gatherAsyncGeneratorPromises<T>(
  generator: AsyncGenerator<T[]>
): Promise<Promise<T>[]> {
  const all: Promise<T>[] = [];
  for await (const batch of generator) {
    for (const item of batch) {
      all.push(Promise.resolve(item));
    }
  }
  return all;
}