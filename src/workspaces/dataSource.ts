import { axiosClient } from '../common/httpClient';
import { fetchAllPages } from '../common/fetchAllPages';
import { WorkspaceResource, WorkspaceListResponse, WorkspaceResponse, WorkspaceFilter, Workspace } from './types';
import { workspaceMapper } from './mapper';
import { WhereClause } from '../common/filtering/types';

export class WorkspacesAPI {
  async listWorkspaces(orgName: string, filter?: WhereClause<Workspace>): Promise<Workspace[]> {
    return fetchAllPages<Workspace>(`/organizations/${orgName}/workspaces`, workspaceMapper, {}, filter);
  }

  async getWorkspace(id: string): Promise<Workspace> {
    const res = await axiosClient.get<WorkspaceResponse>(`/workspaces/${id}`);
    return workspaceMapper.map(res.data.data);
  }
}