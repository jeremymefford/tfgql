import { axiosClient } from '../common/httpClient';
import { streamPages } from '../common/streamPages';
import { stateVersionMapper } from './mapper';
import { StateVersion, StateVersionFilter, StateVersionResponse, StateVersionListResponse } from './types';

export class StateVersionsAPI {
  /**
   * List all state versions for a given organization and workspace.
   */
  async *listStateVersions(
    organizationName: string,
    workspaceName: string,
    filter?: StateVersionFilter
  ): AsyncGenerator<StateVersion[], void, unknown> {
    const params: Record<string, any> = {
      'filter[organization][name]': organizationName,
      'filter[workspace][name]': workspaceName
    };
    yield* streamPages<StateVersion, StateVersionFilter>(
      `/state-versions`,
      stateVersionMapper,
      params,
      filter
    );
  }

  /**
   * Fetch a single state version by ID.
   */
  async getStateVersion(id: string): Promise<StateVersion> {
    const res = await axiosClient.get<StateVersionResponse>(`/state-versions/${id}`);
    return stateVersionMapper.map(res.data.data);
  }

  /**
   * Fetch the current state version for a given workspace.
   */
  async getCurrentStateVersion(workspaceId: string): Promise<StateVersion> {
    const res = await axiosClient.get<StateVersionResponse>(
      `/workspaces/${workspaceId}/current-state-version`
    );
    return stateVersionMapper.map(res.data.data);
  }
}