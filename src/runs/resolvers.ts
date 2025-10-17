import { Context } from "../server/context";
import { Workspace } from "../workspaces/types";
import { Run, RunEvent } from "./types";
import { Comment, CommentFilter } from "../comments/types";
import { gatherAsyncGeneratorPromises } from "../common/streamPages";
import { RunTrigger, RunTriggerFilter } from "../runTriggers/types";
import { ConfigurationVersion } from "../configurationVersions/types";
import { Apply } from "../applies/types";
import { Plan } from "../plans/types";
import {
  PolicyEvaluation,
  PolicyEvaluationFilter,
} from "../policyEvaluations/types";

export const resolvers = {
  Query: {
    runs: async (
      _: unknown,
      { workspaceId }: { workspaceId: string },
      ctx: Context,
    ): Promise<Run[]> => {
      return gatherAsyncGeneratorPromises(
        ctx.dataSources.runsAPI.listRuns(workspaceId),
      );
    },
    run: async (
      _: unknown,
      { id }: { id: string },
      ctx: Context,
    ): Promise<Run | null> => {
      return ctx.dataSources.runsAPI.getRun(id);
    },
  },
  Run: {
    workspace: async (
      run: Run,
      _: unknown,
      ctx: Context,
    ): Promise<Workspace | null> => {
      const workspaceId = run.workspace?.id;
      if (!workspaceId) return null;
      return ctx.dataSources.workspacesAPI.getWorkspace(workspaceId);
    },
    configurationVersion: async (
      run: Run,
      _: unknown,
      ctx: Context,
    ): Promise<ConfigurationVersion | null> => {
      const cvId = run.configurationVersion?.id;
      if (!cvId) return null;
      return ctx.dataSources.configurationVersionsAPI.getConfigurationVersion(
        cvId,
      );
    },
    comments: async (
      run: Run,
      { filter }: { filter?: CommentFilter },
      ctx: Context,
    ): Promise<Comment[]> =>
      gatherAsyncGeneratorPromises(
        ctx.dataSources.commentsAPI.listComments(run.id, filter),
      ),
    runEvents: async (
      run: Run,
      _: unknown,
      ctx: Context,
    ): Promise<RunEvent[]> =>
      gatherAsyncGeneratorPromises(
        ctx.dataSources.runsAPI.listRunEvents(run.id),
      ),
    runTriggers: async (
      run: Run,
      { filter }: { filter?: RunTriggerFilter },
      ctx: Context,
    ): Promise<RunTrigger[]> =>
      gatherAsyncGeneratorPromises(
        ctx.dataSources.runTriggersAPI.listRunTriggers(
          run.workspace?.id ?? "",
          filter,
        ),
      ),
    apply: async (run: Run, _: unknown, ctx: Context): Promise<Apply | null> =>
      ctx.dataSources.appliesAPI.getRunApply(run.id),
    plan: async (run: Run, _: unknown, ctx: Context): Promise<Plan | null> =>
      ctx.dataSources.plansAPI.getPlanForRun(run.id),
    policyEvaluations: async (
      run: Run,
      { filter }: { filter?: PolicyEvaluationFilter },
      ctx: Context,
    ): Promise<PolicyEvaluation[]> => {
      const stageIds = run.taskStageIds ?? [];
      if (stageIds.length === 0) {
        return [];
      }

      const stages = await Promise.all(
        stageIds.map((stageId) =>
          ctx.dataSources.taskStagesAPI.getTaskStage(stageId),
        ),
      );

      const policyStageIds = stages
        .filter((stage): stage is NonNullable<typeof stage> => Boolean(stage))
        .filter((stage) => stage.policyEvaluationIds.length > 0)
        .map((stage) => stage.id);

      if (policyStageIds.length === 0) {
        return [];
      }

      const evaluations: PolicyEvaluation[] = [];
      for (const stageId of policyStageIds) {
        const results = await gatherAsyncGeneratorPromises(
          ctx.dataSources.policyEvaluationsAPI.listPolicyEvaluations(
            stageId,
            filter,
          ),
        );
        evaluations.push(...results);
      }

      return evaluations;
    },
  },
};
