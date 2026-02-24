import type { AxiosInstance } from "axios";
import { isNotFound } from "../common/http";
import { streamPages } from "../common/streamPages";
import {
  RegistryProvider,
  RegistryProviderFilter,
  RegistryProviderResponse,
} from "./types";
import { registryProviderMapper } from "./mapper";
import { RequestCache } from "../common/requestCache";

export class RegistryProvidersAPI {
  constructor(
    private readonly httpClient: AxiosInstance,
    private readonly requestCache: RequestCache,
  ) {}

  async *listRegistryProviders(
    orgName: string,
    filter?: RegistryProviderFilter,
  ): AsyncGenerator<RegistryProvider[], void, unknown> {
    yield* streamPages<RegistryProvider, RegistryProviderFilter>(
      this.httpClient,
      `/organizations/${orgName}/registry-providers`,
      registryProviderMapper,
      undefined,
      filter,
    );
  }

  async getRegistryProvider(
    organization: string,
    registryName: string,
    namespace: string,
    name: string,
  ): Promise<RegistryProvider | null> {
    const cacheKey = `${organization}:${registryName}:${namespace}:${name}`;
    return this.requestCache.getOrSet<RegistryProvider | null>(
      "registryProvider",
      cacheKey,
      async () =>
        this.httpClient
          .get<RegistryProviderResponse>(
            `/organizations/${organization}/registry-providers/${registryName}/${namespace}/${name}`,
          )
          .then((res) => registryProviderMapper.map(res.data.data))
          .catch((err) => {
            if (isNotFound(err)) {
              return null;
            }
            throw err;
          }),
    );
  }
}
