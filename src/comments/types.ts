import { WhereClause, StringComparisonExp } from '../common/filtering/types';
import { ResourceObject, ListResponse, SingleResponse, ResourceRef } from '../common/types/jsonApi';

export interface CommentAttributes {
  /** The text body of the comment. */
  body: string;
}

export interface CommentRelationships {
  /** Relationship to the run-event that this comment is associated with. */
  'run-event'?: {
    data: ResourceRef;
  };
}

export type CommentResource = ResourceObject<CommentAttributes> & {
  relationships?: CommentRelationships;
};

export type CommentResponse = SingleResponse<CommentResource>;
export type CommentListResponse = ListResponse<CommentResource>;

export interface Comment {
  /** Unique identifier for the comment. */
  id: string;
  /** The text body of the comment. */
  body: string;
  /** The ID of the associated run-event. */
  runEventId?: string;
}

export interface CommentFilter extends WhereClause<Comment> {
  _and?: CommentFilter[];
  _or?: CommentFilter[];
  _not?: CommentFilter;

  /** Filter by comment ID. */
  id?: StringComparisonExp;
  /** Filter by comment body text. */
  body?: StringComparisonExp;
}