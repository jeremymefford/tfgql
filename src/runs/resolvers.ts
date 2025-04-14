import { Context } from "../server/context";
import { Workspace } from "../workspaces/types";
import { Run } from "./types";
import { gatherAsyncGeneratorPromises } from "../common/streamPages";
import { ConfigurationVersionsAPI } from "../configuration-versions/dataSource";
import { ConfigurationVersion } from "../configuration-versions/types";

export const resolvers = {
  Query: {
    runs: async (_: unknown, { workspaceId }: { workspaceId: string }, { dataSources }: Context): Promise<Promise<Run>[]> => {
      return gatherAsyncGeneratorPromises(
        dataSources.runsAPI.listRuns(workspaceId)
      );
    },
    run: async (_: unknown, { id }: { id: string }, { dataSources }: Context): Promise<Run | null> => {
      return dataSources.runsAPI.getRun(id);
    }
  },
  Run: {
    workspace: async (run: Run, args: unknown, context: Context, info: any): Promise<Workspace | null> => {
      const workspaceId = run.workspace?.id;
      if (!workspaceId) return null;
      const workspace = await context.dataSources.workspacesAPI.getWorkspace(workspaceId);
      return workspace;
    },
    configurationVersion: async (run: Run, args: unknown, context: Context, info: any): Promise<ConfigurationVersion | null> => {
      const configurationVersionId = run.configurationVersion?.id;
      if (!configurationVersionId) return null;
      const configurationVersion = await context.dataSources.configurationVersionsAPI.getConfigurationVersion(configurationVersionId);
      return configurationVersion;
    }
  }
};