import type { AxiosInstance } from "axios";
import { isNotFound } from "../common/http";
import { streamPages } from "../common/streamPages";
import {
  RegistryProviderVersion,
  RegistryProviderVersionFilter,
  RegistryProviderVersionResponse,
} from "./types";
import { registryProviderVersionMapper } from "./mapper";
import { RequestCache } from "../common/requestCache";

export class RegistryProviderVersionsAPI {
  constructor(
    private readonly httpClient: AxiosInstance,
    private readonly requestCache: RequestCache,
  ) {}

  async *listRegistryProviderVersions(
    organization: string,
    registryName: string,
    namespace: string,
    providerName: string,
    filter?: RegistryProviderVersionFilter,
  ): AsyncGenerator<RegistryProviderVersion[], void, unknown> {
    yield* streamPages<
      RegistryProviderVersion,
      RegistryProviderVersionFilter
    >(
      this.httpClient,
      `/organizations/${organization}/registry-providers/${registryName}/${namespace}/${providerName}/versions`,
      registryProviderVersionMapper,
      undefined,
      filter,
    );
  }

  async getRegistryProviderVersion(
    organization: string,
    registryName: string,
    namespace: string,
    providerName: string,
    version: string,
  ): Promise<RegistryProviderVersion | null> {
    const cacheKey = `${organization}:${registryName}:${namespace}:${providerName}:${version}`;
    return this.requestCache.getOrSet<RegistryProviderVersion | null>(
      "registryProviderVersion",
      cacheKey,
      async () =>
        this.httpClient
          .get<RegistryProviderVersionResponse>(
            `/organizations/${organization}/registry-providers/${registryName}/${namespace}/${providerName}/versions/${version}`,
          )
          .then((res) => registryProviderVersionMapper.map(res.data.data))
          .catch((err) => {
            if (isNotFound(err)) {
              return null;
            }
            throw err;
          }),
    );
  }
}
