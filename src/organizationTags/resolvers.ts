import { Context } from '../server/context';
import { OrganizationTag, OrganizationTagFilter } from './types';
import { gatherAsyncGeneratorPromises } from '../common/streamPages';

export const resolvers = {
  Query: {
    organizationTags: async (
      _: unknown,
      { orgName, filter }: { orgName: string; filter?: OrganizationTagFilter },
      { dataSources }: Context
    ): Promise<Promise<OrganizationTag>[]> => {
      return gatherAsyncGeneratorPromises(
        dataSources.organizationTagsAPI.listOrganizationTags(orgName, filter)
      );
    },
  }
};