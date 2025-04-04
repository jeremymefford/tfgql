import { axiosClient } from '../common/httpClient';
import { fetchAllPages } from '../common/fetchAllPages';
import { RunResource, RunListResponse, RunResponse } from './types';

export class RunsAPI {
  /** List all runs for a given workspace */
  async listRuns(workspaceId: string): Promise<RunResource[]> {
    return fetchAllPages<RunResource>(`/workspaces/${workspaceId}/runs`);
  }

  /** Get a single run by ID */
  async getRun(runId: string): Promise<RunResource> {
    const res = await axiosClient.get<RunResponse>(`/runs/${runId}`);
    return res.data.data;
  }
}