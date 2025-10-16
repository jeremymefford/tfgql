import { DomainMapper } from "../common/middleware/domainMapper";
import { PolicySetResource, PolicySet } from "./types";

export const policySetMapper: DomainMapper<PolicySetResource, PolicySet> = {
  map(resource: PolicySetResource): PolicySet {
    const attrs = resource.attributes;
    return {
      id: resource.id,
      name: attrs.name,
      description: attrs.description,
      kind: attrs.kind,
      global: attrs.global,
      agentEnabled: attrs["agent-enabled"],
      policyToolVersion: attrs["policy-tool-version"],
      overridable: attrs.overridable,
      workspaceCount: attrs["workspace-count"],
      policyCount: attrs["policy-count"] ?? undefined,
      policiesPath: attrs["policies-path"] ?? undefined,
      versioned: attrs.versioned,
      createdAt: attrs["created-at"],
      updatedAt: attrs["updated-at"],
      vcsRepo: attrs["vcs-repo"]
        ? {
            branch: attrs["vcs-repo"].branch ?? null,
            identifier: attrs["vcs-repo"].identifier,
            ingressSubmodules: attrs["vcs-repo"]["ingress-submodules"],
            oauthTokenId: attrs["vcs-repo"]["oauth-token-id"],
            githubAppInstallationId:
              attrs["vcs-repo"]["github-app-installation-id"],
          }
        : undefined,
      organizationId: resource.relationships!.organization.data.id,
      policyIds: resource.relationships?.policies?.data.map((r) => r.id) ?? [],
      projectIds: resource.relationships?.projects?.data.map((r) => r.id) ?? [],
      projectCount: resource.relationships?.projects?.data?.length ?? 0,
      workspaceIds:
        resource.relationships?.workspaces?.data.map((r) => r.id) ?? [],
      workspaceExclusionIds:
        resource.relationships?.["workspace-exclusions"]?.data.map(
          (r) => r.id,
        ) ?? [],
      currentVersionId: resource.relationships?.["current-version"]?.data.id,
      newestVersionId: resource.relationships?.["newest-version"]?.data.id,
    };
  },
};
