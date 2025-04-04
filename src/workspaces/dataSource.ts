import { axiosClient } from '../common/httpClient';
import { fetchAllPages } from '../common/fetchAllPages';
import { WorkspaceResource, WorkspaceListResponse, WorkspaceResponse } from './types';

export class WorkspacesAPI {
  async listWorkspaces(orgName: string): Promise<WorkspaceResource[]> {
    return fetchAllPages<WorkspaceResource>(`/organizations/${orgName}/workspaces`);
  }

  async getWorkspace(id: string): Promise<WorkspaceResource> {
    const res = await axiosClient.get<WorkspaceResponse>(`/workspaces/${id}`);
    return res.data.data;
  }
}