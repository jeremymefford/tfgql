import { streamPages } from '../common/streamPages';
import {
  PolicySetParameter,
  PolicySetParameterFilter
} from './types';
import { policySetParameterMapper } from './mapper';

export class PolicySetParametersAPI {
  async *listPolicySetParameters(policySetId: string, filter?: PolicySetParameterFilter): AsyncGenerator<PolicySetParameter[]> {
    yield* streamPages<PolicySetParameter, PolicySetParameterFilter>(
      `/policy-sets/${policySetId}/parameters`,
      policySetParameterMapper,
      undefined,
      filter
    );
  }
}