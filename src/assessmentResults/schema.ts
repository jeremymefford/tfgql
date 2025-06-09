import { gql } from 'graphql-tag';

const assessmentResultsSchema = gql`
  type AssessmentResult {
    id: ID!
    # TODO: add AssessmentResult fields based on Terraform Cloud API
  }

  input AssessmentResultFilter {
    _and: [AssessmentResultFilter!]
    _or: [AssessmentResultFilter!]
    _not: AssessmentResultFilter

    # TODO: add filter fields based on Terraform Cloud API
  }

  extend type Query {
    assessmentResults(workspaceId: ID!, filter: AssessmentResultFilter): [AssessmentResult!]!
    assessmentResult(id: ID!): AssessmentResult
  }
`;

export default assessmentResultsSchema;