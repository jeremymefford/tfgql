import type { AxiosInstance } from "axios";
import { isNotFound } from "../common/http";
import { streamPages } from "../common/streamPages";
import { Policy, PolicyFilter, PolicyResponse } from "./types";
import { policyMapper } from "./mapper";
import { RequestCache } from "../common/requestCache";

export class PoliciesAPI {
  constructor(
    private readonly httpClient: AxiosInstance,
    private readonly requestCache: RequestCache,
  ) {}

  async *listPolicies(
    orgName: string,
    filter?: PolicyFilter,
  ): AsyncGenerator<Policy[], void, unknown> {
    yield* streamPages<Policy, PolicyFilter>(
      this.httpClient,
      `/organizations/${orgName}/policies`,
      policyMapper,
      undefined,
      filter,
    );
  }

  async getPolicy(id: string): Promise<Policy | null> {
    return this.requestCache.getOrSet<Policy | null>("policy", id, async () =>
      this.httpClient
        .get<PolicyResponse>(`/policies/${id}`)
        .then((res) => policyMapper.map(res.data.data))
        .catch((err) => {
          if (isNotFound(err)) {
            return null;
          }
          throw err;
        }),
    );
  }
}
