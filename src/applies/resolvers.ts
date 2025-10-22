import { Context } from "../server/context";
import { Apply, ApplyFilter } from "./types";
import { parallelizeBounded } from "../common/concurrency/parallelizeBounded";
import { Run } from "../runs/types";
import { evaluateWhereClause } from "../common/filtering/filtering";
import { StateVersion, StateVersionFilter } from "../stateVersions/types";
import { fetchArchivistJsonLines } from "../common/http";

export const resolvers = {
  Query: {
    applyForRun: async (
      _: unknown,
      { runId }: { runId: string },
      { dataSources }: Context,
    ): Promise<Apply | null> => {
      return dataSources.appliesAPI.getRunApply(runId);
    },
    apply: async (
      _: unknown,
      { id }: { id: string },
      { dataSources }: Context,
    ): Promise<Apply | null> => {
      return dataSources.appliesAPI.getApply(id);
    },
    appliesForWorkspace: async (
      _: unknown,
      { workspaceId, filter }: { workspaceId: string; filter: ApplyFilter },
      ctx: Context,
    ): Promise<Apply[]> => {
      const results: Apply[] = [];
      for await (const runPage of ctx.dataSources.runsAPI.listRuns(
        workspaceId,
      )) {
        if (!runPage || runPage.length === 0) {
          continue;
        }
        await parallelizeBounded(runPage, async (run: Run) => {
          const apply = await ctx.dataSources.appliesAPI.getRunApply(run.id);
          if (apply && evaluateWhereClause(filter, apply)) {
            results.push(apply);
          }
        });
      }
      return results;
    },
    appliesForProject: async (
      _: unknown,
      { projectId, filter }: { projectId: string; filter: ApplyFilter },
      ctx: Context,
    ): Promise<Apply[]> => {
      const results: Apply[] = [];
      for await (const workspacePage of ctx.dataSources.workspacesAPI.getWorkspacesByProjectId(
        projectId,
      )) {
        if (!workspacePage || workspacePage.length === 0) {
          continue;
        }
        for (const workspace of workspacePage) {
          const applies = await resolvers.Query.appliesForWorkspace(
            null,
            { workspaceId: workspace.id, filter: filter },
            ctx,
          );
          results.push(...applies);
        }
      }
      return results;
    },
    appliesForOrganization: async (
      _: unknown,
      {
        organizationId,
        filter,
      }: { organizationId: string; filter: ApplyFilter },
      ctx: Context,
    ): Promise<Apply[]> => {
      const results: Apply[] = [];
      for await (const workspacePage of ctx.dataSources.workspacesAPI.listWorkspaces(
        organizationId,
      )) {
        if (!workspacePage || workspacePage.length === 0) {
          continue;
        }
        for (const workspace of workspacePage) {
          const applies = await resolvers.Query.appliesForWorkspace(
            null,
            { workspaceId: workspace.id, filter },
            ctx,
          );
          results.push(...applies);
        }
      }
      return results;
    },
  },
  Apply: {
    stateVersions: async (
      apply: Apply,
      { filter }: { filter?: StateVersionFilter },
      ctx: Context,
    ): Promise<StateVersion[]> => {
      const ret: StateVersion[] = [];
      await parallelizeBounded(apply.stateVersionIds || [], async (svId) => {
        const sv = await ctx.dataSources.stateVersionsAPI.getStateVersion(svId);
        if (sv && (!filter || evaluateWhereClause(filter, sv))) {
          ret.push(sv);
        }
      });
      return ret;
    },
    applyLog: async (
      apply: Apply,
      { minimumLevel = "TRACE" }: { minimumLevel?: string },
      ctx: Context,
    ): Promise<Record<string, unknown>[] | null> => {
      const logReadUrl = apply.logReadUrl;
      if (!logReadUrl) {
        return null;
      }
      return fetchArchivistJsonLines(ctx.httpClient, logReadUrl, {
        minimumLevel,
      });
    },
  },
};
