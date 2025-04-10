import { axiosClient } from '../common/httpClient';
import { fetchAllPages } from '../common/fetchAllPages';
import { RunResource, RunListResponse, RunResponse, Run } from './types';
import { DomainMapper } from '../common/middleware/domainMapper';
import { runMapper } from './mapper';

export class RunsAPI {
  /** List all runs for a given workspace */
  async listRuns(workspaceId: string): Promise<Run[]> {
    return fetchAllPages<Run>(`/workspaces/${workspaceId}/runs`, runMapper);
  }

  /** Get a single run by ID */
  async getRun(runId: string): Promise<Run> {
    const res = await axiosClient.get<RunResponse>(`/runs/${runId}`);
    if (!res || !res.data || !res.data.data) {
      throw new Error(`Failed to fetch run data for run ID: ${runId}`);
    }
    return runMapper.map(res.data.data);
  }
}