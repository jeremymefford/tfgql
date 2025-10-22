import { Context } from "../server/context";
import { PolicyEvaluation, PolicyEvaluationFilter } from "./types";
import { gatherAsyncGeneratorPromises } from "../common/streamPages";
import { PolicySetOutcome } from "../policySetOutcomes/types";
import { Run } from "../runs/types";

export const getPolicyEvaluationsForRun = async (
  run: Run,
  ctx: Context,
  filter?: PolicyEvaluationFilter,
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

  const evaluations = await Promise.all(
    policyStageIds.map((stageId) =>
      ctx.dataSources.policyEvaluationsAPI.listPolicyEvaluations(
        stageId,
        filter,
      ),
    ),
  );

  return evaluations.flat();
};

export const resolvers = {
  Query: {
    policyEvaluations: async (
      _: unknown,
      {
        taskStageId,
        filter,
      }: { taskStageId: string; filter?: PolicyEvaluationFilter },
      { dataSources }: Context,
    ): Promise<PolicyEvaluation[]> =>
      dataSources.policyEvaluationsAPI.listPolicyEvaluations(
        taskStageId,
        filter,
      ),
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
