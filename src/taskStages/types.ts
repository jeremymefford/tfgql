import { ResourceObject, SingleResponse } from "../common/types/jsonApi";

export interface TaskStageAttributes {
  status?: string;
  stage?: string;
  "run-stage"?: string;
  "stage-type"?: string;
  "status-timestamps"?: Record<string, string | undefined>;
  "created-at"?: string;
  "updated-at"?: string;
}

export interface TaskStageRelationships {
  "policy-evaluations"?: {
    data?: { id: string; type: string }[];
  };
}

export type TaskStageResource = ResourceObject<TaskStageAttributes> & {
  relationships?: TaskStageRelationships;
};

export type TaskStageResponse = SingleResponse<TaskStageResource>;

export interface TaskStage {
  id: string;
  stage?: string;
  status?: string;
  policyEvaluationIds: string[];
}
