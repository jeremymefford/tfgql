import { axiosClient } from './httpClient';
import type { ListResponse } from './types/jsonApi';

export async function fetchAllPages<T>(
  endpoint: string,
  params: Record<string, any> = {}
): Promise<T[]> {
  const baseParams = { ...params, 'page[size]': 100 };

  const firstRes = await axiosClient.get<ListResponse<T>>(endpoint, { params: baseParams });
  const allData = [...firstRes.data.data];

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
      allData.push(...res.data.data);
    }
  }

  return allData;
}