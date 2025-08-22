import { axiosClient } from '../common/httpClient';
import { streamPages } from '../common/streamPages';
import { Comment, CommentFilter, CommentResponse } from './types';
import { commentMapper } from './mapper';

export class CommentsAPI {
  async *listComments(runId: string, filter?: CommentFilter): AsyncGenerator<Comment[], void, unknown> {
    yield* streamPages<Comment, CommentFilter>(
      `/runs/${runId}/comments`,
      commentMapper,
      undefined,
      filter
    );
  }

  async getComment(id: string): Promise<Comment | null> {
    return axiosClient.get<CommentResponse>(`/comments/${id}`)
      .then((res) => commentMapper.map(res.data.data))
      .catch((err) => {
        if (err.status === 404) {
          return null;
        }
        throw err;
      });
  }
}