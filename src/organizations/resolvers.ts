import { Context } from '../server/context';
import { Organization } from './types';
import { Workspace } from '../workspaces/types';
import { Team } from '../teams/types';

export const resolvers = {
  Query: {
    organizations: async (_: unknown, __: unknown, { dataSources }: Context): Promise<Organization[]> => {
      const organizations = await dataSources.organizationsAPI.listOrganizations();
      return organizations;
    },
    organization: async (_: unknown, { name }: { name: string }, { dataSources }: Context): Promise<Organization | null> => {
      const org = await dataSources.organizationsAPI.getOrganization(name);
      return org;
    }
  },
  Organization: {
    workspaces: async (org: Organization, _: unknown, { dataSources }: Context): Promise<Workspace[]> => {
      const workspaces = await dataSources.workspacesAPI.listWorkspaces(org.name);
      return workspaces;
    },
    teams: async (org: Organization, _: unknown, { dataSources }: Context): Promise<Team[]> => {
      const teams = await dataSources.teamsAPI.listTeams(org.name);
      return teams;
    }
  }
};