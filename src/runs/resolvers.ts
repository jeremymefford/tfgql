import { Context } from "../server/context";
import { Workspace } from "../workspaces/types";
import { Run, RunEvent } from "./types";
import { Comment, CommentFilter } from "../comments/types";
import { gatherAsyncGeneratorPromises } from "../common/streamPages";
import { RunTrigger, RunTriggerFilter } from "../runTriggers/types";
import { ConfigurationVersionsAPI } from "../configurationVersions/dataSource";
import { ConfigurationVersion } from "../configurationVersions/types";
import { Apply, ApplyFilter } from "../applies/types";
import { Plan } from "../plans/types";

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
    workspace: async (run: Run, _: unknown, { dataSources }: Context): Promise<Workspace | null> => {
      const workspaceId = run.workspace?.id;
      if (!workspaceId) return null;
      return dataSources.workspacesAPI.getWorkspace(workspaceId);
    },
    configurationVersion: async (run: Run, _: unknown, { dataSources }: Context): Promise<ConfigurationVersion | null> => {
      const cvId = run.configurationVersion?.id;
      if (!cvId) return null;
      return dataSources.configurationVersionsAPI.getConfigurationVersion(cvId);
    },
    comments: async (
      run: Run,
      { filter }: { filter?: CommentFilter },
      { dataSources }: Context
    ): Promise<Promise<Comment>[]> =>
      gatherAsyncGeneratorPromises(
        dataSources.commentsAPI.listComments(run.id, filter)
      ),
    runEvents: async (
      run: Run,
      _: unknown,
      { dataSources }: Context
    ): Promise<Promise<RunEvent>[]> =>
      gatherAsyncGeneratorPromises(
        dataSources.runsAPI.listRunEvents(run.id)
      ),
    runTriggers: async (
      run: Run,
      { filter }: { filter?: RunTriggerFilter },
      { dataSources }: Context
    ): Promise<Promise<RunTrigger>[]> =>
      gatherAsyncGeneratorPromises(
        dataSources.runTriggersAPI.listRunTriggers(run.workspace?.id ?? "", filter)
      ),
    apply: async (
      run: Run,
      _: unknown,
      { dataSources }: Context
    ): Promise<Apply | null> => 
      dataSources.appliesAPI.getRunApply(run.id),
    plan: async (
      run: Run,
      _: unknown,
      { dataSources }: Context
    ): Promise<Plan | null> => 
      dataSources.plansAPI.getPlanForRun(run.id)
  }
};