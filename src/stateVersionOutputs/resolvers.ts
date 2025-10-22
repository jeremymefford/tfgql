import { Context } from "../server/context";
import { StateVersionOutput, StateVersionOutputFilter } from "./types";
import { gatherAsyncGeneratorPromises } from "../common/streamPages";
import { coalesceOrgs } from "../common/orgHelper";
import { parallelizeBounded } from "../common/concurrency/parallelizeBounded";

export const resolvers = {
  Query: {
    stateVersionOutputs: async (
      _: unknown,
      {
        stateVersionId,
        filter,
      }: { stateVersionId: string; filter?: StateVersionOutputFilter },
      { dataSources }: Context,
    ): Promise<StateVersionOutput[]> =>
      dataSources.stateVersionOutputsAPI.listStateVersionOutputs(
        stateVersionId,
        filter,
      ),
    stateVersionOutput: async (
      _: unknown,
      { id }: { id: string },
      { dataSources }: Context,
    ): Promise<StateVersionOutput | null> => {
      return dataSources.stateVersionOutputsAPI.getStateVersionOutput(id);
    },
    searchStateVersionOutputs: async (
      _: unknown,
      {
        includeOrgs,
        excludeOrgs,
        filter,
      }: {
        includeOrgs?: string[];
        excludeOrgs?: string[];
        filter?: StateVersionOutputFilter;
      },
      ctx: Context,
    ): Promise<StateVersionOutput[]> => {
      const results: StateVersionOutput[] = [];
      const orgs = await coalesceOrgs(ctx, includeOrgs, excludeOrgs);
      if (orgs.length === 0) {
        return results;
      }
      await parallelizeBounded(orgs, async (orgId) => {
        for await (const page of ctx.dataSources.workspacesAPI.listWorkspaces(
          orgId,
        )) {
          await parallelizeBounded(page, async (workspace) => {
            const stateVersions = await gatherAsyncGeneratorPromises(
              ctx.dataSources.stateVersionsAPI.listStateVersions(
                orgId,
                workspace.name,
              ),
            );
            for (const stateVersion of stateVersions) {
              const stateVersionOutputs =
                await ctx.dataSources.stateVersionOutputsAPI.listStateVersionOutputs(
                  stateVersion.id,
                  filter,
                );
              results.push(...stateVersionOutputs);
            }
          });
        }
      });
      return results;
    },
  },
  StateVersionOutput: {
    stateVersion: async (
      output: StateVersionOutput,
      _: unknown,
      { dataSources }: Context,
    ) =>
      dataSources.stateVersionsAPI.getStateVersion(output.stateVersionId ?? ""),
  },
};
