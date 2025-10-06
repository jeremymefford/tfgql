import { Context } from '../server/context';
import { OrganizationTag, OrganizationTagFilter } from './types';
import { gatherAsyncGeneratorPromises } from '../common/streamPages';
import { coalesceOrgs } from '../common/orgHelper';
import { parallelizeBounded } from '../common/concurrency/parallelizeBounded';

export const resolvers = {
  Query: {
    organizationTags: async (
      _: unknown,
      { includeOrgs, excludeOrgs, filter }: { includeOrgs?: string[]; excludeOrgs?: string[]; filter?: OrganizationTagFilter },
      ctx: Context
    ): Promise<OrganizationTag[]> => {
      const orgs = await coalesceOrgs(ctx, includeOrgs, excludeOrgs);
      if (orgs.length === 0) {
        return [];
      }

      const results: OrganizationTag[] = [];
      await parallelizeBounded(orgs, async (orgId) => {
        const tags = await gatherAsyncGeneratorPromises(
          ctx.dataSources.organizationTagsAPI.listOrganizationTags(orgId, filter)
        );
        results.push(...tags);
      });
      return results;
    },
  }
};
