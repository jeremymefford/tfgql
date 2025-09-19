import { Context } from '../server/context';
import { VariableSet, VariableSetFilter } from './types';
import { Organization } from '../organizations/types';
import { gatherAsyncGeneratorPromises } from '../common/streamPages';
import { fetchResources } from '../common/fetchResources';
import { Workspace, WorkspaceFilter } from '../workspaces/types';

export const resolvers = {
    Query: {
        variableSet: async (_: unknown, { id }: { id: string }, { dataSources }: Context): Promise<VariableSet | null> => {
            return dataSources.variableSetsAPI.getVariableSet(id);
        },
        variableSets: async (_: unknown, { organization, filter }: { organization: string, filter?: VariableSetFilter }, { dataSources }: Context): Promise<Promise<VariableSet>[]> => {
            return gatherAsyncGeneratorPromises(dataSources.variableSetsAPI.listVariableSetsForOrg(organization, filter));
        }
    },
    VariableSet: {
        organization: async (varset: VariableSet, _: unknown, { dataSources }: Context): Promise<Organization | null> => {
            if (!varset.organizationId) return null;
            return dataSources.organizationsAPI.getOrganization(varset.organizationId);
        },
        workspaces: async (varset: VariableSet, { filter }: { filter?: WorkspaceFilter }, { dataSources }: Context): Promise<Workspace[]> => {
            return fetchResources<string, Workspace, WorkspaceFilter>(
                varset.workspaceIds,
                id => dataSources.workspacesAPI.getWorkspace(id),
                filter);
        },
        // projects: async (varset: VariableSet, _: unknown, { dataSources }: Context): Promise<Project[]> => {
        //     return dataSources.projectsAPI.getProjectsByIds(varset.projectIds);
        // },
        // vars: async (varset: VariableSet, _: unknown, { dataSources }: Context): Promise<Variable[]> => {
        //     return dataSources.variablesAPI.getVariablesByIds(varset.variableIds);
        // },
    }
};
