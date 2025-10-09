import type { AxiosInstance } from "axios";
import { streamPages } from "../common/streamPages";
import { PolicySetParameter, PolicySetParameterFilter } from "./types";
import { policySetParameterMapper } from "./mapper";

export class PolicySetParametersAPI {
  constructor(private readonly httpClient: AxiosInstance) {}

  async *listPolicySetParameters(
    policySetId: string,
    filter?: PolicySetParameterFilter,
  ): AsyncGenerator<PolicySetParameter[]> {
    yield* streamPages<PolicySetParameter, PolicySetParameterFilter>(
      this.httpClient,
      `/policy-sets/${policySetId}/parameters`,
      policySetParameterMapper,
      undefined,
      filter,
    );
  }
}
