import { axiosClient } from '../common/httpClient';
import { streamPages } from '../common/streamPages';
import { PolicyEvaluation, PolicyEvaluationFilter, PolicyEvaluationResponse } from './types';
import { policyEvaluationMapper } from './mapper';

export class PolicyEvaluationsAPI {
  async *listPolicyEvaluations(policySetId: string, filter?: PolicyEvaluationFilter): AsyncGenerator<PolicyEvaluation[], void, unknown> {
    yield* streamPages<PolicyEvaluation, PolicyEvaluationFilter>(
      `/policy-sets/${policySetId}/evaluations`,
      policyEvaluationMapper,
      undefined,
      filter
    );
  }

  async getPolicyEvaluation(id: string): Promise<PolicyEvaluation> {
    const res = await axiosClient.get<PolicyEvaluationResponse>(`/policy-evaluations/${id}`);
    return policyEvaluationMapper.map(res.data.data);
  }
}