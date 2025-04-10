import { Context } from "../server/context";
import { Workspace } from "../workspaces/types";
import { Run } from "./types";

export const resolvers = {
  Query: {
    runs: async (_: unknown, { workspaceId }: { workspaceId: string }, { dataSources }: Context): Promise<Run[]> => {
      const runResources = await dataSources.runsAPI.listRuns(workspaceId);
      return runResources;
    },
    run: async (_: unknown, { id }: { id: string }, { dataSources }: Context): Promise<Run | null> => {
      const run = await dataSources.runsAPI.getRun(id);
      return run;
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