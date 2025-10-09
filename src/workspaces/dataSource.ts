import type { AxiosInstance } from "axios";
import { isNotFound } from "../common/http";
import { streamPages } from "../common/streamPages";
import {
  WorkspaceResponse,
  WorkspaceFilter,
  Workspace,
  WorkspaceActionsFilter,
  WorkspacePermissionsFilter,
  WorkspaceSettingOverwritesFilter,
} from "./types";
import { workspaceMapper } from "./mapper";
import { ProjectResponse } from "../projects/types";
import { logger } from "../common/logger";
import { RequestCache } from "../common/requestCache";

export class WorkspacesAPI {
  constructor(
    private readonly httpClient: AxiosInstance,
    private readonly requestCache: RequestCache,
  ) {}

  async *listWorkspaces(
    orgName: string,
    filter?: WorkspaceFilter,
  ): AsyncGenerator<Workspace[], void, unknown> {
    yield* streamPages<
      Workspace,
      {
        actions: WorkspaceActionsFilter;
        permissions: WorkspacePermissionsFilter;
        settingOverwrites: WorkspaceSettingOverwritesFilter;
      }
    >(
      this.httpClient,
      `/organizations/${orgName}/workspaces`,
      workspaceMapper,
      {},
      filter,
    );
  }

  async getWorkspace(id: string): Promise<Workspace | null> {
    return this.httpClient
      .get<WorkspaceResponse>(`/workspaces/${id}`)
      .then((res) => workspaceMapper.map(res.data.data))
      .catch((err) => {
        if (isNotFound(err)) {
          return null;
        }
        throw err;
      });
  }

  async getWorkspaceByName(
    orgName: string,
    workspaceName: string,
  ): Promise<Workspace | null> {
    const cacheKey = `${orgName}:${workspaceName}`;
    return this.requestCache.getOrSet<Workspace | null>(
      "WorkspaceByNameGET",
      cacheKey,
      async () =>
        this.httpClient
          .get<WorkspaceResponse>(
            `/organizations/${orgName}/workspaces/${workspaceName}`,
          )
          .then((res) => workspaceMapper.map(res.data.data))
          .catch((err) => {
            if (isNotFound(err)) {
              return null;
            }
            throw err;
          }),
    );
  }

  async *getWorkspacesByProjectId(
    projectId: string,
    workspaceFilter?: WorkspaceFilter,
  ): AsyncGenerator<Workspace[], void, unknown> {
    const orgNameResponse = await this.httpClient.get<ProjectResponse>(
      `/projects/${projectId}`,
    );
    if (
      !orgNameResponse ||
      orgNameResponse.status !== 200 ||
      !orgNameResponse.data.data.relationships.organization.data.id
    ) {
      logger.error(
        { response: orgNameResponse },
        "Error fetching project organization",
      );
      return;
    }
    const orgName =
      orgNameResponse.data.data.relationships.organization.data.id;

    yield* streamPages<
      Workspace,
      {
        actions: WorkspaceActionsFilter;
        permissions: WorkspacePermissionsFilter;
        settingOverwrites: WorkspaceSettingOverwritesFilter;
      }
    >(
      this.httpClient,
      `/organizations/${orgName}/workspaces`,
      workspaceMapper,
      { "filter[project][id]": projectId },
      workspaceFilter,
    );
  }
}
