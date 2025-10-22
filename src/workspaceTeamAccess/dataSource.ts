import type { AxiosInstance } from "axios";
import { streamPages } from "../common/streamPages";
import { RequestCache } from "../common/requestCache";
import {
  WorkspaceTeamAccess,
  WorkspaceTeamAccessFilter, WorkspaceTeamAccessResponse
} from "./types";
import { workspaceTeamAccessMapper } from "./mapper";
import { evaluateWhereClause } from "../common/filtering/filtering";
import { isNotFound } from "../common/http";

async function collectStream<T>(generator: AsyncGenerator<T[], void>): Promise<T[]> {
  const results: T[] = [];
  for await (const page of generator) {
    results.push(...page);
  }
  return results;
}

export class WorkspaceTeamAccessAPI {
  constructor(
    private readonly httpClient: AxiosInstance,
    private readonly requestCache: RequestCache,
  ) {}

  async listTeamAccessForWorkspace(
    workspaceId: string,
    filter?: WorkspaceTeamAccessFilter,
  ): Promise<WorkspaceTeamAccess[]> {
    const all = await this.requestCache.getOrSet(
      "WorkspaceTeamAccess:workspace",
      workspaceId,
      async () =>
        collectStream(
          streamPages<WorkspaceTeamAccess>(
            this.httpClient,
            `/team-workspaces`,
            workspaceTeamAccessMapper,
            { 'filter[workspace][id]': workspaceId },
          ),
        ),
    );

    if (!filter) {
      return all;
    }

    return all.filter((access) => evaluateWhereClause(filter, access));
  }

  async getTeamWorkspaceAccess(id: string): Promise<WorkspaceTeamAccess | null> {
    return this.requestCache.getOrSet(
      "WorkspaceTeamAccess:get",
      id,
      async () => {
        try {
          const response = await this.httpClient.get<WorkspaceTeamAccessResponse>(
            `/team-workspaces/${id}`,
          );
          return workspaceTeamAccessMapper.map(response.data.data);
        } catch (error) {
          if (isNotFound(error)) {
            return null;
          }
          throw error;
        }
      },
    );
  }
}
