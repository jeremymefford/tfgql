import { DomainMapper } from "../common/middleware/domainMapper";
import { ApplyResource, Apply } from "./types";

export const applyMapper: DomainMapper<ApplyResource, Apply> = {
  map(resource: ApplyResource): Apply {
    const attrs = resource.attributes;
    return {
      id: resource.id,
      mode: attrs["execution-details"]?.mode,
      status: attrs.status,
      queuedAt: attrs["status-timestamps"]["agent-queued-at"],
      startedAt: attrs["status-timestamps"]["started-at"],
      finishedAt: attrs["status-timestamps"]["finished-at"],
      logReadUrl: attrs["log-read-url"],
      resourceAdditions: attrs["resource-additions"],
      resourceChanges: attrs["resource-changes"],
      resourceDestructions: attrs["resource-destructions"],
      resourceImports: attrs["resource-imports"],
      structuredRunOutputEnabled: attrs["structured-run-output-enabled"],
      stateVersionIds:
        resource.relationships?.["state-versions"]?.data.map((rel) => rel.id) ||
        [],
    };
  },
};
