import { gql } from 'graphql-tag';

const appliesSchema = gql`
  type Apply {
    id: ID!
    # TODO: add Apply fields based on Terraform Cloud API
  }

  input ApplyFilter {
    _and: [ApplyFilter!]
    _or: [ApplyFilter!]
    _not: ApplyFilter

    # TODO: add filter fields based on Terraform Cloud API
  }

  extend type Query {
    applies(runId: ID!, filter: ApplyFilter): [Apply!]!
    apply(id: ID!): Apply
  }
`;

export default appliesSchema;