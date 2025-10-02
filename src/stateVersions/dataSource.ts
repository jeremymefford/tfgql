import { axiosClient } from '../common/httpClient';
import { RequestCache } from '../common/requestCache';
import { streamPages } from '../common/streamPages';
import { stateVersionMapper } from './mapper';
import { StateVersion, StateVersionFilter, StateVersionResponse, StateVersionListResponse } from './types';

export class StateVersionsAPI {
  private requestCache: RequestCache;

  constructor(requestCache: RequestCache) {
    this.requestCache = requestCache;
  }

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
  async getStateVersion(id: string): Promise<StateVersion | null> {
    return await this.requestCache.getOrSet(`state-version`, id, async () =>
      axiosClient.get<StateVersionResponse>(`/state-versions/${id}`)
        .then(res => stateVersionMapper.map(res.data.data))
        .catch(err => {
          if (err.status === 404) {
            return null;
          }
          throw err;
        }));
  }

  /**
   * Fetch the current state version for a given workspace.
   */
  async getCurrentStateVersion(workspaceId: string): Promise<StateVersion | null> {
    return axiosClient.get<StateVersionResponse>(
      `/workspaces/${workspaceId}/current-state-version`
    )
      .then(res => stateVersionMapper.map(res.data.data))
      .catch(err => {
        if (err.status === 404) {
          return null;
        }
        throw err;
      });
  }
}