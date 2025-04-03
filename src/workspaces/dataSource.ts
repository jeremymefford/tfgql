import { axiosClient } from '../common/httpClient';
import { WorkspaceResource, WorkspaceListResponse, WorkspaceResponse } from './types';

export class WorkspacesAPI {
  /** List all workspaces within a given organization */
  async listWorkspaces(orgName: string): Promise<WorkspaceResource[]> {
    const res = await axiosClient.get<WorkspaceListResponse>(`/organizations/${orgName}/workspaces`);
    return res.data.data;
  }

  /** Get a workspace by its workspace ID */
  async getWorkspace(id: string): Promise<WorkspaceResource> {
    const res = await axiosClient.get<WorkspaceResponse>(`/workspaces/${id}`);
    return res.data.data;
  }

  /** Create a new workspace in the given organization */
  async createWorkspace(orgName: string, name: string, description?: string): Promise<WorkspaceResource> {
    const payload = {
      data: {
        type: 'workspaces',
        attributes: {
          name: name,
          description: description
        }
      }
    };
    const res = await axiosClient.post<WorkspaceResponse>(`/organizations/${orgName}/workspaces`, payload);
    return res.data.data;
  }

  // Additional workspace operations (update, delete, etc.) can be added here.
}