import {
  BooleanComparisonExp,
  StringComparisonExp,
  WhereClause,
} from "../common/filtering/types";
import {
  ResourceObject,
  ListResponse,
  SingleResponse,
  ResourceRef,
} from "../common/types/jsonApi";

export interface WorkspaceTeamAccessAttributes {
  access: string;
  runs: string;
  variables: string;
  "state-versions": string;
  "sentinel-mocks": string;
  "workspace-locking": boolean;
  "run-tasks": boolean;
}

export interface WorkspaceTeamAccessRelationships {
  team?: { data?: ResourceRef };
  workspace?: { data?: ResourceRef };
}

export type WorkspaceTeamAccessResource =
  ResourceObject<WorkspaceTeamAccessAttributes> & {
    relationships?: WorkspaceTeamAccessRelationships;
  };

export type WorkspaceTeamAccessListResponse =
  ListResponse<WorkspaceTeamAccessResource>;
export type WorkspaceTeamAccessResponse =
  SingleResponse<WorkspaceTeamAccessResource>;

export interface WorkspaceTeamAccess {
  id: string;
  access: string;
  runs: string;
  variables: string;
  stateVersions: string;
  sentinelMocks: string;
  workspaceLocking: boolean;
  runTasks: boolean;
  workspaceId: string;
  teamId: string;
}

export interface WorkspaceTeamAccessFilter
  extends WhereClause<WorkspaceTeamAccess> {
  _and?: WorkspaceTeamAccessFilter[];
  _or?: WorkspaceTeamAccessFilter[];
  _not?: WorkspaceTeamAccessFilter;

  id?: StringComparisonExp;
  access?: StringComparisonExp;
  runs?: StringComparisonExp;
  variables?: StringComparisonExp;
  stateVersions?: StringComparisonExp;
  sentinelMocks?: StringComparisonExp;
  workspaceLocking?: BooleanComparisonExp;
  runTasks?: BooleanComparisonExp;
  workspaceId?: StringComparisonExp;
  teamId?: StringComparisonExp;
}
