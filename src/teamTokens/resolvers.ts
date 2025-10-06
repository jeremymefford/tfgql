import { Context } from '../server/context';
import { TeamToken, TeamTokenFilter } from './types';
import { gatherAsyncGeneratorPromises } from '../common/streamPages';

export const resolvers = {
  Query: {
    teamTokens: async (
      _: unknown,
      { teamId, filter }: { teamId: string; filter?: TeamTokenFilter },
      { dataSources }: Context
    ): Promise<TeamToken[]> => {
      return gatherAsyncGeneratorPromises(
        dataSources.teamTokensAPI.listTeamTokens(teamId, filter)
      );
    },
    teamToken: async (
      _: unknown,
      { id }: { id: string },
      { dataSources }: Context
    ): Promise<TeamToken | null> => {
      return dataSources.teamTokensAPI.getTeamToken(id);
    }
  }
};