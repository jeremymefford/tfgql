import { axiosClient } from '../common/httpClient';
import { streamPages } from '../common/streamPages';
import {  WorkspaceResponse, WorkspaceFilter, Workspace, WorkspaceActionsFilter, WorkspacePermissionsFilter, WorkspaceSettingOverwritesFilter } from './types';
import { workspaceMapper } from './mapper';

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
}