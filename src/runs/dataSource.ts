import type { AxiosInstance } from 'axios';
import { streamPages } from '../common/streamPages';
import { RunResponse, Run, RunFilter, RunPermissionsFilter, RunActionsFilter, RunStatusTimestampsFilter, RunEvent, RunEventResource } from './types';
import { runMapper, runEventMapper } from './mapper';
import { logger } from '../common/logger';
import { isNotFound } from '../common/http';

export class RunsAPI {
  constructor(private readonly httpClient: AxiosInstance) {}

  /** List all runs for a given workspace */
  async *listRuns(workspaceId: string, filter?: RunFilter): AsyncGenerator<Run[], void, unknown> {
    logger.debug({ workspaceId }, 'Fetching runs for workspace');
    yield* streamPages<Run, {
      permissions: RunPermissionsFilter;
      actions: RunActionsFilter;
      statusTimestamps: RunStatusTimestampsFilter;
    }>(this.httpClient, `/workspaces/${workspaceId}/runs`, runMapper, undefined, filter);
  }

  async getRun(runId: string): Promise<Run | null> {
    return this.httpClient.get<RunResponse>(`/runs/${runId}`)
      .then(res => runMapper.map(res.data.data))
      .catch(err => {
        if (isNotFound(err)) {
          return null;
        }
        throw err;
      });
  }

  async *listRunEvents(runId: string): AsyncGenerator<RunEvent[], void, unknown> {
    yield* streamPages<RunEvent, {}>(
      this.httpClient,
      `/runs/${runId}/run-events`,
      runEventMapper
    );
  }
}
