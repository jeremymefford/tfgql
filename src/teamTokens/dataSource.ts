import { axiosClient } from '../common/httpClient';
import { streamPages } from '../common/streamPages';
import { TeamToken, TeamTokenFilter, TeamTokenResponse } from './types';
import { teamTokenMapper } from './mapper';

export class TeamTokensAPI {
  async *listTeamTokens(teamId: string, filter?: TeamTokenFilter): AsyncGenerator<TeamToken[], void, unknown> {
    yield* streamPages<TeamToken, TeamTokenFilter>(
      `/teams/${teamId}/authentication-tokens`,
      teamTokenMapper,
      undefined,
      filter
    );
  }

  async getTeamToken(id: string): Promise<TeamToken | null> {
    return axiosClient.get<TeamTokenResponse>(`/authentication-tokens/${id}`)
      .then(res => teamTokenMapper.map(res.data.data))
      .catch(err => {
        if (err.status === 404) {
          return null;
        }
        throw err;
      });
  }
}