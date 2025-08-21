import { axiosClient } from '../common/httpClient';
import { streamPages } from '../common/streamPages';
import {  WorkspaceResponse, WorkspaceFilter, Workspace, WorkspaceActionsFilter, WorkspacePermissionsFilter, WorkspaceSettingOverwritesFilter } from './types';
import { workspaceMapper } from './mapper';
import { ProjectResponse } from '../projects/types';

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

  async getWorkspace(id: string): Promise<Workspace> {
    const res = await axiosClient.get<WorkspaceResponse>(`/workspaces/${id}`);
    return workspaceMapper.map(res.data.data);
  }

  async getWorkspaceByName(orgName: string, workspaceName: string): Promise<Workspace> {
    const res = await axiosClient.get<WorkspaceResponse>(`/organizations/${orgName}/workspaces/${workspaceName}`);
    return workspaceMapper.map(res.data.data);
  }

  async *getWorkspacesByProjectId(projectId: string): AsyncGenerator<Workspace[], void, unknown> {
    const orgNameResponse = await axiosClient.get<ProjectResponse>(`/projects/${projectId}`);
    if (!orgNameResponse || orgNameResponse.status !== 200 || !orgNameResponse.data.data.relationships.organization.data.id) {
      console.error('Error fetching project organization:', orgNameResponse);
      yield [];
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
      {'filter[project][id]': projectId}
    );
  }
}