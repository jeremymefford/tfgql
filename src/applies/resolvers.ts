import { Context } from '../server/context';
import { Apply, ApplyFilter } from './types';
import { gatherAsyncGeneratorPromises } from '../common/streamPages';
import { run } from 'node:test';
import { parallelizeBounded } from '../common/concurrency/parallelizeBounded';
import { Run } from '../runs/types';
import { evaluateWhereClause } from '../common/filtering/filtering';

export const resolvers = {
  Query: {
    applyForRun: async (
      _: unknown,
      { runId }: { runId: string },
      { dataSources }: Context
    ): Promise<Apply | null> => {
      return dataSources.appliesAPI.getRunApply(runId);
    },
    apply: async (
      _: unknown,
      { id }: { id: string },
      { dataSources }: Context
    ): Promise<Apply | null> => {
      return dataSources.appliesAPI.getApply(id);
    },
    appliesForWorkspace: async (
      _: unknown,
      { workspaceId, filter }: { workspaceId: string; filter: ApplyFilter },
      { dataSources }: Context
    ): Promise<Apply[]> => {
      const results: Apply[] = [];
      for await (const runPage of dataSources.runsAPI.listRuns(workspaceId)) {
        if (!runPage || runPage.length === 0) {
          continue;
        }
        await parallelizeBounded(runPage, async (run: Run) => {
          const apply = await dataSources.appliesAPI.getRunApply(run.id);
          if (evaluateWhereClause(filter, apply)) {
            results.push(apply);
          }
        });
      }
      return results;
    },
    appliesForProject: async (
      _: unknown,
      { projectId, filter }: { projectId: string; filter: ApplyFilter },
      { dataSources }: Context
    ): Promise<Apply[]> => {
      // TODO: Implement logic to fetch applies for project
      return [];
    },
    appliesForOrganization: async (
      _: unknown,
      { organizationId, filter }: { organizationId: string; filter: ApplyFilter },
      { dataSources }: Context
    ): Promise<Apply[]> => {
      // TODO: Implement logic to fetch applies for organization
      return [];
    }
  }
};