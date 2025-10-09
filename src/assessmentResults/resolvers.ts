import { Context } from "../server/context";
import { AssessmentResult, AssessmentResultFilter } from "./types";
import { gatherAsyncGeneratorPromises } from "../common/streamPages";

export const resolvers = {
  Query: {
    assessmentResults: async (
      _: unknown,
      {
        workspaceId,
        filter,
      }: { workspaceId: string; filter?: AssessmentResultFilter },
      { dataSources }: Context,
    ): Promise<AssessmentResult[]> => {
      return gatherAsyncGeneratorPromises(
        dataSources.assessmentResultsAPI.listAssessmentResults(
          workspaceId,
          filter,
        ),
      );
    },
    assessmentResult: async (
      _: unknown,
      { id }: { id: string },
      { dataSources }: Context,
    ): Promise<AssessmentResult | null> => {
      return dataSources.assessmentResultsAPI.getAssessmentResult(id);
    },
  },
};
