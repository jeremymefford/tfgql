import { DomainMapper } from "../common/middleware/domainMapper";
import { TaskStageResource, TaskStage } from "./types";

const normalizeStageName = (value?: string): string | undefined => {
  if (!value) return undefined;
  return value.toLowerCase();
};

const normalizeStatus = (value?: string): string | undefined => {
  if (!value) return undefined;
  return value.toLowerCase();
};

export const taskStageMapper: DomainMapper<TaskStageResource, TaskStage> = {
  map(resource: TaskStageResource): TaskStage {
    const attrs = resource.attributes ?? {};
    const relationships = resource.relationships ?? {};

    const stageValue =
      attrs.stage ?? attrs["run-stage"] ?? attrs["stage-type"] ?? undefined;

    const policyEvalIds =
      relationships["policy-evaluations"]?.data?.map((ref): string => ref.id) ??
      [];

    return {
      id: resource.id,
      stage: normalizeStageName(stageValue),
      status: normalizeStatus(attrs.status),
      policyEvaluationIds: policyEvalIds,
    };
  },
};
