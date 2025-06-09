import { axiosClient } from '../common/httpClient';
import { streamPages } from '../common/streamPages';
import {
  PolicySetParameter,
  PolicySetParameterFilter,
  PolicySetParameterResponse
} from './types';
import { policySetParameterMapper } from './mapper';

export class PolicySetParametersAPI {
  async *listPolicySetParameters(filter?: PolicySetParameterFilter): AsyncGenerator<
    PolicySetParameter[],
    void,
    unknown
  > {
    yield* streamPages<PolicySetParameter, PolicySetParameterFilter>(
      `/policy-set-parameters`,
      policySetParameterMapper,
      undefined,
      filter
    );
  }

  async getPolicySetParameter(id: string): Promise<PolicySetParameter> {
    const res = await axiosClient.get<PolicySetParameterResponse>(`/policy-set-parameters/${id}`);
    return policySetParameterMapper.map(res.data.data);
  }
}