import { axiosClient } from '../common/httpClient';
import { streamPages } from '../common/streamPages';
import { PolicyEvaluation, PolicyEvaluationFilter, PolicyEvaluationResponse } from './types';
import { policyEvaluationMapper } from './mapper';

export class PolicyEvaluationsAPI {
  async *listPolicyEvaluations(taskStageId: string, filter?: PolicyEvaluationFilter): AsyncGenerator<PolicyEvaluation[], void, unknown> {
    yield* streamPages<PolicyEvaluation, PolicyEvaluationFilter>(
      `/task-stages/${taskStageId}/policy-evaluations`,
      policyEvaluationMapper,
      undefined,
      filter
    );
  }

}