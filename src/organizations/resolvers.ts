import { Context } from '../server/context';
import { Organization, OrganizationFilter } from './types';
import { Workspace, WorkspaceFilter } from '../workspaces/types';
import { Team, TeamFilter } from '../teams/types';
import { gatherAsyncGeneratorPromises } from '../common/streamPages';
import { User, UserFilter } from '../users/types';
import { fetchResources } from '../common/fetchResources';
import { VariableSet, VariableSetFilter } from '../variableSets/types';
import {
  OrganizationMembership,
  OrganizationMembershipFilter,
} from '../organizationMemberships/types';
import {
  OrganizationTag,
  OrganizationTagFilter,
} from '../organizationTags/types';
import { PolicySet, PolicySetFilter } from '../policySets/types';

export const resolvers = {
  Query: {
    organizations: async (_: unknown, {filter}: {filter: OrganizationFilter}, { dataSources }: Context): Promise<Promise<Organization>[]> => {
      return gatherAsyncGeneratorPromises(dataSources.organizationsAPI.listOrganizations(filter));
    },
    organization: async (_: unknown, { name }: { name: string }, { dataSources }: Context): Promise<Organization | null> => {
      const org = await dataSources.organizationsAPI.getOrganization(name);
      return org;
    }
  },
  Organization: {
    workspaces: async (org: Organization, { filter }: { filter?: WorkspaceFilter }, { dataSources }: Context): Promise<Promise<Workspace>[]> => {
      return gatherAsyncGeneratorPromises(dataSources.workspacesAPI.listWorkspaces(org.name, filter));
    },
    policySets: async (org: Organization, { filter }: { filter?: PolicySetFilter }, { dataSources }: Context): Promise<Promise<PolicySet>[]> => {
      return gatherAsyncGeneratorPromises(dataSources.policySetsAPI.listPolicySets(org.name, filter));
    },
    teams: async (org: Organization, { filter }: { filter?: TeamFilter }, { dataSources }: Context): Promise<Promise<Team>[]> => {
      return gatherAsyncGeneratorPromises(dataSources.teamsAPI.listTeams(org.name, filter));
    },
    variableSets: async (org: Organization, { filter }: { filter?: VariableSetFilter }, { dataSources }: Context): Promise<Promise<VariableSet>[]> => {
      return gatherAsyncGeneratorPromises(dataSources.variableSetsAPI.listVariableSetsForOrg(org.name, filter));
    },
    users: async (org: Organization, { filter }: { filter?: UserFilter }, { dataSources, requestCache }: Context): Promise<User[]> => {
      console.log("fetching teams");
      const userIdSet = new Set<string>();

      for await (const teams of dataSources.teamsAPI.listTeams(org.name)) {
        for (const team of teams) {
          console.log(`found team ${team.name}`);
          team.userIds.forEach(id => userIdSet.add(id));
        }
      }

      console.log("done fetching ids");

      return fetchResources<string, User, UserFilter>(
        Array.from(userIdSet),
        id => dataSources.usersAPI.getUser(id),
        filter
      );
    },
    memberships: async (
      org: Organization,
      { filter }: { filter?: OrganizationMembershipFilter },
      { dataSources }: Context
    ): Promise<Promise<OrganizationMembership>[]> => {
      return gatherAsyncGeneratorPromises(
        dataSources.organizationMembershipsAPI.listOrganizationMemberships(
          org.name,
          filter
        )
      );
    },
    tags: async (
      org: Organization,
      { filter }: { filter?: OrganizationTagFilter },
      { dataSources }: Context
    ): Promise<Promise<OrganizationTag>[]> =>
      gatherAsyncGeneratorPromises(
        dataSources.organizationTagsAPI.listOrganizationTags(org.name, filter)
      )
  }
};