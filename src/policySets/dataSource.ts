import type { AxiosInstance } from "axios";
import { isNotFound } from "../common/http";
import { streamPages } from "../common/streamPages";
import { PolicySet, PolicySetFilter, PolicySetResponse } from "./types";
import { policySetMapper } from "./mapper";
import { RequestCache } from "../common/requestCache";

export class PolicySetsAPI {
  constructor(
    private readonly httpClient: AxiosInstance,
    private readonly requestCache: RequestCache,
  ) {}

  async listPolicySets(
    organization: string,
    filter?: PolicySetFilter,
  ): Promise<PolicySet[]> {
    const valueFactory: () => Promise<PolicySet[]> = async () => {
      const all: PolicySet[] = [];
      for await (const page of streamPages<PolicySet, PolicySetFilter>(
        this.httpClient,
        `/organizations/${organization}/policy-sets`,
        policySetMapper,
        undefined,
        filter,
      )) {
        all.push(...page);
      }
      return all;
    };

    if (!filter) {
      return this.requestCache.getOrSet(
        "PolicySets:list",
        organization,
        valueFactory,
      );
    }

    return valueFactory();
  }

  async getPolicySet(id: string): Promise<PolicySet | null> {
    return this.requestCache.getOrSet<PolicySet | null>(
      "PolicySets:get",
      id,
      async () =>
        this.httpClient
          .get<PolicySetResponse>(`/policy-sets/${id}`)
          .then((res) => policySetMapper.map(res.data.data))
          .catch((err) => {
            if (isNotFound(err)) {
              return null;
            }
            throw err;
          }),
    );
  }
}
