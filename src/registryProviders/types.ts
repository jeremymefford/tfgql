import {
  WhereClause,
  StringComparisonExp,
  DateTimeComparisonExp,
} from "../common/filtering/types";
import {
  ResourceObject,
  ListResponse,
  SingleResponse,
} from "../common/types/jsonApi";

export interface RegistryProviderPermissions {
  "can-delete": boolean;
}

export interface RegistryProviderAttributes {
  name: string;
  namespace: string;
  "registry-name": string;
  "created-at": string;
  "updated-at": string;
  permissions: RegistryProviderPermissions;
}

export interface RegistryProviderRelationships {
  organization: {
    data: { id: string; type: string };
  };
}

export type RegistryProviderResource =
  ResourceObject<RegistryProviderAttributes> & {
    relationships?: RegistryProviderRelationships;
  };

export type RegistryProviderResponse =
  SingleResponse<RegistryProviderResource>;
export type RegistryProviderListResponse =
  ListResponse<RegistryProviderResource>;

export interface RegistryProvider {
  id: string;
  name: string;
  namespace: string;
  registryName: string;
  createdAt: string;
  updatedAt: string;
  organizationName?: string;
  permissions: {
    canDelete: boolean;
  };
}

export interface RegistryProviderFilter extends WhereClause<RegistryProvider> {
  _and?: RegistryProviderFilter[];
  _or?: RegistryProviderFilter[];
  _not?: RegistryProviderFilter;

  id?: StringComparisonExp;
  name?: StringComparisonExp;
  namespace?: StringComparisonExp;
  registryName?: StringComparisonExp;
  createdAt?: DateTimeComparisonExp;
  updatedAt?: DateTimeComparisonExp;
}
