import type { AxiosInstance } from "axios";
import { RequestCache } from "../common/requestCache";
import { streamPages } from "../common/streamPages";
import { stateVersionMapper } from "./mapper";
import {
  StateVersion,
  StateVersionFilter,
  StateVersionResponse,
} from "./types";
import { isNotFound } from "../common/http";

export class StateVersionsAPI {
  constructor(
    private readonly httpClient: AxiosInstance,
    private readonly requestCache: RequestCache,
  ) {}

  /**
   * List all state versions for a given organization and workspace.
   */
  async *listStateVersions(
    organizationName: string,
    workspaceName: string,
    filter?: StateVersionFilter,
  ): AsyncGenerator<StateVersion[], void, unknown> {
    const params: Record<string, any> = {
      "filter[organization][name]": organizationName,
      "filter[workspace][name]": workspaceName,
    };
    const pageGenerator = streamPages<StateVersion, StateVersionFilter>(
      this.httpClient,
      `/state-versions`,
      stateVersionMapper,
      params,
      filter,
    );
    for await (const page of pageGenerator) {
      for (const stateVersion of page) {
        this.requestCache.set("state-version", stateVersion.id, stateVersion);
      }
      yield page;
    }
  }

  /**
   * Fetch a single state version by ID.
   */
  async getStateVersion(id: string): Promise<StateVersion | null> {
    if (!id) {
      return null;
    }
    return await this.requestCache.getOrSet(`state-version`, id, async () =>
      this.httpClient
        .get<StateVersionResponse>(`/state-versions/${id}`)
        .then((res) => stateVersionMapper.map(res.data.data))
        .catch((err) => {
          if (isNotFound(err)) {
            return null;
          }
          throw err;
        }),
    );
  }

  /**
   * Fetch the current state version for a given workspace.
   */
  async getCurrentStateVersion(
    workspaceId: string,
  ): Promise<StateVersion | null> {
    return this.requestCache.getOrSet<StateVersion | null>(
      "currentStateVersion",
      workspaceId,
      async () =>
        this.httpClient
          .get<StateVersionResponse>(
            `/workspaces/${workspaceId}/current-state-version`,
          )
          .then((res) => stateVersionMapper.map(res.data.data))
          .catch((err) => {
            if (isNotFound(err)) {
              return null;
            }
            throw err;
          }),
    );
  }
}
