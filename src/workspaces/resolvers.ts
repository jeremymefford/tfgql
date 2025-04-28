import { Context } from '../server/context';
import { Workspace, WorkspaceFilter } from './types';
import { Organization } from '../organizations/types';
import { Run, RunFilter } from '../runs/types';
import { ConfigurationVersion, ConfigurationVersionFilter } from '../configuration-versions/types';
import { gatherAsyncGeneratorPromises } from '../common/streamPages';
import { Variable, VariableFilter } from '../variables/types';

export const resolvers = {
  Query: {
    workspaces: (_: unknown, { orgName, filter }: { orgName: string, filter?: WorkspaceFilter }, { dataSources }: Context): Promise<Promise<Workspace>[]> => {
      return gatherAsyncGeneratorPromises(dataSources.workspacesAPI.listWorkspaces(orgName, filter));
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
    runs: async (workspace: Workspace, { filter }: { filter?: RunFilter }, { dataSources }: Context): Promise<Promise<Run>[]> => {
      return gatherAsyncGeneratorPromises(dataSources.runsAPI.listRuns(workspace.id, filter));
    },
    configurationVersions: async (workspace: Workspace, { filter }: { filter?: ConfigurationVersionFilter }, { dataSources }: Context): Promise<Promise<ConfigurationVersion>[]> => {
      return gatherAsyncGeneratorPromises(dataSources.configurationVersionsAPI.listConfigurationVersions(workspace.id, filter));
    },
    variables: async (workspace: Workspace, { filter }: { filter?: VariableFilter }, { dataSources }: Context): Promise<Variable[]> => {
      console.log(`fetching variables for workspace ${workspace.id}`);
      return dataSources.variablesAPI.getVariablesForWorkspace(workspace.id, filter);
    }
  }
};