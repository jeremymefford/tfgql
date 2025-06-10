import { WhereClause, StringComparisonExp, BooleanComparisonExp } from '../common/filtering/types';
import { ResourceObject, ListResponse, SingleResponse, ResourceRef } from '../common/types/jsonApi';

export interface ProjectTeamAccessAttributes {
  access: string;
  "project-access": {
    settings: string;
    teams: string;
  };
  "workspace-access": {
    create: boolean;
    move: boolean;
    locking: boolean;
    delete: boolean;
    runs: string;
    variables: string;
    "state-versions": string;
    "sentinel-mocks": string;
    "run-tasks": boolean;
  };
}

export interface ProjectTeamAccessRelationships {
  project: {
    data: ResourceRef;
  };
  team: {
    data: ResourceRef;
  };
}

export type ProjectTeamAccessResource = ResourceObject<ProjectTeamAccessAttributes> & {
  relationships?: ProjectTeamAccessRelationships;
};

export type ProjectTeamAccessResponse = SingleResponse<ProjectTeamAccessResource>;
export type ProjectTeamAccessListResponse = ListResponse<ProjectTeamAccessResource>;

export interface ProjectTeamAccess {
  id: string;
  access: string;
  projectAccess: {
    settings: string;
    teams: string;
  };
  workspaceAccess: {
    create: boolean;
    move: boolean;
    locking: boolean;
    delete: boolean;
    runs: string;
    variables: string;
    stateVersions: string;
    sentinelMocks: string;
    runTasks: boolean;
  };
  projectId: string;
  teamId: string;
}

export interface ProjectTeamAccessFilter extends WhereClause<ProjectTeamAccess> {
  _and?: ProjectTeamAccessFilter[];
  _or?: ProjectTeamAccessFilter[];
  _not?: ProjectTeamAccessFilter;

  id?: StringComparisonExp;
  access?: StringComparisonExp;
  projectId?: StringComparisonExp;
  teamId?: StringComparisonExp;
}