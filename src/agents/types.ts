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

export interface AgentAttributes {
  name?: string;
  status: string;
  "ip-address": string;
  "last-ping-at": string;
}

export type AgentResource = ResourceObject<AgentAttributes>;
export type AgentResponse = SingleResponse<AgentResource>;
export type AgentListResponse = ListResponse<AgentResource>;

export interface Agent {
  id: string;
  name?: string;
  status: string;
  ipAddress: string;
  lastPingAt: string;
}

export interface AgentFilter extends WhereClause<Agent> {
  _and?: AgentFilter[];
  _or?: AgentFilter[];
  _not?: AgentFilter;

  id?: StringComparisonExp;
  name?: StringComparisonExp;
  status?: StringComparisonExp;
  ipAddress?: StringComparisonExp;
  lastPingAt?: DateTimeComparisonExp;
}
