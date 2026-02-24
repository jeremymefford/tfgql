import type { AxiosInstance } from "axios";
import { isNotFound } from "../common/http";
import { streamPages } from "../common/streamPages";
import {
  RegistryModule,
  RegistryModuleFilter,
  RegistryModuleResponse,
  RegistryModuleVersionDetail,
  RegistryModuleVersionsV1Response,
} from "./types";
import { registryModuleMapper } from "./mapper";
import { RequestCache } from "../common/requestCache";
import { applicationConfiguration } from "../common/conf";

/**
 * Derives the registry v1 API base path from the standard /api/v2 base URL.
 * Module versions use /api/registry/v1/modules/ instead of /api/v2/.
 */
function getRegistryV1BasePath(): string {
  return applicationConfiguration.tfeBaseUrl.replace(
    /\/api\/v2\/?$/,
    "/api/registry/v1/modules",
  );
}

export class RegistryModulesAPI {
  constructor(
    private readonly httpClient: AxiosInstance,
    private readonly requestCache: RequestCache,
  ) {}

  async *listRegistryModules(
    orgName: string,
    filter?: RegistryModuleFilter,
  ): AsyncGenerator<RegistryModule[], void, unknown> {
    yield* streamPages<RegistryModule, RegistryModuleFilter>(
      this.httpClient,
      `/organizations/${orgName}/registry-modules`,
      registryModuleMapper,
      undefined,
      filter,
    );
  }

  /**
   * List full version details for a module using the registry v1 API.
   * This endpoint uses /api/registry/v1/modules/ (not JSON:API).
   */
  async listModuleVersions(
    namespace: string,
    name: string,
    provider: string,
  ): Promise<RegistryModuleVersionDetail[]> {
    const cacheKey = `${namespace}:${name}:${provider}`;
    return this.requestCache.getOrSet<RegistryModuleVersionDetail[]>(
      "registryModuleVersions",
      cacheKey,
      async () => {
        try {
          const basePath = getRegistryV1BasePath();
          const res =
            await this.httpClient.get<RegistryModuleVersionsV1Response>(
              `${basePath}/${namespace}/${name}/${provider}/versions`,
            );
          const modules = res.data?.modules;
          if (!modules || modules.length === 0) {
            return [];
          }
          return (modules[0].versions || []).map((v) => ({
            version: v.version,
            submodules: v.submodules || [],
            root: v.root,
          }));
        } catch (err) {
          if (isNotFound(err)) {
            return [];
          }
          throw err;
        }
      },
    );
  }

  async getRegistryModule(
    organization: string,
    registryName: string,
    namespace: string,
    name: string,
    provider: string,
  ): Promise<RegistryModule | null> {
    const cacheKey = `${organization}:${registryName}:${namespace}:${name}:${provider}`;
    return this.requestCache.getOrSet<RegistryModule | null>(
      "registryModule",
      cacheKey,
      async () =>
        this.httpClient
          .get<RegistryModuleResponse>(
            `/organizations/${organization}/registry-modules/${registryName}/${namespace}/${name}/${provider}`,
          )
          .then((res) => registryModuleMapper.map(res.data.data))
          .catch((err) => {
            if (isNotFound(err)) {
              return null;
            }
            throw err;
          }),
    );
  }
}
