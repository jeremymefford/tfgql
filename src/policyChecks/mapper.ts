import { DomainMapper } from "../common/middleware/domainMapper";
import { PolicyCheckResource, PolicyCheck } from "./types";

export const policyCheckMapper: DomainMapper<
  PolicyCheckResource,
  PolicyCheck
> = {
  map(resource: PolicyCheckResource): PolicyCheck {
    const attrs = resource.attributes;
    const relationships = resource.relationships ?? {};
    const timestamps = attrs["status-timestamps"] ?? {};
    const rawResult = attrs.result;
    const sentinel =
      rawResult && typeof rawResult === "object"
        ? (rawResult as Record<string, unknown>)["sentinel"]
        : undefined;
    const runRef = relationships.run?.data;
    const outputUrl = (resource as any)?.links?.output ?? null;
    return {
      id: resource.id,
      status: attrs.status,
      scope: attrs.scope,
      result: attrs.result,
      sentinel,
      statusTimestamps: {
        queuedAt: timestamps["queued-at"],
        passedAt: timestamps["passed-at"],
        hardFailedAt: timestamps["hard-failed-at"],
        softFailedAt: timestamps["soft-failed-at"],
        advisoryFailedAt: timestamps["advisory-failed-at"],
        overriddenAt: timestamps["overridden-at"],
      },
      permissions: {
        canOverride: Boolean(attrs.permissions?.["can-override"]),
      },
      actions: {
        isOverridable: Boolean(attrs.actions?.["is-overridable"]),
      },
      createdAt: attrs["created-at"],
      finishedAt: attrs["finished-at"] ?? null,
      runId: runRef?.id,
      outputUrl,
    };
  },
};
