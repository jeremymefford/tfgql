import {
  DateTimeComparisonExp,
  StringComparisonExp,
  WhereClause,
} from "../common/filtering/types";
import {
  ResourceObject,
  ListResponse,
  SingleResponse,
  ResourceRef,
} from "../common/types/jsonApi";

export interface RunTriggerAttributes {
  "workspace-name": string;
  "sourceable-name": string;
  "created-at": string;
}

export interface RunTriggerRelationships {
  workspace?: { data: ResourceRef };
  sourceable?: { data: ResourceRef };
}

export type RunTriggerResource = ResourceObject<RunTriggerAttributes> & {
  relationships?: RunTriggerRelationships;
};
export type RunTriggerListResponse = ListResponse<RunTriggerResource>;
export type RunTriggerResponse = SingleResponse<RunTriggerResource>;

/**
 * Domain model for a run-trigger relationship between workspaces.
 */
export interface RunTrigger {
  id: string;
  workspaceName: string;
  sourceableName: string;
  createdAt: string;
  workspace?: ResourceRef;
  sourceable?: ResourceRef;
}

export interface WorkspaceRunTrigger extends RunTrigger {
  inbound: boolean; // true if this is an inbound trigger, false if outbound
}

export interface RunTriggerFilter extends WhereClause<RunTrigger> {
  _and?: RunTriggerFilter[];
  _or?: RunTriggerFilter[];
  _not?: RunTriggerFilter;

  id?: StringComparisonExp;
  workspaceName?: StringComparisonExp;
  sourceableName?: StringComparisonExp;
  createdAt?: DateTimeComparisonExp;
}
