import { DomainMapper } from "../common/middleware/domainMapper";
import { PolicySetOutcomeResource, PolicySetOutcome } from "./types";

export const policySetOutcomeMapper: DomainMapper<
  PolicySetOutcomeResource,
  PolicySetOutcome
> = {
  map(resource: PolicySetOutcomeResource): PolicySetOutcome {
    const attrs = resource.attributes;
    const relationships = resource.relationships ?? {};
    return {
      id: resource.id,
      outcomes: attrs.outcomes,
      error: attrs.error ?? null,
      warnings: Array.isArray(attrs.warnings) ? attrs.warnings : [],
      overridable: attrs.overridable,
      policySetName: attrs["policy-set-name"],
      policySetDescription: attrs["policy-set-description"] ?? null,
      resultCount: {
        advisoryFailed: attrs["result-count"]["advisory-failed"],
        mandatoryFailed: attrs["result-count"]["mandatory-failed"],
        passed: attrs["result-count"].passed,
        errored: attrs["result-count"].errored,
      },
      policyToolVersion: attrs["policy-tool-version"],
      policyEvaluationId: relationships["policy-evaluation"]?.data?.id,
    };
  },
};
