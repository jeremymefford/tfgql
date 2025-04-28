import { axiosClient } from '../common/httpClient';
import { Project, ProjectFilter, ProjectResponse } from './types';
import { projectsMapper } from './mapper';
import { streamPages } from '../common/streamPages';

export class ProjectsAPI {
    async getProject(id: string): Promise<Project> {
        const res = await axiosClient.get<ProjectResponse>(`/projects/${id}`);
        return projectsMapper.map(res.data.data);
    }

    async *getProjects(orgName: string, filter?: ProjectFilter): AsyncGenerator<Project[], void, unknown> {
        yield* streamPages<Project, ProjectFilter>(
            `/organizations/${orgName}/projects`,
            projectsMapper,
            {},
            filter
        );
    }
}
