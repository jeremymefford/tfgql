import { gql } from "graphql-tag";

const assessmentResultsSchema = gql`
  """
  The result of a health assessment for a workspace, including drift detection and continuous validation status.
  """
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
    """
    List all health assessment results for a specific workspace.
    """
    assessmentResults(
      workspaceId: ID!
      filter: AssessmentResultFilter
    ): [AssessmentResult!]!
    """
    Look up a single assessment result by ID.
    """
    assessmentResult(id: ID!): AssessmentResult
  }
`;

export default assessmentResultsSchema;
