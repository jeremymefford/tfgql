import { axiosClient } from '../common/httpClient';
import { isNotFound } from '../common/http';
import { Project, ProjectFilter, ProjectResponse } from './types';
import { projectsMapper } from './mapper';
import { streamPages } from '../common/streamPages';

export class ProjectsAPI {
    async getProject(id: string): Promise<Project | null> {
        return axiosClient.get<ProjectResponse>(`/projects/${id}`)
            .then(res => projectsMapper.map(res.data.data))
            .catch(err => {
                if (isNotFound(err)) {
                    return null;
                }
                throw err;
            });
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
