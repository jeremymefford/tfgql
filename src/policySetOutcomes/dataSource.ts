import type { AxiosInstance } from "axios";
import { streamPages } from "../common/streamPages";
import { PolicySetOutcome } from "./types";
import { policySetOutcomeMapper } from "./mapper";

export class PolicySetOutcomesAPI {
  constructor(private readonly httpClient: AxiosInstance) {}

  async *listPolicySetOutcomes(
    policyEvaluationId: string,
  ): AsyncGenerator<PolicySetOutcome[], void, unknown> {
    yield* streamPages<PolicySetOutcome, undefined>(
      this.httpClient,
      `/policy-evaluations/${policyEvaluationId}/policy-set-outcomes`,
      policySetOutcomeMapper,
    );
  }
}
