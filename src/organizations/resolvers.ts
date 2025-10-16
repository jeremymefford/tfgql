import { Context } from "../server/context";
import { Organization, OrganizationFilter } from "./types";
import { Workspace, WorkspaceFilter } from "../workspaces/types";
import { Team, TeamFilter } from "../teams/types";
import { gatherAsyncGeneratorPromises } from "../common/streamPages";
import { User, UserFilter } from "../users/types";
import { fetchResources } from "../common/fetchResources";
import { VariableSet, VariableSetFilter } from "../variableSets/types";
import {
  OrganizationMembership,
  OrganizationMembershipFilter,
} from "../organizationMemberships/types";
import {
  OrganizationTag,
  OrganizationTagFilter,
} from "../organizationTags/types";
import { PolicySet, PolicySetFilter } from "../policySets/types";
import { Project, ProjectFilter } from "../projects/types";
import { AdminUser } from "../admin/types";

export const resolvers = {
  Query: {
    organizations: async (
      _: unknown,
      { filter }: { filter: OrganizationFilter },
      ctx: Context,
    ): Promise<Organization[]> => {
      return gatherAsyncGeneratorPromises(
        ctx.dataSources.organizationsAPI.listOrganizations(filter),
      );
    },
    organization: async (
      _: unknown,
      { name }: { name: string },
      ctx: Context,
    ): Promise<Organization | null> => {
      const org = await ctx.dataSources.organizationsAPI.getOrganization(name);
      return org;
    },
  },
  Organization: {
    workspaces: async (
      org: Organization,
      { filter }: { filter?: WorkspaceFilter },
      ctx: Context,
    ): Promise<Workspace[]> => {
      return gatherAsyncGeneratorPromises(
        ctx.dataSources.workspacesAPI.listWorkspaces(org.name, filter),
      );
    },
    policySets: async (
      org: Organization,
      { filter }: { filter?: PolicySetFilter },
      ctx: Context,
    ): Promise<PolicySet[]> => {
      return gatherAsyncGeneratorPromises(
        ctx.dataSources.policySetsAPI.listPolicySets(org.name, filter),
      );
    },
    teams: async (
      org: Organization,
      { filter }: { filter?: TeamFilter },
      ctx: Context,
    ): Promise<Team[]> => {
      return gatherAsyncGeneratorPromises(
        ctx.dataSources.teamsAPI.listTeams(org.name, filter),
      );
    },
    variableSets: async (
      org: Organization,
      { filter }: { filter?: VariableSetFilter },
      ctx: Context,
    ): Promise<VariableSet[]> => {
      return gatherAsyncGeneratorPromises(
        ctx.dataSources.variableSetsAPI.listVariableSetsForOrg(
          org.name,
          filter,
        ),
      );
    },
    users: async (
      org: Organization,
      { filter }: { filter?: UserFilter },
      ctx: Context,
    ): Promise<User[]> => {
      ctx.logger.debug({ org: org.name }, "Fetching teams");
      const userIdSet = new Set<string>();

      for await (const teams of ctx.dataSources.teamsAPI.listTeams(org.name)) {
        for (const team of teams) {
          ctx.logger.debug({ teamName: team.name }, "Found team");
          team.userIds.forEach((id) => userIdSet.add(id));
        }
      }

      ctx.logger.debug({ count: userIdSet.size }, "Done fetching user IDs");

      return fetchResources<string, User, UserFilter>(
        Array.from(userIdSet),
        (id) => ctx.dataSources.usersAPI.getUser(id),
        filter,
      );
    },
    memberships: async (
      org: Organization,
      { filter }: { filter?: OrganizationMembershipFilter },
      ctx: Context,
    ): Promise<OrganizationMembership[]> => {
      return gatherAsyncGeneratorPromises(
        ctx.dataSources.organizationMembershipsAPI.listOrganizationMemberships(
          org.name,
          filter,
        ),
      );
    },
    tags: async (
      org: Organization,
      { filter }: { filter?: OrganizationTagFilter },
      ctx: Context,
    ): Promise<OrganizationTag[]> =>
      gatherAsyncGeneratorPromises(
        ctx.dataSources.organizationTagsAPI.listOrganizationTags(
          org.name,
          filter,
        ),
      ),
    projects: async (
      org: Organization,
      { filter }: { filter?: ProjectFilter },
      ctx: Context,
    ): Promise<Project[]> => 
      gatherAsyncGeneratorPromises(
        ctx.dataSources.projectsAPI.getProjects(org.name, filter),
      ),
    usersFromAdmin: async (
      org: Organization,
      { filter }: { filter?: UserFilter },
      ctx: Context,
    ): Promise<AdminUser[]> =>
      ctx.dataSources.adminAPI.listUsers({
        filter: filter,
        organizationId: org.id,
      })
  },
};
