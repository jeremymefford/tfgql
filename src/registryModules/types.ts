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

export interface RegistryModuleVersionStatus {
  version: string;
  status: string;
}

export interface RegistryModuleVcsRepo {
  branch: string;
  "ingress-submodules": boolean;
  identifier: string;
  "display-identifier": string;
  "oauth-token-id": string;
  "webhook-url": string;
  "repository-http-url"?: string;
  "service-provider"?: string;
  tags?: boolean;
}

export interface RegistryModulePermissions {
  "can-delete": boolean;
  "can-resync": boolean;
  "can-retry": boolean;
}

export interface RegistryModuleAttributes {
  name: string;
  namespace: string;
  provider: string;
  "registry-name": string;
  status: string;
  "version-statuses": RegistryModuleVersionStatus[];
  "created-at": string;
  "updated-at": string;
  "vcs-repo"?: RegistryModuleVcsRepo;
  permissions: RegistryModulePermissions;
  "publishing-mechanism"?: string;
  "test-config"?: string;
  "no-code"?: boolean;
}

export interface RegistryModuleRelationships {
  organization: {
    data: { id: string; type: string };
  };
}

export type RegistryModuleResource =
  ResourceObject<RegistryModuleAttributes> & {
    relationships?: RegistryModuleRelationships;
  };

export type RegistryModuleResponse = SingleResponse<RegistryModuleResource>;
export type RegistryModuleListResponse = ListResponse<RegistryModuleResource>;

export interface RegistryModuleVersion {
  version: string;
  status: string;
}

// --- Registry v1 API types for full module version details ---

export interface RegistryModuleVersionProviderDep {
  name: string;
  version: string;
}

export interface RegistryModuleSubmodule {
  path: string;
  providers: RegistryModuleVersionProviderDep[];
  dependencies: RegistryModuleVersionProviderDep[];
}

export interface RegistryModuleRoot {
  providers: RegistryModuleVersionProviderDep[];
  dependencies: RegistryModuleVersionProviderDep[];
}

/** Raw response from GET /api/registry/v1/modules/:namespace/:name/:provider/versions */
export interface RegistryModuleVersionsV1Response {
  modules: {
    source: string;
    versions: {
      version: string;
      submodules?: RegistryModuleSubmodule[];
      root?: RegistryModuleRoot;
    }[];
  }[];
}

/** Domain model for a full module version from the registry v1 API */
export interface RegistryModuleVersionDetail {
  version: string;
  submodules: RegistryModuleSubmodule[];
  root?: RegistryModuleRoot;
}

export interface RegistryModuleVersionDetailFilter
  extends WhereClause<RegistryModuleVersionDetail> {
  _and?: RegistryModuleVersionDetailFilter[];
  _or?: RegistryModuleVersionDetailFilter[];
  _not?: RegistryModuleVersionDetailFilter;

  version?: StringComparisonExp;
}

export interface RegistryModule {
  id: string;
  name: string;
  namespace: string;
  provider: string;
  registryName: string;
  status: string;
  versionStatuses: RegistryModuleVersion[];
  createdAt: string;
  updatedAt: string;
  publishingMechanism?: string;
  noCode?: boolean;
  organizationName?: string;
  permissions: {
    canDelete: boolean;
    canResync: boolean;
    canRetry: boolean;
  };
  vcsRepo?: {
    branch: string;
    ingressSubmodules: boolean;
    identifier: string;
    displayIdentifier: string;
    oauthTokenId: string;
    webhookUrl: string;
    repositoryHttpUrl?: string;
    serviceProvider?: string;
    tags?: boolean;
  };
}

export interface RegistryModuleFilter extends WhereClause<RegistryModule> {
  _and?: RegistryModuleFilter[];
  _or?: RegistryModuleFilter[];
  _not?: RegistryModuleFilter;

  id?: StringComparisonExp;
  name?: StringComparisonExp;
  namespace?: StringComparisonExp;
  provider?: StringComparisonExp;
  registryName?: StringComparisonExp;
  status?: StringComparisonExp;
  createdAt?: DateTimeComparisonExp;
  updatedAt?: DateTimeComparisonExp;
}
