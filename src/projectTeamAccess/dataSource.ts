import type { AxiosInstance } from "axios";
import { streamPages } from "../common/streamPages";
import {
  ProjectTeamAccess,
  ProjectTeamAccessFilter,
  ProjectTeamAccessResponse,
} from "./types";
import { projectTeamAccessMapper } from "./mapper";
import { RequestCache } from "../common/requestCache";

export class ProjectTeamAccessAPI {
  constructor(
    private readonly httpClient: AxiosInstance,
    private readonly requestCache: RequestCache,
  ) {}

  async *listProjectTeamAccess(
    projectId: string,
    filter?: ProjectTeamAccessFilter,
  ): AsyncGenerator<ProjectTeamAccess[], void, unknown> {
    yield* streamPages<ProjectTeamAccess, ProjectTeamAccessFilter>(
      this.httpClient,
      `/team-projects`,
      projectTeamAccessMapper,
      { "filter[project][id]": projectId },
      filter,
    );
  }

  async getProjectTeamAccess(id: string): Promise<ProjectTeamAccess | null> {
    return this.requestCache.getOrSet<ProjectTeamAccess | null>(
      "projectTeamAccess",
      id,
      async () =>
        this.httpClient
          .get<ProjectTeamAccessResponse>(`/team-projects/${id}`)
          .then((res) => projectTeamAccessMapper.map(res.data.data))
          .catch((err) => {
            if (err.status === 404) {
              return null;
            }
            throw err;
          }),
    );
  }
}
