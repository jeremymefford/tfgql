import type { AxiosInstance } from "axios";
import { streamPages } from "../common/streamPages";
import { TeamToken, TeamTokenFilter, TeamTokenResponse } from "./types";
import { teamTokenMapper } from "./mapper";
import { RequestCache } from "../common/requestCache";

export class TeamTokensAPI {
  constructor(
    private readonly httpClient: AxiosInstance,
    private readonly requestCache: RequestCache,
  ) {}

  async *listTeamTokens(
    teamId: string,
    filter?: TeamTokenFilter,
  ): AsyncGenerator<TeamToken[], void, unknown> {
    yield* streamPages<TeamToken, TeamTokenFilter>(
      this.httpClient,
      `/teams/${teamId}/authentication-tokens`,
      teamTokenMapper,
      undefined,
      filter,
    );
  }

  async getTeamToken(id: string): Promise<TeamToken | null> {
    return this.requestCache.getOrSet<TeamToken | null>("teamToken", id, async () =>
      this.httpClient
        .get<TeamTokenResponse>(`/authentication-tokens/${id}`)
        .then((res) => teamTokenMapper.map(res.data.data))
        .catch((err) => {
          if (err.status === 404) {
            return null;
          }
          throw err;
        }),
    );
  }
}
