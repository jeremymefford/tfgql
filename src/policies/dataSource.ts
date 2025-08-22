import { axiosClient } from '../common/httpClient';
import { streamPages } from '../common/streamPages';
import { Policy, PolicyFilter, PolicyResponse } from './types';
import { policyMapper } from './mapper';

export class PoliciesAPI {
  async *listPolicies(filter?: PolicyFilter): AsyncGenerator<Policy[], void, unknown> {
    yield* streamPages<Policy, PolicyFilter>(
      `/policies`,
      policyMapper,
      undefined,
      filter
    );
  }

  async getPolicy(id: string): Promise<Policy | null> {
    return axiosClient.get<PolicyResponse>(`/policies/${id}`)
      .then(res => policyMapper.map(res.data.data))
      .catch(err => {
        if (err.status === 404) {
          return null;
        }
        throw err;
      });
  }
}