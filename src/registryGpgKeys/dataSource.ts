import type { AxiosInstance } from "axios";
import { isNotFound } from "../common/http";
import { streamPages } from "../common/streamPages";
import {
  RegistryGpgKey,
  RegistryGpgKeyFilter,
  RegistryGpgKeyResponse,
} from "./types";
import { registryGpgKeyMapper } from "./mapper";
import { RequestCache } from "../common/requestCache";
import { applicationConfiguration } from "../common/conf";

/**
 * Derives the registry API base path from the standard /api/v2 base URL.
 * The GPG keys API uses /api/registry/ instead of /api/v2/.
 * Example: "https://app.terraform.io/api/v2" → "https://app.terraform.io/api/registry"
 */
function getRegistryBasePath(): string {
  return applicationConfiguration.tfeBaseUrl.replace(/\/api\/v2\/?$/, "/api/registry");
}

export class RegistryGpgKeysAPI {
  constructor(
    private readonly httpClient: AxiosInstance,
    private readonly requestCache: RequestCache,
  ) {}

  async *listRegistryGpgKeys(
    registryName: string,
    namespace: string,
    filter?: RegistryGpgKeyFilter,
  ): AsyncGenerator<RegistryGpgKey[], void, unknown> {
    const registryBase = getRegistryBasePath();
    yield* streamPages<RegistryGpgKey, RegistryGpgKeyFilter>(
      this.httpClient,
      `${registryBase}/${registryName}/v2/gpg-keys`,
      registryGpgKeyMapper,
      { "filter[namespace]": namespace },
      filter,
    );
  }

  async getRegistryGpgKey(
    registryName: string,
    namespace: string,
    keyId: string,
  ): Promise<RegistryGpgKey | null> {
    const cacheKey = `${registryName}:${namespace}:${keyId}`;
    const registryBase = getRegistryBasePath();
    return this.requestCache.getOrSet<RegistryGpgKey | null>(
      "registryGpgKey",
      cacheKey,
      async () =>
        this.httpClient
          .get<RegistryGpgKeyResponse>(
            `${registryBase}/${registryName}/v2/gpg-keys/${namespace}/${keyId}`,
          )
          .then((res) => registryGpgKeyMapper.map(res.data.data))
          .catch((err) => {
            if (isNotFound(err)) {
              return null;
            }
            throw err;
          }),
    );
  }
}
