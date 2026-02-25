import {
  WhereClause,
  StringComparisonExp,
  BooleanComparisonExp,
} from "../common/filtering/types";
import {
  ResourceObject,
  ListResponse,
  SingleResponse,
} from "../common/types/jsonApi";

export interface RegistryProviderPlatformPermissions {
  "can-delete": boolean;
  "can-upload-asset": boolean;
}

export interface RegistryProviderPlatformAttributes {
  os: string;
  arch: string;
  filename: string;
  shasum: string;
  permissions: RegistryProviderPlatformPermissions;
  "provider-binary-uploaded": boolean;
}

export interface RegistryProviderPlatformRelationships {
  "registry-provider-version": {
    data: { id: string; type: string };
  };
}

export type RegistryProviderPlatformResource =
  ResourceObject<RegistryProviderPlatformAttributes> & {
    relationships?: RegistryProviderPlatformRelationships;
    links?: {
      "provider-binary-download"?: string;
    };
  };

export type RegistryProviderPlatformResponse =
  SingleResponse<RegistryProviderPlatformResource>;
export type RegistryProviderPlatformListResponse =
  ListResponse<RegistryProviderPlatformResource>;

export interface RegistryProviderPlatform {
  id: string;
  os: string;
  arch: string;
  filename: string;
  shasum: string;
  providerBinaryUploaded: boolean;
  providerBinaryDownloadUrl?: string;
  registryProviderVersionId?: string;
  permissions: {
    canDelete: boolean;
    canUploadAsset: boolean;
  };
}

export interface RegistryProviderPlatformFilter
  extends WhereClause<RegistryProviderPlatform> {
  _and?: RegistryProviderPlatformFilter[];
  _or?: RegistryProviderPlatformFilter[];
  _not?: RegistryProviderPlatformFilter;

  id?: StringComparisonExp;
  os?: StringComparisonExp;
  arch?: StringComparisonExp;
  filename?: StringComparisonExp;
  shasum?: StringComparisonExp;
  providerBinaryUploaded?: BooleanComparisonExp;
}
