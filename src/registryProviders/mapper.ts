import { DomainMapper } from "../common/middleware/domainMapper";
import { RegistryProviderResource, RegistryProvider } from "./types";

export const registryProviderMapper: DomainMapper<
  RegistryProviderResource,
  RegistryProvider
> = {
  map(resource: RegistryProviderResource): RegistryProvider {
    return {
      id: resource.id,
      name: resource.attributes.name,
      namespace: resource.attributes.namespace,
      registryName: resource.attributes["registry-name"],
      createdAt: resource.attributes["created-at"],
      updatedAt: resource.attributes["updated-at"],
      organizationName: resource.relationships?.organization?.data?.id,
      permissions: {
        canDelete: resource.attributes.permissions["can-delete"],
      },
    };
  },
};
