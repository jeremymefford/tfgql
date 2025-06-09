import { axiosClient } from '../common/httpClient';
import { streamPages } from '../common/streamPages';
import { TeamMembership, TeamMembershipFilter, TeamMembershipResponse } from './types';
import { teamMembershipMapper } from './mapper';

export class TeamMembershipsAPI {
  async *listTeamMemberships(teamId: string, filter?: TeamMembershipFilter): AsyncGenerator<
    TeamMembership[],
    void,
    unknown
  > {
    yield* streamPages<TeamMembership, TeamMembershipFilter>(
      `/teams/${teamId}/memberships`,
      teamMembershipMapper,
      undefined,
      filter
    );
  }

  async getTeamMembership(id: string): Promise<TeamMembership> {
    const res = await axiosClient.get<TeamMembershipResponse>(`/team-memberships/${id}`);
    return teamMembershipMapper.map(res.data.data);
  }
}