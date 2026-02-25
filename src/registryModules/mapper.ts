import { DomainMapper } from "../common/middleware/domainMapper";
import { RegistryModuleResource, RegistryModule } from "./types";

export const registryModuleMapper: DomainMapper<
  RegistryModuleResource,
  RegistryModule
> = {
  map(resource: RegistryModuleResource): RegistryModule {
    const vcsRepo = resource.attributes["vcs-repo"];
    return {
      id: resource.id,
      name: resource.attributes.name,
      namespace: resource.attributes.namespace,
      provider: resource.attributes.provider,
      registryName: resource.attributes["registry-name"],
      status: resource.attributes.status,
      versionStatuses: (resource.attributes["version-statuses"] || []).map(
        (vs) => ({
          version: vs.version,
          status: vs.status,
        }),
      ),
      createdAt: resource.attributes["created-at"],
      updatedAt: resource.attributes["updated-at"],
      publishingMechanism: resource.attributes["publishing-mechanism"],
      noCode: resource.attributes["no-code"],
      organizationName: resource.relationships?.organization?.data?.id,
      permissions: {
        canDelete: resource.attributes.permissions["can-delete"],
        canResync: resource.attributes.permissions["can-resync"],
        canRetry: resource.attributes.permissions["can-retry"],
      },
      vcsRepo: vcsRepo
        ? {
            branch: vcsRepo.branch,
            ingressSubmodules: vcsRepo["ingress-submodules"],
            identifier: vcsRepo.identifier,
            displayIdentifier: vcsRepo["display-identifier"],
            oauthTokenId: vcsRepo["oauth-token-id"],
            webhookUrl: vcsRepo["webhook-url"],
            repositoryHttpUrl: vcsRepo["repository-http-url"],
            serviceProvider: vcsRepo["service-provider"],
            tags: vcsRepo.tags,
          }
        : undefined,
    };
  },
};
