import { axiosClient } from '../common/httpClient';
import { isNotFound } from '../common/http';
import { streamPages } from '../common/streamPages';
import { inboundRunTriggerMapper, outboundRunTriggerMapper, runTriggerMapper } from './mapper';
import { RunTrigger, RunTriggerFilter, RunTriggerResponse, WorkspaceRunTrigger } from './types';

export class RunTriggersAPI {
  /**
   * List run triggers for a workspace (inbound or outbound).
   */
  async *listRunTriggers(
    workspaceId: string,
    filter?: RunTriggerFilter
  ): AsyncGenerator<WorkspaceRunTrigger[], void, unknown> {
    yield* streamPages<WorkspaceRunTrigger>(
      `/workspaces/${workspaceId}/run-triggers`,
      inboundRunTriggerMapper,
      {"filter[run-trigger][type]": "inbound"},
      filter
    );
    yield* streamPages<WorkspaceRunTrigger>(
      `/workspaces/${workspaceId}/run-triggers`,
      outboundRunTriggerMapper,
      {"filter[run-trigger][type]": "outbound"},
      filter
    );
  }

  /**
   * Get a single run trigger by ID.
   */
  async getRunTrigger(id: string): Promise<RunTrigger | null> {
    return axiosClient.get<RunTriggerResponse>(`/run-triggers/${id}`)
      .then(res => runTriggerMapper.map(res.data.data))
      .catch(err => {
        if (isNotFound(err)) {
          return null;
        }
        throw err;
      });
  }
}
