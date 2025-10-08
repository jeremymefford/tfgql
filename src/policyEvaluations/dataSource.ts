import type { AxiosInstance } from 'axios';
import { streamPages } from '../common/streamPages';
import { PolicyEvaluation, PolicyEvaluationFilter, PolicyEvaluationResponse } from './types';
import { policyEvaluationMapper } from './mapper';

export class PolicyEvaluationsAPI {
  constructor(private readonly httpClient: AxiosInstance) {}

  async *listPolicyEvaluations(taskStageId: string, filter?: PolicyEvaluationFilter): AsyncGenerator<PolicyEvaluation[], void, unknown> {
    yield* streamPages<PolicyEvaluation, PolicyEvaluationFilter>(
      this.httpClient,
      `/task-stages/${taskStageId}/policy-evaluations`,
      policyEvaluationMapper,
      undefined,
      filter
    );
  }

}
