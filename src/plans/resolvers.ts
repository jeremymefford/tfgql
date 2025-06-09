import { Context } from '../server/context';
import { Plan, PlanFilter } from './types';
import { gatherAsyncGeneratorPromises } from '../common/streamPages';
import {
  StateVersionOutput,
  StateVersionOutputFilter
} from '../stateVersionOutputs/types';

export const resolvers = {
  Query: {
    plans: async (
      _: unknown,
      { runId, filter }: { runId: string; filter?: PlanFilter },
      { dataSources }: Context
    ): Promise<Promise<Plan>[]> =>
      gatherAsyncGeneratorPromises(dataSources.plansAPI.listPlans(runId, filter)),
    plan: async (
      _: unknown,
      { id }: { id: string },
      { dataSources }: Context
    ): Promise<Plan | null> => dataSources.plansAPI.getPlan(id)
  },
  Plan: {
    stateVersions: async (
      plan: Plan,
      { filter }: { filter?: StateVersionOutputFilter },
      { dataSources }: Context
    ): Promise<Promise<StateVersionOutput>[]> => {
      let all: Promise<StateVersionOutput>[] = [];
      for (const svId of plan.stateVersionIds) {
        const batch = await gatherAsyncGeneratorPromises(
          dataSources.stateVersionOutputsAPI.listStateVersionOutputs(svId, filter)
        );
        all = all.concat(batch);
      }
      return all;
    },
    jsonOutputUrl: (plan: Plan, _: unknown, { dataSources }: Context) =>
      dataSources.plansAPI.getPlanJsonOutputUrl(plan.id)
  }
};