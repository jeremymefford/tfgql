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

export interface RegistryTestRunAttributes {
  status: string;
  "created-at": string;
  "updated-at": string;
  "log-read-url"?: string;
}

export type RegistryTestRunResource =
  ResourceObject<RegistryTestRunAttributes>;

export type RegistryTestRunResponse = SingleResponse<RegistryTestRunResource>;
export type RegistryTestRunListResponse =
  ListResponse<RegistryTestRunResource>;

export interface RegistryTestRun {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  logReadUrl?: string;
}

export interface RegistryTestRunFilter extends WhereClause<RegistryTestRun> {
  _and?: RegistryTestRunFilter[];
  _or?: RegistryTestRunFilter[];
  _not?: RegistryTestRunFilter;

  id?: StringComparisonExp;
  status?: StringComparisonExp;
  createdAt?: DateTimeComparisonExp;
  updatedAt?: DateTimeComparisonExp;
}

export interface RegistryTestVariableAttributes {
  key: string;
  value: string;
  category: string;
  hcl: boolean;
  sensitive: boolean;
}

export type RegistryTestVariableResource =
  ResourceObject<RegistryTestVariableAttributes>;

export type RegistryTestVariableResponse =
  SingleResponse<RegistryTestVariableResource>;
export type RegistryTestVariableListResponse =
  ListResponse<RegistryTestVariableResource>;

export interface RegistryTestVariable {
  id: string;
  key: string;
  value: string;
  category: string;
  hcl: boolean;
  sensitive: boolean;
}

export interface RegistryTestVariableFilter
  extends WhereClause<RegistryTestVariable> {
  _and?: RegistryTestVariableFilter[];
  _or?: RegistryTestVariableFilter[];
  _not?: RegistryTestVariableFilter;

  id?: StringComparisonExp;
  key?: StringComparisonExp;
  category?: StringComparisonExp;
}
