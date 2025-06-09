import { Context } from '../server/context';
import { StateVersionOutput, StateVersionOutputFilter } from './types';
import { gatherAsyncGeneratorPromises } from '../common/streamPages';

export const resolvers = {
  Query: {
    stateVersionOutputs: async (
      _: unknown,
      { stateVersionId, filter }: { stateVersionId: string; filter?: StateVersionOutputFilter },
      { dataSources }: Context
    ): Promise<Promise<StateVersionOutput>[]> => {
      return gatherAsyncGeneratorPromises(
        dataSources.stateVersionOutputsAPI.listStateVersionOutputs(stateVersionId, filter)
      );
    },
    stateVersionOutput: async (
      _: unknown,
      { id }: { id: string },
      { dataSources }: Context
    ): Promise<StateVersionOutput | null> => {
      return dataSources.stateVersionOutputsAPI.getStateVersionOutput(id);
    }
  }
};