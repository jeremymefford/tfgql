import { axiosClient } from '../common/httpClient';
import { isNotFound } from '../common/http';
import { streamPages } from '../common/streamPages';
import { PolicySet, PolicySetFilter, PolicySetResponse } from './types';
import { policySetMapper } from './mapper';

export class PolicySetsAPI {
  async *listPolicySets(organization: string, filter?: PolicySetFilter): AsyncGenerator<PolicySet[], void, unknown> {
    yield* streamPages<PolicySet, PolicySetFilter>(
      `/organizations/${organization}/policy-sets`,
      policySetMapper,
      undefined,
      filter
    );
  }

  async getPolicySet(id: string): Promise<PolicySet | null> {
    return axiosClient.get<PolicySetResponse>(`/policy-sets/${id}`)
      .then(res => policySetMapper.map(res.data.data))
      .catch(err => {
        if (isNotFound(err)) {
          return null;
        }
        throw err;
      });
  }
}
