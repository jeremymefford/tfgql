import { Context } from '../server/context';
import { Policy, PolicyFilter } from './types';
import { gatherAsyncGeneratorPromises } from '../common/streamPages';

export const resolvers = {
  Query: {
    policies: async (
      _: unknown,
      { orgName, filter }: { orgName: string, filter?: PolicyFilter },
      { dataSources }: Context
    ): Promise<Promise<Policy>[]> => {
      return gatherAsyncGeneratorPromises(dataSources.policiesAPI.listPolicies(orgName, filter));
    },
    policy: async (
      _: unknown,
      { id }: { id: string },
      { dataSources }: Context
    ): Promise<Policy | null> => {
      return dataSources.policiesAPI.getPolicy(id);
    }
  }
};