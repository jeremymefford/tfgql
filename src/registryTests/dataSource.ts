import type { AxiosInstance } from "axios";
import { isNotFound } from "../common/http";
import { streamPages } from "../common/streamPages";
import {
  RegistryTestRun,
  RegistryTestRunFilter,
  RegistryTestRunResponse,
  RegistryTestVariable,
  RegistryTestVariableFilter,
} from "./types";
import { registryTestRunMapper, registryTestVariableMapper } from "./mapper";
import { RequestCache } from "../common/requestCache";

function testBasePath(
  organization: string,
  namespace: string,
  name: string,
  provider: string,
): string {
  return `/organizations/${organization}/tests/registry-modules/private/${namespace}/${name}/${provider}`;
}

export class RegistryTestsAPI {
  constructor(
    private readonly httpClient: AxiosInstance,
    private readonly requestCache: RequestCache,
  ) {}

  async *listRegistryTestRuns(
    organization: string,
    namespace: string,
    name: string,
    provider: string,
    filter?: RegistryTestRunFilter,
  ): AsyncGenerator<RegistryTestRun[], void, unknown> {
    yield* streamPages<RegistryTestRun, RegistryTestRunFilter>(
      this.httpClient,
      `${testBasePath(organization, namespace, name, provider)}/test-runs`,
      registryTestRunMapper,
      undefined,
      filter,
    );
  }

  async getRegistryTestRun(
    organization: string,
    namespace: string,
    name: string,
    provider: string,
    testRunId: string,
  ): Promise<RegistryTestRun | null> {
    const cacheKey = `${organization}:${namespace}:${name}:${provider}:${testRunId}`;
    return this.requestCache.getOrSet<RegistryTestRun | null>(
      "registryTestRun",
      cacheKey,
      async () =>
        this.httpClient
          .get<RegistryTestRunResponse>(
            `${testBasePath(organization, namespace, name, provider)}/test-runs/${testRunId}`,
          )
          .then((res) => registryTestRunMapper.map(res.data.data))
          .catch((err) => {
            if (isNotFound(err)) {
              return null;
            }
            throw err;
          }),
    );
  }

  async *listRegistryTestVariables(
    organization: string,
    namespace: string,
    name: string,
    provider: string,
    filter?: RegistryTestVariableFilter,
  ): AsyncGenerator<RegistryTestVariable[], void, unknown> {
    yield* streamPages<RegistryTestVariable, RegistryTestVariableFilter>(
      this.httpClient,
      `${testBasePath(organization, namespace, name, provider)}/vars`,
      registryTestVariableMapper,
      undefined,
      filter,
    );
  }
}
