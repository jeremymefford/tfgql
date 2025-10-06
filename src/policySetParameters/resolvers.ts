import { Context } from '../server/context';
import { PolicySetParameter, PolicySetParameterFilter } from './types';
import { gatherAsyncGeneratorPromises } from '../common/streamPages';

export const resolvers = {
  Query: {
    policySetParameters: async (
      _: unknown,
      { policySetId, filter }: { policySetId: string, filter?: PolicySetParameterFilter },
      { dataSources }: Context
    ): Promise<PolicySetParameter[]> => {
      return gatherAsyncGeneratorPromises(
        dataSources.policySetParametersAPI.listPolicySetParameters(policySetId, filter)
      );
    },
  }
};