import {
  WhereClause,
  StringComparisonExp,
  BooleanComparisonExp,
} from "../common/filtering/types";
import {
  ResourceObject,
  ListResponse,
  SingleResponse,
  ResourceRef,
} from "../common/types/jsonApi";

export interface PolicySetParameterAttributes {
  key: string;
  value: string;
  sensitive: boolean;
  category: string;
}

export interface PolicySetParameterRelationships {
  configurable: {
    data: ResourceRef;
  };
}

export type PolicySetParameterResource =
  ResourceObject<PolicySetParameterAttributes> & {
    relationships?: PolicySetParameterRelationships;
  };

export type PolicySetParameterResponse =
  SingleResponse<PolicySetParameterResource>;
export type PolicySetParameterListResponse =
  ListResponse<PolicySetParameterResource>;

export interface PolicySetParameter {
  id: string;
  key: string;
  value: string;
  sensitive: boolean;
  category: string;
  policySetId?: string;
}

export interface PolicySetParameterFilter
  extends WhereClause<PolicySetParameter> {
  _and?: PolicySetParameterFilter[];
  _or?: PolicySetParameterFilter[];
  _not?: PolicySetParameterFilter;

  id?: StringComparisonExp;
  key?: StringComparisonExp;
  value?: StringComparisonExp;
  sensitive?: BooleanComparisonExp;
  category?: StringComparisonExp;
  policySetId?: StringComparisonExp;
}
