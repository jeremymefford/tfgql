import type { AxiosInstance } from "axios";
import { isNotFound } from "../common/http";
import { streamPages } from "../common/streamPages";
import { Comment, CommentFilter, CommentResponse } from "./types";
import { commentMapper } from "./mapper";

export class CommentsAPI {
  constructor(private readonly httpClient: AxiosInstance) {}

  async *listComments(
    runId: string,
    filter?: CommentFilter,
  ): AsyncGenerator<Comment[], void, unknown> {
    yield* streamPages<Comment, CommentFilter>(
      this.httpClient,
      `/runs/${runId}/comments`,
      commentMapper,
      undefined,
      filter,
    );
  }

  async getComment(id: string): Promise<Comment | null> {
    return this.httpClient
      .get<CommentResponse>(`/comments/${id}`)
      .then((res) => commentMapper.map(res.data.data))
      .catch((err) => {
        if (isNotFound(err)) {
          return null;
        }
        throw err;
      });
  }
}
