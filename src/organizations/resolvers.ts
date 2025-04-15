import { Context } from '../server/context';
import { Organization } from './types';
import { Workspace, WorkspaceFilter } from '../workspaces/types';
import { Team, TeamFilter } from '../teams/types';
import { gatherAsyncGeneratorPromises } from '../common/streamPages';
import { User, UserFilter } from '../users/types';
import { fetchResources } from '../common/fetchResources';

export const resolvers = {
  Query: {
    organizations: async (_: unknown, __: unknown, { dataSources }: Context): Promise<Promise<Organization>[]> => {
      return gatherAsyncGeneratorPromises(dataSources.organizationsAPI.listOrganizations());
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
    teams: async (org: Organization, { filter }: { filter?: TeamFilter }, { dataSources }: Context): Promise<Promise<Team>[]> => {
      return gatherAsyncGeneratorPromises(dataSources.teamsAPI.listTeams(org.name, filter));
    },
    users: async (org: Organization, { filter }: { filter?: UserFilter }, { dataSources }: Context): Promise<User[]> => {
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
    }
  }
};