import { axiosClient } from '../common/httpClient';
import { streamPages } from '../common/streamPages';
import { runTriggerMapper } from './mapper';
import { RunTrigger, RunTriggerFilter, RunTriggerResponse } from './types';

export class RunTriggersAPI {
  /**
   * List run triggers for a workspace (inbound or outbound).
   */
  async *listRunTriggers(
    workspaceId: string,
    typeFilter?: RunTriggerFilter
  ): AsyncGenerator<RunTrigger[], void, unknown> {
    const params: Record<string, any> = {};
    if (typeFilter) {
      // filter run-trigger[type]=inbound|outbound
      params['filter[run-trigger][type]'] = (typeFilter as any).type?._eq;
    }
    yield* streamPages<RunTrigger, RunTriggerFilter>(
      `/workspaces/${workspaceId}/run-triggers`,
      runTriggerMapper,
      params,
      typeFilter
    );
  }

  /**
   * Get a single run trigger by ID.
   */
  async getRunTrigger(id: string): Promise<RunTrigger> {
    const res = await axiosClient.get<RunTriggerResponse>(`/run-triggers/${id}`);
    return runTriggerMapper.map(res.data.data);
  }
}