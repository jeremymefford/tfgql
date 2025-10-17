import { Context } from "../server/context";
import { PolicyEvaluation, PolicyEvaluationFilter } from "./types";
import { gatherAsyncGeneratorPromises } from "../common/streamPages";
import { PolicySetOutcome } from "../policySetOutcomes/types";

export const resolvers = {
  Query: {
    policyEvaluations: async (
      _: unknown,
      {
        taskStageId,
        filter,
      }: { taskStageId: string; filter?: PolicyEvaluationFilter },
      { dataSources }: Context,
    ): Promise<PolicyEvaluation[]> => {
      return gatherAsyncGeneratorPromises(
        dataSources.policyEvaluationsAPI.listPolicyEvaluations(
          taskStageId,
          filter,
        ),
      );
    },
  },
  PolicyEvaluation: {
    policySetOutcomes: async (
      evaluation: PolicyEvaluation,
      _: unknown,
      ctx: Context,
    ): Promise<PolicySetOutcome[]> =>
      gatherAsyncGeneratorPromises(
        ctx.dataSources.policySetOutcomesAPI.listPolicySetOutcomes(
          evaluation.id,
        ),
      ),
  },
};
