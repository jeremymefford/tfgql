import { parallelizeBounded } from "../common/concurrency/parallelizeBounded";
import { coalesceOrgs } from "../common/orgHelper";
import { Context } from "../server/context";
import { Workspace } from "../workspaces/types";
import { Variable, VariableFilter } from "./types";

export const resolvers = {
  Query: {
    variables: async (
      _: unknown,
      {
        organization,
        workspaceName,
        filter,
      }: {
        organization: string;
        workspaceName: string;
        filter?: VariableFilter;
      },
      ctx: Context,
    ): Promise<Variable[]> => {
      return await ctx.dataSources.variablesAPI.getVariables(
        organization,
        workspaceName,
        filter,
      );
    },
    workspacesWithTFLogCategory: async (
      _: unknown,
      {
        includeOrgs,
        excludeOrgs,
        categories,
      }: { includeOrgs: string[]; excludeOrgs: string[]; categories: string[] },
      ctx: Context,
    ): Promise<Workspace[]> => {
      const orgs = await coalesceOrgs(ctx, includeOrgs, excludeOrgs);
      if (orgs.length === 0) {
        return [];
      }
      const result: Workspace[] = [];
      await parallelizeBounded(orgs, async (orgId) => {
        for await (const workspacePage of ctx.dataSources.workspacesAPI.listWorkspaces(
          orgId,
        )) {
          await parallelizeBounded([...workspacePage], async (workspace) => {
            const vars = await ctx.dataSources.variablesAPI.getVariables(
              orgId,
              workspace.name,
              { key: { _eq: "TF_LOG" } },
            );
            if (vars.length > 0 && categories.includes(vars[0].value)) {
              result.push(workspace);
            }
          });
        }
      });
      return result;
    },
  },
};
