import { axiosClient } from '../common/httpClient';
import { streamPages } from '../common/streamPages';
import { PolicySet, PolicySetFilter, PolicySetResponse } from './types';
import { policySetMapper } from './mapper';

export class PolicySetsAPI {
  async *listPolicySets(filter?: PolicySetFilter): AsyncGenerator<PolicySet[], void, unknown> {
    yield* streamPages<PolicySet, PolicySetFilter>(
      `/policy-sets`,
      policySetMapper,
      undefined,
      filter
    );
  }

  async getPolicySet(id: string): Promise<PolicySet> {
    const res = await axiosClient.get<PolicySetResponse>(`/policy-sets/${id}`);
    return policySetMapper.map(res.data.data);
  }
}