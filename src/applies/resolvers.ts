import { Context } from '../server/context';
import { Apply, ApplyFilter } from './types';
import { gatherAsyncGeneratorPromises } from '../common/streamPages';

export const resolvers = {
  Query: {
    applies: async (
      _: unknown,
      { runId, filter }: { runId: string; filter?: ApplyFilter },
      { dataSources }: Context
    ): Promise<Promise<Apply>[]> => {
      return gatherAsyncGeneratorPromises(dataSources.appliesAPI.listApplies(runId, filter));
    },
    apply: async (
      _: unknown,
      { id }: { id: string },
      { dataSources }: Context
    ): Promise<Apply | null> => {
      return dataSources.appliesAPI.getApply(id);
    }
  }
};