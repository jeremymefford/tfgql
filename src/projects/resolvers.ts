import { gatherAsyncGeneratorPromises } from '../common/streamPages';
import { Context } from '../server/context';
import { Project, ProjectFilter } from './types';

export const resolvers = {
    Query: {
        projects: async (_: unknown, { organization, filter }: { organization: string, filter?: ProjectFilter }, { dataSources }: Context): Promise<Promise<Project>[]> => {
            console.log(`organization: ${organization}`);
            console.log(`filter: ${JSON.stringify(filter)}`);
            return gatherAsyncGeneratorPromises(dataSources.projectsAPI.getProjects(organization, filter));
        }
    }
};
