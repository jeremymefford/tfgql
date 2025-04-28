import { Context } from '../server/context';
import { Variable, VariableFilter } from './types';

export const resolvers = {
    Query: {
        variables: async (_: unknown, { organization, workspaceName, filter }: { organization: string, workspaceName: string, filter?: VariableFilter}, { dataSources }: Context): Promise<Variable[]> => {
            return await dataSources.variablesAPI.getVariables(organization, workspaceName, filter);
        }
    }
};
