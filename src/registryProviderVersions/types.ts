import {
  WhereClause,
  StringComparisonExp,
  BooleanComparisonExp,
  DateTimeComparisonExp,
} from "../common/filtering/types";
import {
  ResourceObject,
  ListResponse,
  SingleResponse,
} from "../common/types/jsonApi";

export interface RegistryProviderVersionPermissions {
  "can-delete": boolean;
  "can-upload-asset": boolean;
}

export interface RegistryProviderVersionAttributes {
  version: string;
  "created-at": string;
  "updated-at": string;
  "key-id": string;
  protocols: string[];
  permissions: RegistryProviderVersionPermissions;
  "shasums-uploaded": boolean;
  "shasums-sig-uploaded": boolean;
}

export interface RegistryProviderVersionRelationships {
  "registry-provider": {
    data: { id: string; type: string };
  };
  platforms?: {
    data: { id: string; type: string }[];
    links?: { related: string };
  };
}

export type RegistryProviderVersionResource =
  ResourceObject<RegistryProviderVersionAttributes> & {
    relationships?: RegistryProviderVersionRelationships;
    links?: {
      "shasums-download"?: string;
      "shasums-sig-download"?: string;
    };
  };

export type RegistryProviderVersionResponse =
  SingleResponse<RegistryProviderVersionResource>;
export type RegistryProviderVersionListResponse =
  ListResponse<RegistryProviderVersionResource>;

export interface RegistryProviderVersion {
  id: string;
  version: string;
  createdAt: string;
  updatedAt: string;
  keyId: string;
  protocols: string[];
  shasumsUploaded: boolean;
  shasumsSigUploaded: boolean;
  shasumsDownloadUrl?: string;
  shasumsSigDownloadUrl?: string;
  registryProviderId?: string;
  permissions: {
    canDelete: boolean;
    canUploadAsset: boolean;
  };
}

export interface RegistryProviderVersionFilter
  extends WhereClause<RegistryProviderVersion> {
  _and?: RegistryProviderVersionFilter[];
  _or?: RegistryProviderVersionFilter[];
  _not?: RegistryProviderVersionFilter;

  id?: StringComparisonExp;
  version?: StringComparisonExp;
  keyId?: StringComparisonExp;
  createdAt?: DateTimeComparisonExp;
  updatedAt?: DateTimeComparisonExp;
  shasumsUploaded?: BooleanComparisonExp;
  shasumsSigUploaded?: BooleanComparisonExp;
}
