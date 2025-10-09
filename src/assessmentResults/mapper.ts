import { DomainMapper } from "../common/middleware/domainMapper";
import { AssessmentResultResource, AssessmentResult } from "./types";

export const assessmentResultMapper: DomainMapper<
  AssessmentResultResource,
  AssessmentResult
> = {
  map(resource: AssessmentResultResource): AssessmentResult {
    const attrs = resource.attributes;
    return {
      id: resource.id,
      drifted: attrs.drifted,
      succeeded: attrs.succeeded,
      errorMessage: attrs["error-msg"],
      createdAt: attrs["created-at"],
    };
  },
};
