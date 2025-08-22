import {
  WhereClause,
  StringComparisonExp,
  IntComparisonExp,
  BooleanComparisonExp,
  DateTimeComparisonExp
} from '../common/filtering/types';
import {
  ResourceObject,
  ListResponse,
  SingleResponse,
  ResourceRef
} from '../common/types/jsonApi';

export interface AgentPoolAttributes {
  name: string;
  'created-at': string;
  'organization-scoped': boolean;
  'agent-count': number;
}

export interface AgentPoolRelationships {
  agents: {
    links: {
      related: string;
    };
  };
  authenticationTokens: {
    links: {
      related: string;
    };
  };
  workspaces: {
    data: ResourceRef[];
  };
  'allowed-workspaces': {
    data: ResourceRef[];
  };
}

export type AgentPoolResource = ResourceObject<AgentPoolAttributes> & {
  relationships?: AgentPoolRelationships;
};

export type AgentPoolResponse = SingleResponse<AgentPoolResource>;
export type AgentPoolListResponse = ListResponse<AgentPoolResource>;

export interface AgentPool {
  id: string;
  type: string;
  name: string;
  createdAt: string;
  organizationScoped: boolean;
  agentCount: number;
  workspaceIds: string[];
  allowedWorkspaceIds: string[];
}

export interface AgentPoolFilter extends WhereClause<AgentPool> {
  _and?: AgentPoolFilter[];
  _or?: AgentPoolFilter[];
  _not?: AgentPoolFilter;

  id?: StringComparisonExp;
  name?: StringComparisonExp;
  type?: StringComparisonExp;
  createdAt?: DateTimeComparisonExp;
  organizationScoped?: BooleanComparisonExp;
  agentCount?: IntComparisonExp;
}