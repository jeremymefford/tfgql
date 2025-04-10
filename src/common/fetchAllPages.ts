import { WhereClause } from './filtering/types';
import { axiosClient } from './httpClient';
import type { ListResponse } from './types/jsonApi';
import { evaluateWhereClause } from './filtering/filtering';
import { DomainMapper } from './middleware/domainMapper';

export async function fetchAllPages<T, TFilter = {}>(
  endpoint: string,
  mapper: DomainMapper<any, T>,
  params: Record<string, any> = {},
  filter?: WhereClause<T, TFilter>
): Promise<T[]> {
  const baseParams = { ...(params || {}), 'page[size]': 100 };

  const firstRes = await axiosClient.get<ListResponse<T>>(endpoint, { params: baseParams });
  const firstMapped = firstRes.data.data.map(mapper.map);
  const allData = filter
    ? firstMapped.filter(item => evaluateWhereClause(filter, item))
    : firstMapped;

  const pagination = firstRes.data.meta?.pagination;
  if (!pagination || pagination['total-pages'] <= 1) {
    return allData;
  }

  const pageSize = pagination['page-size'];
  const totalPages = Math.ceil(pagination['total-count'] / pageSize);

  const BATCH_SIZE = 10;
  for (let i = 2; i <= totalPages; i += BATCH_SIZE) {
    const batchEnd = Math.min(i + BATCH_SIZE - 1, totalPages);
    const batchRequests = [];

    for (let page = i; page <= batchEnd; page++) {
      batchRequests.push(
        axiosClient.get<ListResponse<T>>(endpoint, {
          params: {
            ...baseParams,
            'page[number]': page
          }
        })
      );
    }

    const batchResponses = await Promise.all(batchRequests);
    for (const res of batchResponses) {
      const mapped = res.data.data.map(mapper.map);
      const filtered = filter
        ? mapped.filter(item => evaluateWhereClause(filter, item))
        : mapped;
      allData.push(...filtered);
    }
  }

  return allData;
}