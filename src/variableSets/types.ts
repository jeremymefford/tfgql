import {
  BooleanComparisonExp,
  IntComparisonExp,
  StringComparisonExp,
  WhereClause,
} from "../common/filtering/types";
import {
  ResourceObject,
  ListResponse,
  SingleResponse,
  ResourceRef,
} from "../common/types/jsonApi";
import { VariableResource } from "../variables/types";

export interface VariableSetAttributes {
  name: string;
  description?: string;
  global: boolean;
  "updated-at": string;
  "var-count": number;
  "workspace-count": number;
  "project-count": number;
  priority: boolean;
  permissions: {
    "can-update": boolean;
  };
}

export interface VariableSetRelationships {
  organization: {
    data: ResourceRef;
  };
  vars: {
    data: ResourceRef[];
  };
  workspaces: {
    data: ResourceRef[];
  };
  projects: {
    data: ResourceRef[];
  };
}

export type VariableSetResource = ResourceObject<VariableSetAttributes> & {
  relationships: VariableSetRelationships;
};
export type VariableSetResponse = SingleResponse<VariableSetResource>;
export interface VariableSetResponseIncludingVariables
  extends SingleResponse<VariableSetResource> {
  included?: VariableResource[];
}
export interface VariableSetResponseIncludingProjects
  extends SingleResponse<VariableSetResource> {
  included?: VariableResource[];
}
export type VariableSetListResponse = ListResponse<VariableSetResource>;

/** Domain model for VariableSet (matches GraphQL type fields) */
export interface VariableSet {
  id: string;
  name: string;
  description?: string;
  global: boolean;
  updatedAt: string;
  varCount: number;
  workspaceCount: number;
  projectCount: number;
  priority: boolean;
  permissions: {
    canUpdate: boolean;
  };
  organizationId: string;
  variableIds: string[];
  workspaceIds: string[];
  projectIds: string[];
}

export interface VariableSetFilter
  extends WhereClause<
    VariableSet,
    {
      permissions: VariableSetPermissionsFilter;
    }
  > {
  _and?: VariableSetFilter[];
  _or?: VariableSetFilter[];
  _not?: VariableSetFilter;

  id?: StringComparisonExp;
  name?: StringComparisonExp;
  description?: StringComparisonExp;
  global?: BooleanComparisonExp;
  updatedAt?: StringComparisonExp;
  varCount?: IntComparisonExp;
  workspaceCount?: IntComparisonExp;
  projectCount?: IntComparisonExp;
  priority?: BooleanComparisonExp;
  canUpdate?: VariableSetPermissionsFilter;
}

export interface VariableSetPermissionsFilter
  extends WhereClause<VariableSet["permissions"]> {
  canUpdate?: BooleanComparisonExp;
}
