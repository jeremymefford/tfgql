import { Context } from '../server/context';
import { Workspace, WorkspaceFilter } from './types';
import { Organization } from '../organizations/types';
import { Run } from '../runs/types';
import { ConfigurationVersion } from '../configuration-versions/types';
import { WhereClause } from '../common/filtering/types';

export const resolvers = {
  Query: {
    workspaces: async (_: unknown, { orgName, filter }: { orgName: string, filter?: WhereClause<Workspace>}, { dataSources }: Context): Promise<Workspace[]> => {
      const wsResources = await dataSources.workspacesAPI.listWorkspaces(orgName, filter);
      return wsResources;
    },
    workspace: async (_: unknown, { id }: { id: string }, { dataSources }: Context): Promise<Workspace | null> => {
      const wsResource = await dataSources.workspacesAPI.getWorkspace(id);
      if (!wsResource) return null;
      return wsResource;
    }
  },
  Workspace: {
    organization: async (workspace: Workspace, _: unknown, { dataSources }: Context): Promise<Organization | null> => {
      const orgName = workspace.organizationName;
      if (!orgName) return null;
      const organization = await dataSources.organizationsAPI.getOrganization(orgName);
      return organization
    },
    runs: async (workspace: Workspace, _: unknown, { dataSources }: Context): Promise<Run[]> => {
      const runs = await dataSources.runsAPI.listRuns(workspace.id);
      return runs;
    },
    configurationVersions: async (workspace: Workspace, _: unknown, { dataSources }: Context): Promise<ConfigurationVersion[]> => {
      const cvs = await dataSources.configurationVersionsAPI.listConfigurationVersions(workspace.id);
      return cvs;
    }
  }
};