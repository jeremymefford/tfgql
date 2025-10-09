import { gql } from "graphql-tag";

const assessmentResultsSchema = gql`
  type AssessmentResult {
    id: ID!
    drifted: Boolean!
    succeeded: Boolean!
    errorMessage: String
    createdAt: DateTime!
  }

  input AssessmentResultFilter {
    _and: [AssessmentResultFilter!]
    _or: [AssessmentResultFilter!]
    _not: AssessmentResultFilter

    id: StringComparisonExp
    drifted: BooleanComparisonExp
    succeeded: BooleanComparisonExp
    errorMessage: StringComparisonExp
    createdAt: DateTimeComparisonExp
  }

  extend type Query {
    assessmentResults(
      workspaceId: ID!
      filter: AssessmentResultFilter
    ): [AssessmentResult!]!
    assessmentResult(id: ID!): AssessmentResult
  }
`;

export default assessmentResultsSchema;
