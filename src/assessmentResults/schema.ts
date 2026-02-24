import { gql } from "graphql-tag";

const assessmentResultsSchema = gql`
  """
  The result of a health assessment for a workspace, including drift detection and continuous validation status.
  """
  type AssessmentResult {
    """The assessment result's unique identifier."""
    id: ID!
    """Whether infrastructure drift was detected during the health assessment."""
    drifted: Boolean!
    """Whether the assessment execution completed successfully."""
    succeeded: Boolean!
    """Error details if the assessment failed, or null if no errors occurred."""
    errorMessage: String
    """Timestamp when the assessment was performed."""
    createdAt: DateTime!
  }

  """
  Filter conditions for AssessmentResult queries. Supports logical combinators (_and, _or, _not) and field-level comparisons.
  """
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
