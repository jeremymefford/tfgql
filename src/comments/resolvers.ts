import { Context } from '../server/context';
import { Comment, CommentFilter } from './types';
import { gatherAsyncGeneratorPromises } from '../common/streamPages';

export const resolvers = {
  Query: {
    comments: async (
      _: unknown,
      { runId, filter }: { runId: string; filter?: CommentFilter },
      { dataSources }: Context
    ): Promise<Promise<Comment>[]> => {
      return gatherAsyncGeneratorPromises(
        dataSources.commentsAPI.listComments(runId, filter)
      );
    },
    comment: async (
      _: unknown,
      { id }: { id: string },
      { dataSources }: Context
    ): Promise<Comment | null> => {
      return dataSources.commentsAPI.getComment(id);
    }
  }
};