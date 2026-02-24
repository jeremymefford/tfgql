import { DomainMapper } from "../common/middleware/domainMapper";
import { RegistryGpgKeyResource, RegistryGpgKey } from "./types";

export const registryGpgKeyMapper: DomainMapper<
  RegistryGpgKeyResource,
  RegistryGpgKey
> = {
  map(resource: RegistryGpgKeyResource): RegistryGpgKey {
    return {
      id: resource.id,
      asciiArmor: resource.attributes["ascii-armor"],
      createdAt: resource.attributes["created-at"],
      keyId: resource.attributes["key-id"],
      namespace: resource.attributes.namespace,
      source: resource.attributes.source,
      sourceUrl: resource.attributes["source-url"],
      trustSignature: resource.attributes["trust-signature"],
      updatedAt: resource.attributes["updated-at"],
    };
  },
};
