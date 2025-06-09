import { axiosClient } from '../common/httpClient';
import { streamPages } from '../common/streamPages';
import { TeamToken, TeamTokenFilter, TeamTokenResponse } from './types';
import { teamTokenMapper } from './mapper';

export class TeamTokensAPI {
  async *listTeamTokens(teamId: string, filter?: TeamTokenFilter): AsyncGenerator<TeamToken[], void, unknown> {
    yield* streamPages<TeamToken, TeamTokenFilter>(
      `/teams/${teamId}/tokens`,
      teamTokenMapper,
      undefined,
      filter
    );
  }

  async getTeamToken(id: string): Promise<TeamToken> {
    const res = await axiosClient.get<TeamTokenResponse>(`/team-tokens/${id}`);
    return teamTokenMapper.map(res.data.data);
  }
}