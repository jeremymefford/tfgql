import { WhereClause, StringComparisonExp } from "../common/filtering/types";
import {
  ResourceObject,
  ListResponse,
  SingleResponse,
  ResourceRef,
} from "../common/types/jsonApi";

export interface CommentAttributes {
  body: string;
}

export interface CommentRelationships {
  "run-event"?: {
    data: ResourceRef;
  };
}

export type CommentResource = ResourceObject<CommentAttributes> & {
  relationships?: CommentRelationships;
};

export type CommentResponse = SingleResponse<CommentResource>;
export type CommentListResponse = ListResponse<CommentResource>;

export interface Comment {
  id: string;
  body: string;
  runEventId?: string;
}

export interface CommentFilter extends WhereClause<Comment> {
  _and?: CommentFilter[];
  _or?: CommentFilter[];
  _not?: CommentFilter;

  body?: StringComparisonExp;
}
