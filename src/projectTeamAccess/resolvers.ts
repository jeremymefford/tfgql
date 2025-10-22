import { Context } from "../server/context";
import { ProjectTeamAccess, ProjectTeamAccessFilter } from "./types";
import { gatherAsyncGeneratorPromises } from "../common/streamPages";
import { parallelizeBounded } from "../common/concurrency/parallelizeBounded";

export const resolvers = {
  Query: {
    projectTeamAccessByProject: async (
      _: unknown,
      {
        projectId,
        filter,
      }: { projectId: string; filter?: ProjectTeamAccessFilter },
      { dataSources }: Context,
    ): Promise<ProjectTeamAccess[]> => {
      return gatherAsyncGeneratorPromises(
        dataSources.projectTeamAccessAPI.listProjectTeamAccess(
          projectId,
          filter,
        ),
      );
    },
    projectTeamAccessByTeam: async (
      _: unknown,
      {
        teamId,
        filter,
      }: { teamId: string; filter?: ProjectTeamAccessFilter },
      { dataSources }: Context,
    ): Promise<ProjectTeamAccess[]> => {
      const result: ProjectTeamAccess[] = [];
      const team = await dataSources.teamsAPI.getTeam(teamId);
      if (!team) {
        return result;
      }
      const orgId = team.organizationId;
      for await (const page of dataSources.projectsAPI.listProjects(orgId)) {
        await parallelizeBounded(page, async (project) => {
          const projectTeamAccess = await gatherAsyncGeneratorPromises(dataSources.projectTeamAccessAPI.listProjectTeamAccess(project.id, filter));
          const teamAccess = projectTeamAccess.filter((access) => access.teamId === teamId);
          if (teamAccess.length > 0) {
            result.push(...teamAccess);
          }
        });
      }
      return result;
    },
    projectTeamAccessById: async (
      _: unknown,
      { id }: { id: string },
      { dataSources }: Context,
    ): Promise<ProjectTeamAccess | null> => {
      return dataSources.projectTeamAccessAPI.getProjectTeamAccess(id);
    },
  },
  ProjectTeamAccess: {
    project: async (
      access: ProjectTeamAccess,
      _: unknown,
      { dataSources }: Context,
    ) => dataSources.projectsAPI.getProject(access.projectId),
    team: async (
      access: ProjectTeamAccess,
      _: unknown,
      { dataSources }: Context,
    ) => dataSources.teamsAPI.getTeam(access.teamId),
  },
};
