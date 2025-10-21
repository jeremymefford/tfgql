import type { AxiosInstance } from "axios";
import { gatherAsyncGeneratorPromises, streamPages } from "../common/streamPages";
import { RequestCache } from "../common/requestCache";
import { PolicyCheck, PolicyCheckFilter } from "./types";
import { evaluateWhereClause } from "../common/filtering/filtering";
import { policyCheckMapper } from "./mapper";

export class PolicyChecksAPI {
  constructor(
    private readonly httpClient: AxiosInstance,
    private readonly requestCache: RequestCache,
  ) {}

  async listPolicyChecks(
    runId: string,
    filter?: PolicyCheckFilter,
  ): Promise<PolicyCheck[]> {
    const all = await this.requestCache.getOrSet(
      "PolicyChecks:list",
      runId,
      async () =>
        gatherAsyncGeneratorPromises(
          streamPages<PolicyCheck>(
            this.httpClient,
            `/runs/${runId}/policy-checks`,
            policyCheckMapper,
          ),
        ),
    );

    const normalized = all.map((check) =>
      check.runId ? check : { ...check, runId },
    );

    if (!filter) {
      return normalized;
    }

    return normalized.filter((check) => evaluateWhereClause(filter, check));
  }
}
