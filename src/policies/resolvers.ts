import { Context } from '../server/context';
import { Policy, PolicyFilter } from './types';
import { gatherAsyncGeneratorPromises } from '../common/streamPages';
import { coalesceOrgs } from '../common/orgHelper';
import { parallelizeBounded } from '../common/concurrency/parallelizeBounded';

export const resolvers = {
  Query: {
    policies: async (
      _: unknown,
      { includeOrgs, excludeOrgs, filter }: { includeOrgs?: string[]; excludeOrgs?: string[]; filter?: PolicyFilter },
      ctx: Context
    ): Promise<Policy[]> => {
      const orgs = await coalesceOrgs(ctx, includeOrgs, excludeOrgs);
      if (orgs.length === 0) {
        return [];
      }

      const results: Policy[] = [];
      await parallelizeBounded(orgs, async (orgId) => {
        const policies = await gatherAsyncGeneratorPromises(
          ctx.dataSources.policiesAPI.listPolicies(orgId, filter)
        );
        results.push(...policies);
      });
      return results;
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
