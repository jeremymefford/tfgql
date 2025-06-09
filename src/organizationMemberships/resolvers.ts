import { Context } from '../server/context';
import { OrganizationMembership, OrganizationMembershipFilter } from './types';
import { gatherAsyncGeneratorPromises } from '../common/streamPages';

export const resolvers = {
  Query: {
    organizationMemberships: async (
      _: unknown,
      { orgName, filter }: { orgName: string; filter?: OrganizationMembershipFilter },
      { dataSources }: Context
    ): Promise<Promise<OrganizationMembership>[]> => {
      return gatherAsyncGeneratorPromises(
        dataSources.organizationMembershipsAPI.listOrganizationMemberships(orgName, filter)
      );
    },
    organizationMembership: async (
      _: unknown,
      { id }: { id: string },
      { dataSources }: Context
    ): Promise<OrganizationMembership | null> => {
      return dataSources.organizationMembershipsAPI.getOrganizationMembership(id);
    }
  }
};