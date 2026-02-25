import type { AxiosInstance } from "axios";
import { isNotFound } from "../common/http";
import { streamPages } from "../common/streamPages";
import {
  RegistryProviderPlatform,
  RegistryProviderPlatformFilter,
  RegistryProviderPlatformResponse,
} from "./types";
import { registryProviderPlatformMapper } from "./mapper";
import { RequestCache } from "../common/requestCache";

export class RegistryProviderPlatformsAPI {
  constructor(
    private readonly httpClient: AxiosInstance,
    private readonly requestCache: RequestCache,
  ) {}

  async *listRegistryProviderPlatforms(
    organization: string,
    registryName: string,
    namespace: string,
    providerName: string,
    version: string,
    filter?: RegistryProviderPlatformFilter,
  ): AsyncGenerator<RegistryProviderPlatform[], void, unknown> {
    yield* streamPages<
      RegistryProviderPlatform,
      RegistryProviderPlatformFilter
    >(
      this.httpClient,
      `/organizations/${organization}/registry-providers/${registryName}/${namespace}/${providerName}/versions/${version}/platforms`,
      registryProviderPlatformMapper,
      undefined,
      filter,
    );
  }

  /**
   * List platforms using a version ID. This fetches the version first to get the
   * full path, then lists platforms. Used by the RegistryProviderVersion.platforms resolver.
   */
  async *listRegistryProviderPlatformsByVersionId(
    versionId: string,
    filter?: RegistryProviderPlatformFilter,
  ): AsyncGenerator<RegistryProviderPlatform[], void, unknown> {
    try {
      const platformsLink = await this.requestCache.getOrSet<string | null>(
        "registryProviderVersionPlatformsLink",
        versionId,
        async () => {
          const versionRes = await this.httpClient.get(
            `/registry-provider-versions/${versionId}`,
          );
          return (
            versionRes.data?.data?.relationships?.platforms?.links?.related ??
            null
          );
        },
      );
      if (platformsLink) {
        yield* streamPages<
          RegistryProviderPlatform,
          RegistryProviderPlatformFilter
        >(
          this.httpClient,
          platformsLink,
          registryProviderPlatformMapper,
          undefined,
          filter,
        );
      }
    } catch (err) {
      if (isNotFound(err)) {
        return;
      }
      throw err;
    }
  }

  async getRegistryProviderPlatform(
    organization: string,
    registryName: string,
    namespace: string,
    providerName: string,
    version: string,
    os: string,
    arch: string,
  ): Promise<RegistryProviderPlatform | null> {
    const cacheKey = `${organization}:${registryName}:${namespace}:${providerName}:${version}:${os}:${arch}`;
    return this.requestCache.getOrSet<RegistryProviderPlatform | null>(
      "registryProviderPlatform",
      cacheKey,
      async () =>
        this.httpClient
          .get<RegistryProviderPlatformResponse>(
            `/organizations/${organization}/registry-providers/${registryName}/${namespace}/${providerName}/versions/${version}/platforms/${os}/${arch}`,
          )
          .then((res) =>
            registryProviderPlatformMapper.map(res.data.data),
          )
          .catch((err) => {
            if (isNotFound(err)) {
              return null;
            }
            throw err;
          }),
    );
  }
}
