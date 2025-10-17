import { DomainMapper } from "../common/middleware/domainMapper";
import {
  PolicyEvaluationResource,
  PolicyEvaluation,
} from "./types";

export const policyEvaluationMapper: DomainMapper<
  PolicyEvaluationResource,
  PolicyEvaluation
> = {
  map(resource: PolicyEvaluationResource): PolicyEvaluation {
    const attrs = resource.attributes;
    const rc = attrs["result-count"];
    const ts = attrs["status-timestamps"] ?? {};
    const policyAttachableRef = resource.relationships?.["policy-attachable"]
      ?.data;
    const policyOutcomeIds =
      resource.relationships?.["policy-set-outcomes"]?.data?.map(
        (ref): string => ref.id,
      ) ?? [];
    return {
      id: resource.id,
      status: attrs.status,
      policyKind: attrs["policy-kind"],
      resultCount: {
        advisoryFailed: rc["advisory-failed"],
        errored: rc.errored,
        mandatoryFailed: rc["mandatory-failed"],
        passed: rc.passed,
      },
      statusTimestamps: {
        passedAt: ts["passed-at"],
        queuedAt: ts["queued-at"],
        runningAt: ts["running-at"],
        erroredAt: ts["errored-at"],
      },
      createdAt: attrs["created-at"],
      updatedAt: attrs["updated-at"],
      policyAttachableId: policyAttachableRef?.id,
      policySetOutcomeIds: policyOutcomeIds,
    };
  },
};
