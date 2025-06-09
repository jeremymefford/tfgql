import { Context } from '../server/context';
import { Agent, AgentFilter } from './types';
import { gatherAsyncGeneratorPromises } from '../common/streamPages';

export const resolvers = {
  Query: {
    agents: async (
      _: unknown,
      { poolId, filter }: { poolId: string; filter?: AgentFilter },
      { dataSources }: Context
    ): Promise<Promise<Agent>[]> => {
      return gatherAsyncGeneratorPromises(
        dataSources.agentsAPI.listAgents(poolId, filter)
      );
    },
    agent: async (
      _: unknown,
      { id }: { id: string },
      { dataSources }: Context
    ): Promise<Agent | null> => {
      return dataSources.agentsAPI.getAgent(id);
    }
  }
};