import { axiosClient } from '../common/httpClient';
import { streamPages } from '../common/streamPages';
import { ProjectTeamAccess, ProjectTeamAccessFilter, ProjectTeamAccessResponse } from './types';
import { projectTeamAccessMapper } from './mapper';

export class ProjectTeamAccessAPI {
  async *listProjectTeamAccess(projectId: string, filter?: ProjectTeamAccessFilter): AsyncGenerator<
    ProjectTeamAccess[],
    void,
    unknown
  > {
    yield* streamPages<ProjectTeamAccess, ProjectTeamAccessFilter>(
      `/projects/${projectId}/teams`,
      projectTeamAccessMapper,
      undefined,
      filter
    );
  }

  async getProjectTeamAccess(id: string): Promise<ProjectTeamAccess> {
    const res = await axiosClient.get<ProjectTeamAccessResponse>(`/project-team-access/${id}`);
    return projectTeamAccessMapper.map(res.data.data);
  }
}