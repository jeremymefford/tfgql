import { Context } from '../server/context';
import { OrganizationMembership, OrganizationMembershipFilter } from './types';
import { gatherAsyncGeneratorPromises } from '../common/streamPages';
import { coalesceOrgs } from '../common/orgHelper';
import { parallelizeBounded } from '../common/concurrency/parallelizeBounded';

export const resolvers = {
  Query: {
    organizationMemberships: async (
      _: unknown,
      { includeOrgs, excludeOrgs, filter }: { includeOrgs?: string[]; excludeOrgs?: string[]; filter?: OrganizationMembershipFilter },
      ctx: Context
    ): Promise<OrganizationMembership[]> => {
      const orgs = await coalesceOrgs(ctx, includeOrgs, excludeOrgs);
      if (orgs.length === 0) {
        return [];
      }

      const results: OrganizationMembership[] = [];
      await parallelizeBounded(orgs, async (orgId) => {
        const memberships = await gatherAsyncGeneratorPromises(
          ctx.dataSources.organizationMembershipsAPI.listOrganizationMemberships(orgId, filter)
        );
        results.push(...memberships);
      });
      return results;
    },
    organizationMembership: async (
      _: unknown,
      { id }: { id: string },
      { dataSources }: Context
    ): Promise<OrganizationMembership | null> => {
      return dataSources.organizationMembershipsAPI.getOrganizationMembership(id);
    },
    myOrganizationMemberships: async (
      _: unknown,
      { filter }: { filter: OrganizationMembershipFilter },
      { dataSources }: Context
    ): Promise<OrganizationMembership[]> => {
      return dataSources.organizationMembershipsAPI.myOrganizationMemberships(filter);
    }
  }
};
