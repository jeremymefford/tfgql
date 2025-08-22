import { axiosClient } from '../common/httpClient';
import { streamPages } from '../common/streamPages';
import { ProjectTeamAccess, ProjectTeamAccessFilter, ProjectTeamAccessResponse } from './types';
import { projectTeamAccessMapper } from './mapper';

export class ProjectTeamAccessAPI {
  async *listProjectTeamAccess(
    projectId: string,
    filter?: ProjectTeamAccessFilter
  ): AsyncGenerator<ProjectTeamAccess[], void, unknown> {
    yield* streamPages<ProjectTeamAccess, ProjectTeamAccessFilter>(
      `/team-projects`,
      projectTeamAccessMapper,
      undefined,
      filter
        ? { _and: [filter, { projectId: { _eq: projectId } }] }
        : { projectId: { _eq: projectId } }
    );
  }

  async getProjectTeamAccess(id: string): Promise<ProjectTeamAccess | null> {
    return axiosClient.get<ProjectTeamAccessResponse>(`/team-projects/${id}`)
      .then(res => projectTeamAccessMapper.map(res.data.data))
      .catch(err => {
        if (err.status === 404) {
          return null;
        }
        throw err;
      });
  }
}