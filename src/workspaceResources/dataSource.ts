import type { AxiosInstance } from "axios";
import { WorkspaceResource, WorkspaceResourceFilter } from "./types";
import { workspaceResourceMapper } from "./mapper";
import { streamPages } from "../common/streamPages";
import { applicationConfiguration } from "../common/conf";

export class WorkspaceResourcesAPI {
  constructor(private readonly httpClient: AxiosInstance) {}

  async *getResourcesByWorkspaceId(
    workspaceId: string,
    filter?: WorkspaceResourceFilter,
    pageSize = applicationConfiguration.tfcPageSize,
  ): AsyncGenerator<WorkspaceResource[]> {
    const generator = streamPages<WorkspaceResource, undefined>(
      this.httpClient,
      `/workspaces/${workspaceId}/resources`,
      workspaceResourceMapper,
      { "page[size]": pageSize },
      filter,
    );
    for await (const page of generator) {
      for (const resource of page) {
        resource.workspaceId = workspaceId;
      }
      yield page;
    }
  }
}
