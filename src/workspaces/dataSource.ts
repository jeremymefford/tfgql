import { axiosClient } from '../common/httpClient';
import { isNotFound } from '../common/http';
import { streamPages } from '../common/streamPages';
import { WorkspaceResponse, WorkspaceFilter, Workspace, WorkspaceActionsFilter, WorkspacePermissionsFilter, WorkspaceSettingOverwritesFilter } from './types';
import { workspaceMapper } from './mapper';
import { ProjectResponse } from '../projects/types';
import { logger } from '../common/logger';

export class WorkspacesAPI {
  async *listWorkspaces(
    orgName: string,
    filter?: WorkspaceFilter
  ): AsyncGenerator<Workspace[], void, unknown> {
    yield* streamPages<Workspace, {
      actions: WorkspaceActionsFilter;
      permissions: WorkspacePermissionsFilter;
      settingOverwrites: WorkspaceSettingOverwritesFilter;
    }>(
      `/organizations/${orgName}/workspaces`,
      workspaceMapper,
      {},
      filter
    );
  }

  async getWorkspace(id: string): Promise<Workspace | null> {
    return axiosClient.get<WorkspaceResponse>(`/workspaces/${id}`)
      .then((res) => workspaceMapper.map(res.data.data))
      .catch((err) => {
        if (isNotFound(err)) {
          return null;
        }
        throw err;
      });
  }

  async getWorkspaceByName(orgName: string, workspaceName: string): Promise<Workspace | null> {
    return axiosClient.get<WorkspaceResponse>(`/organizations/${orgName}/workspaces/${workspaceName}`)
      .then((res) => workspaceMapper.map(res.data.data))
      .catch((err) => {
        if (isNotFound(err)) {
          return null;
        }
        throw err;
      });
  }

  async *getWorkspacesByProjectId(projectId: string, workspaceFilter?: WorkspaceFilter): AsyncGenerator<Workspace[], void, unknown> {
    const orgNameResponse = await axiosClient.get<ProjectResponse>(`/projects/${projectId}`);
    if (!orgNameResponse || orgNameResponse.status !== 200 || !orgNameResponse.data.data.relationships.organization.data.id) {
      logger.error({ response: orgNameResponse }, 'Error fetching project organization');
      return;
    }
    const orgName = orgNameResponse.data.data.relationships.organization.data.id;

    yield* streamPages<Workspace, {
      actions: WorkspaceActionsFilter;
      permissions: WorkspacePermissionsFilter;
      settingOverwrites: WorkspaceSettingOverwritesFilter;
    }>(
      `/organizations/${orgName}/workspaces`,
      workspaceMapper,
      { 'filter[project][id]': projectId },
      workspaceFilter
    );
  }
}
