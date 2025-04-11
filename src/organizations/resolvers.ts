import { Context } from '../server/context';
import { Organization } from './types';
import { Workspace, WorkspaceFilter } from '../workspaces/types';
import { Team, TeamFilter } from '../teams/types';
import { gatherAsyncGeneratorPromises } from '../common/streamPages';

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
    }
  }
};