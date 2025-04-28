import { ResourceObject, ListResponse, SingleResponse, ResourceRef } from '../common/types/jsonApi';
import { StringComparisonExp, BooleanComparisonExp, WhereClause } from '../common/filtering/types';

export interface VariableAttributes {
    key: string;
    value: string;
    sensitive: boolean;
    category: string;
    hcl: boolean;
    description: string;
    'created-at': string;
    'version-id': string;
    relationships: VariableRelationships;
}

export interface VariableRelationships {
    workspace: {
        data: ResourceRef;
    };
}

export type VariableResource = ResourceObject<VariableAttributes>;
export type VariableResponse = SingleResponse<VariableResource>;
export type VariableListResponse = ListResponse<VariableResource>;

export interface Variable {
    id: string;
    key: string;
    value: string;
    sensitive: boolean;
    category: string;
    hcl: boolean;
    description: string;
    createdAt: string;
    versionId: string;
    workspaceId?: string; // Added workspaceId to reflect its relationship
}

export interface VariableFilter extends WhereClause<Variable> {
    _and?: VariableFilter[];
    _or?: VariableFilter[];
    _not?: VariableFilter;

    id?: StringComparisonExp;
    key?: StringComparisonExp;
    value?: StringComparisonExp;
    sensitive?: BooleanComparisonExp;
    category?: StringComparisonExp;
    hcl?: BooleanComparisonExp;
    description?: StringComparisonExp;
    createdAt?: StringComparisonExp;
    versionId?: StringComparisonExp;
}
