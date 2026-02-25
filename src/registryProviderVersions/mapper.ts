import { DomainMapper } from "../common/middleware/domainMapper";
import {
  RegistryProviderVersionResource,
  RegistryProviderVersion,
} from "./types";

export const registryProviderVersionMapper: DomainMapper<
  RegistryProviderVersionResource,
  RegistryProviderVersion
> = {
  map(resource: RegistryProviderVersionResource): RegistryProviderVersion {
    return {
      id: resource.id,
      version: resource.attributes.version,
      createdAt: resource.attributes["created-at"],
      updatedAt: resource.attributes["updated-at"],
      keyId: resource.attributes["key-id"],
      protocols: resource.attributes.protocols || [],
      shasumsUploaded: resource.attributes["shasums-uploaded"],
      shasumsSigUploaded: resource.attributes["shasums-sig-uploaded"],
      shasumsDownloadUrl: resource.links?.["shasums-download"],
      shasumsSigDownloadUrl: resource.links?.["shasums-sig-download"],
      registryProviderId:
        resource.relationships?.["registry-provider"]?.data?.id,
      permissions: {
        canDelete: resource.attributes.permissions["can-delete"],
        canUploadAsset: resource.attributes.permissions["can-upload-asset"],
      },
    };
  },
};
