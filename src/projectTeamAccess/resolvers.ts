import { Context } from "../server/context";
import { ProjectTeamAccess, ProjectTeamAccessFilter } from "./types";
import { gatherAsyncGeneratorPromises } from "../common/streamPages";

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
    projectTeamAccessById: async (
      _: unknown,
      { id }: { id: string },
      { dataSources }: Context,
    ): Promise<ProjectTeamAccess | null> => {
      return dataSources.projectTeamAccessAPI.getProjectTeamAccess(id);
    },
  },
};
