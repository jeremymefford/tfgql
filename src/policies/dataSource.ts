import { axiosClient } from '../common/httpClient';
import { isNotFound } from '../common/http';
import { streamPages } from '../common/streamPages';
import { Policy, PolicyFilter, PolicyResponse } from './types';
import { policyMapper } from './mapper';

export class PoliciesAPI {
  async *listPolicies(orgName: string, filter?: PolicyFilter): AsyncGenerator<Policy[], void, unknown> {
    yield* streamPages<Policy, PolicyFilter>(
      `/organizations/${orgName}/policies`,
      policyMapper,
      undefined,
      filter
    );
  }

  async getPolicy(id: string): Promise<Policy | null> {
    return axiosClient.get<PolicyResponse>(`/policies/${id}`)
      .then(res => policyMapper.map(res.data.data))
      .catch(err => {
        if (isNotFound(err)) {
          return null;
        }
        throw err;
      });
  }
}
