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

  async getPolicy(id: string): Promise<Policy> {
    const res = await axiosClient.get<PolicyResponse>(`/policies/${id}`);
    return policyMapper.map(res.data.data);
  }
}