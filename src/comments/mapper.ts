import { DomainMapper } from '../common/middleware/domainMapper';
import { CommentResource, Comment } from './types';

export const commentMapper: DomainMapper<CommentResource, Comment> = {
  map(resource: CommentResource): Comment {
    return {
      id: resource.id,
      body: resource.attributes.body,
      runEventId: resource.relationships?.['run-event']?.data.id
    };
  }
};