import { gql } from 'graphql-tag';

const stateVersionOutputsSchema = gql`
  type StateVersionOutput {
    id: ID!
    # TODO: add StateVersionOutput fields based on Terraform Cloud API
  }

  input StateVersionOutputFilter {
    _and: [StateVersionOutputFilter!]
    _or: [StateVersionOutputFilter!]
    _not: StateVersionOutputFilter

    # TODO: add filter fields based on Terraform Cloud API
  }

  extend type Query {
    stateVersionOutputs(stateVersionId: ID!, filter: StateVersionOutputFilter): [StateVersionOutput!]!
    stateVersionOutput(id: ID!): StateVersionOutput
  }
`;

export default stateVersionOutputsSchema;