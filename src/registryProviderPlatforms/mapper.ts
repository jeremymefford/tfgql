import { DomainMapper } from "../common/middleware/domainMapper";
import {
  RegistryProviderPlatformResource,
  RegistryProviderPlatform,
} from "./types";

export const registryProviderPlatformMapper: DomainMapper<
  RegistryProviderPlatformResource,
  RegistryProviderPlatform
> = {
  map(resource: RegistryProviderPlatformResource): RegistryProviderPlatform {
    return {
      id: resource.id,
      os: resource.attributes.os,
      arch: resource.attributes.arch,
      filename: resource.attributes.filename,
      shasum: resource.attributes.shasum,
      providerBinaryUploaded:
        resource.attributes["provider-binary-uploaded"],
      providerBinaryDownloadUrl: resource.links?.["provider-binary-download"],
      registryProviderVersionId:
        resource.relationships?.["registry-provider-version"]?.data?.id,
      permissions: {
        canDelete: resource.attributes.permissions["can-delete"],
        canUploadAsset: resource.attributes.permissions["can-upload-asset"],
      },
    };
  },
};
