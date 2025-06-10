import { gatherAsyncGeneratorPromises } from '../common/streamPages';
import { Context } from '../server/context';
import { Project, ProjectFilter } from './types';
import { ProjectTeamAccess, ProjectTeamAccessFilter } from '../projectTeamAccess/types';

export const resolvers = {
    Query: {
        projects: async (
            _: unknown,
            { organization, filter }: { organization: string; filter?: ProjectFilter },
            { dataSources }: Context
        ): Promise<Promise<Project>[]> =>
            gatherAsyncGeneratorPromises(dataSources.projectsAPI.getProjects(organization, filter)),
    },
    Project: {
        teamAccess: (
            project: Project,
            { filter }: { filter?: ProjectTeamAccessFilter },
            { dataSources }: Context
        ): Promise<Promise<ProjectTeamAccess>[]> =>
            gatherAsyncGeneratorPromises(
                dataSources.projectTeamAccessAPI.listProjectTeamAccess(project.id, filter)
            ),
    },
};
