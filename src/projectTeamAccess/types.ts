import { WhereClause } from '../common/filtering/types';
import { ResourceObject, ListResponse, SingleResponse, ResourceRef } from '../common/types/jsonApi';

export interface ProjectTeamAccessAttributes {
  // TODO: define ProjectTeamAccess attributes based on Terraform Cloud API
}

export interface ProjectTeamAccessRelationships {
  project?: {
    data: ResourceRef;
  };
  team?: {
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
  // TODO: define ProjectTeamAccess domain model fields
}

export interface ProjectTeamAccessFilter extends WhereClause<ProjectTeamAccess> {
  _and?: ProjectTeamAccessFilter[];
  _or?: ProjectTeamAccessFilter[];
  _not?: ProjectTeamAccessFilter;

  // TODO: add ProjectTeamAccess filter fields
}