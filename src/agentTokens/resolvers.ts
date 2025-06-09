import { Context } from '../server/context';
import { AgentToken, AgentTokenFilter } from './types';
import { gatherAsyncGeneratorPromises } from '../common/streamPages';

export const resolvers = {
  Query: {
    agentTokens: async (
      _: unknown,
      { poolId, filter }: { poolId: string; filter?: AgentTokenFilter },
      { dataSources }: Context
    ): Promise<Promise<AgentToken>[]> => {
      return gatherAsyncGeneratorPromises(
        dataSources.agentTokensAPI.listAgentTokens(poolId, filter)
      );
    },
    agentToken: async (
      _: unknown,
      { id }: { id: string },
      { dataSources }: Context
    ): Promise<AgentToken | null> => {
      return dataSources.agentTokensAPI.getAgentToken(id);
    }
  }
};