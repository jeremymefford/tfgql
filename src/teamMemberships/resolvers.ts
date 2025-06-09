import { Context } from '../server/context';
import { TeamMembership, TeamMembershipFilter } from './types';
import { gatherAsyncGeneratorPromises } from '../common/streamPages';

export const resolvers = {
  Query: {
    teamMemberships: async (
      _: unknown,
      { teamId, filter }: { teamId: string; filter?: TeamMembershipFilter },
      { dataSources }: Context
    ): Promise<Promise<TeamMembership>[]> => {
      return gatherAsyncGeneratorPromises(
        dataSources.teamMembershipsAPI.listTeamMemberships(teamId, filter)
      );
    },
    teamMembership: async (
      _: unknown,
      { id }: { id: string },
      { dataSources }: Context
    ): Promise<TeamMembership | null> => {
      return dataSources.teamMembershipsAPI.getTeamMembership(id);
    }
  }
};