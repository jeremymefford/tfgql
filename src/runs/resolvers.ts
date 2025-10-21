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
import { PolicyCheck, PolicyCheckFilter } from "../policyChecks/types";
import { getPolicyEvaluationsForRun } from "../policyEvaluations/resolvers";
import { coalesceOrgs } from "../common/orgHelper";
import { parallelizeBounded } from "../common/concurrency/parallelizeBounded";

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
    runsWithOverriddenPolicy: async (
      _: unknown,
      {
        includeOrgs,
        excludeOrgs,
        filter,
      }: { includeOrgs?: string[]; excludeOrgs?: string[]; filter?: any },
      ctx: Context,
    ): Promise<Run[]> => {
      const orgs = await coalesceOrgs(ctx, includeOrgs, excludeOrgs);
      const runs: Run[] = [];
      await parallelizeBounded(orgs, async (orgId) => {
        for await (const workspacePage of ctx.dataSources.workspacesAPI.listWorkspaces(orgId)) {
          for (const workspace of workspacePage) {
            for await (const runPage of ctx.dataSources.runsAPI.listRuns(workspace.id, filter)) {
              await parallelizeBounded(runPage, async (run) => {
                const policyChecks = await ctx.dataSources.policyChecksAPI.listPolicyChecks(run.id);
                const policyEvals = await getPolicyEvaluationsForRun(run, ctx, undefined);
                if (policyChecks.some((check) => check.statusTimestamps.overriddenAt) ||
                  policyEvals.some((policyEval) => policyEval.status === "overridden")) {
                  runs.push(run);
                }
              });
            }
          }
        }
      });
      return runs;
    }
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
    policyEvaluations: (run: Run, args: { filter?: PolicyEvaluationFilter }, ctx: Context) =>
      getPolicyEvaluationsForRun(run, ctx, args.filter),
    policyChecks: async (
      run: Run,
      { filter }: { filter?: PolicyCheckFilter },
      ctx: Context,
    ): Promise<PolicyCheck[]> =>
      ctx.dataSources.policyChecksAPI.listPolicyChecks(run.id, filter),
  },
};
