import { axiosClient } from './httpClient';
import type { ListResponse } from './types/jsonApi';

export async function fetchAllPages<T>(
  endpoint: string,
  params: Record<string, any> = {}
): Promise<T[]> {
  const firstRes = await axiosClient.get<ListResponse<T>>(endpoint, { params });
  const allData = [...firstRes.data.data];

  const pagination = firstRes.data.meta?.pagination;
  if (!pagination || pagination['total-pages'] <= 1) {
    return allData;
  }

  const pageSize = pagination['page-size'];
  const totalPages = Math.ceil(pagination['total-count'] / pageSize);

  const requests = [];
  for (let page = 2; page <= totalPages; page++) {
    requests.push(
      axiosClient.get<ListResponse<T>>(endpoint, {
        params: {
          ...params,
          'page[number]': page,
          'page[size]': pageSize
        }
      })
    );
  }

  const responses = await Promise.all(requests);
  for (const res of responses) {
    allData.push(...res.data.data);
  }

  return allData;
}