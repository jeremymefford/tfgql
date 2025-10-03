import { Context } from '../server/context';
import { Variable, VariableFilter } from './types';

export const resolvers = {
    Query: {
        variables: async (_: unknown, { organization, workspaceName, filter }: { organization: string, workspaceName: string, filter?: VariableFilter}, ctx: Context): Promise<Variable[]> => {
            return await ctx.dataSources.variablesAPI.getVariables(organization, workspaceName, filter);
        }
    }
};
