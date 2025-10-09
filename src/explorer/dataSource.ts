import type { AxiosInstance } from "axios";
import {
  gatherAsyncGeneratorPromises,
  streamPages,
} from "../common/streamPages";
import {
  mapExplorerModule,
  mapExplorerProvider,
  mapExplorerTerraformVersion,
  mapExplorerWorkspace,
} from "./mapper";
import type {
  ExplorerModuleField,
  ExplorerModuleResult,
  ExplorerProviderField,
  ExplorerProviderResult,
  ExplorerQueryOptions,
  ExplorerTerraformVersionField,
  ExplorerTerraformVersionResult,
  ExplorerViewType,
  ExplorerWorkspaceField,
  ExplorerWorkspaceResult,
} from "./types";

export class ExplorerAPI {
  constructor(private readonly httpClient: AxiosInstance) {}

  async queryWorkspaces(
    orgName: string,
    options: ExplorerQueryOptions<ExplorerWorkspaceField>,
  ): Promise<ExplorerWorkspaceResult> {
    const data = await gatherAsyncGeneratorPromises(
      streamPages(
        this.httpClient,
        this.buildEndpoint(orgName),
        mapExplorerWorkspace,
        this.buildParams("workspaces", options),
      ),
    );
    return { data };
  }

  async queryTerraformVersions(
    orgName: string,
    options: ExplorerQueryOptions<ExplorerTerraformVersionField>,
  ): Promise<ExplorerTerraformVersionResult> {
    const data = await gatherAsyncGeneratorPromises(
      streamPages(
        this.httpClient,
        this.buildEndpoint(orgName),
        mapExplorerTerraformVersion,
        this.buildParams("tf_versions", options),
      ),
    );
    return { data };
  }

  async queryProviders(
    orgName: string,
    options: ExplorerQueryOptions<ExplorerProviderField>,
  ): Promise<ExplorerProviderResult> {
    const data = await gatherAsyncGeneratorPromises(
      streamPages(
        this.httpClient,
        this.buildEndpoint(orgName),
        mapExplorerProvider,
        this.buildParams("providers", options),
      ),
    );
    return { data };
  }

  async queryModules(
    orgName: string,
    options: ExplorerQueryOptions<ExplorerModuleField>,
  ): Promise<ExplorerModuleResult> {
    const data = await gatherAsyncGeneratorPromises(
      streamPages(
        this.httpClient,
        this.buildEndpoint(orgName),
        mapExplorerModule,
        this.buildParams("modules", options),
      ),
    );
    return { data };
  }

  private buildEndpoint(orgName: string): string {
    return `/organizations/${encodeURIComponent(orgName)}/explorer`;
  }

  private buildParams<Field extends string>(
    type: ExplorerViewType,
    options: ExplorerQueryOptions<Field>,
  ): Record<string, string> {
    const params: Record<string, string> = { type };

    if (options.sort?.length) {
      params.sort = options.sort
        .map((entry) => (entry.ascending ? entry.field : `-${entry.field}`))
        .join(",");
    }

    options.filters?.forEach((filter, index) => {
      params[`filter[${index}][${filter.field}][${filter.operator}][0]`] =
        filter.value;
    });

    return params;
  }
}
