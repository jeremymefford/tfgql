import { Context } from "../server/context";
import { Workspace } from "../workspaces/types";
import { Run } from "./types";
import { gatherAsyncGeneratorPromises } from "../common/streamPages";

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
    }
    
  }
};