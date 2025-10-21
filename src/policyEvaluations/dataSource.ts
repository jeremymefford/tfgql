import type { AxiosInstance } from "axios";
import { gatherAsyncGeneratorPromises, streamPages } from "../common/streamPages";
import { PolicyEvaluation, PolicyEvaluationFilter, PolicyEvaluationResponse } from "./types";
import { policyEvaluationMapper } from "./mapper";
import { RequestCache } from "../common/requestCache";
import { evaluateWhereClause } from "../common/filtering/filtering";
import { isNotFound } from "../common/http";

export class PolicyEvaluationsAPI {
  constructor(
    private readonly httpClient: AxiosInstance,
    private readonly requestCache: RequestCache,
  ) { }

  async listPolicyEvaluations(
    taskStageId: string,
    filter?: PolicyEvaluationFilter,
  ): Promise<PolicyEvaluation[]> {
    const all: PolicyEvaluation[] = await this.requestCache.getOrSet<PolicyEvaluation[]>
    (
      "PolicyEvaluations:list",
      taskStageId,
      async () => {
        return gatherAsyncGeneratorPromises(streamPages<PolicyEvaluation, PolicyEvaluationFilter>(
          this.httpClient,
          `/task-stages/${taskStageId}/policy-evaluations`,
          policyEvaluationMapper,
          undefined,
        ))
      }
    );
    if (filter) {
      return all.filter((pe) => evaluateWhereClause(filter, pe));
    }
    return all;
  }

  async getPolicyEvaluation(id: string): Promise<PolicyEvaluation | null> {
    return this.requestCache.getOrSet<PolicyEvaluation | null>(
      "PolicyEvaluations:get",
      id,
      async () => {
        try {
          const response = await this.httpClient.get<PolicyEvaluationResponse>(
            `/policy-evaluations/${id}`
          );
          return policyEvaluationMapper.map(response.data.data);
        } catch (error) {
          if (isNotFound(error)) {
            return null;
          }
          throw error;
        }
      },
    );
  }
}
