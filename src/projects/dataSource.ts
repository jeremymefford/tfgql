import type { AxiosInstance } from "axios";
import { isNotFound } from "../common/http";
import { Project, ProjectFilter, ProjectResponse } from "./types";
import { projectsMapper } from "./mapper";
import { streamPages } from "../common/streamPages";
import { RequestCache } from "../common/requestCache";

export class ProjectsAPI {
  constructor(
    private readonly httpClient: AxiosInstance,
    private readonly requestCache: RequestCache,
  ) {}

  async getProject(id: string): Promise<Project | null> {
    return this.requestCache.getOrSet<Project | null>(
      "ProjectGET",
      id,
      async () =>
        this.httpClient
          .get<ProjectResponse>(`/projects/${id}`)
          .then((res) => projectsMapper.map(res.data.data))
          .catch((err) => {
            if (isNotFound(err)) {
              return null;
            }
            throw err;
          }),
    );
  }

  async *getProjects(
    orgName: string,
    filter?: ProjectFilter,
  ): AsyncGenerator<Project[], void, unknown> {
    yield* streamPages<Project, ProjectFilter>(
      this.httpClient,
      `/organizations/${orgName}/projects`,
      projectsMapper,
      {},
      filter,
    );
  }

  async getProjectByName(
    orgName: string,
    projectName: string,
  ): Promise<Project | null> {
    const cacheKey = `${orgName}:${projectName}`;
    return this.requestCache.getOrSet<Project | null>(
      "ProjectByNameGET",
      cacheKey,
      async () => {
        for await (const page of this.getProjects(orgName, {
          name: { _eq: projectName },
        })) {
          const match = page.find((project) => project.name === projectName);
          if (match) {
            return match;
          }
        }
        return null;
      },
    );
  }
}
