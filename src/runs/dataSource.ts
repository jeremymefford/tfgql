import { axiosClient } from '../common/httpClient';
import { streamPages } from '../common/streamPages';
import { RunResponse, Run, RunFilter, RunPermissionsFilter, RunActionsFilter, RunStatusTimestampsFilter, RunEvent, RunEventResource } from './types';
import { runMapper, runEventMapper } from './mapper';

export class RunsAPI {
  /** List all runs for a given workspace */
  async *listRuns(workspaceId: string, filter?: RunFilter): AsyncGenerator<Run[], void, unknown> {
    console.log('fetching runs for workspace', workspaceId);
    yield* streamPages<Run, {
      permissions: RunPermissionsFilter;
      actions: RunActionsFilter;
      statusTimestamps: RunStatusTimestampsFilter;
    }>(`/workspaces/${workspaceId}/runs`, runMapper, undefined, filter);
  }

  /** Get a single run by ID */
  async getRun(runId: string): Promise<Run> {
    const res = await axiosClient.get<RunResponse>(`/runs/${runId}`);
    if (!res || !res.data || !res.data.data) {
      throw new Error(`Failed to fetch run data for run ID: ${runId}`);
    }
    return runMapper.map(res.data.data);
  }
  /**
   * Stream all run-events for a given run (used for workspace dependency graphs).
   */
  async *listRunEvents(runId: string): AsyncGenerator<RunEvent[], void, unknown> {
    yield* streamPages<RunEvent, {}>(
      `/runs/${runId}/run-events`,
      runEventMapper
    );
  }
}