import { gql } from 'graphql-tag';

const policiesSchema = gql`
  type Policy {
    id: ID!
    # TODO: add Policy fields based on Terraform Cloud API
  }

  input PolicyFilter {
    _and: [PolicyFilter!]
    _or: [PolicyFilter!]
    _not: PolicyFilter

    # TODO: add filter fields based on Terraform Cloud API
  }

  extend type Query {
    policies(filter: PolicyFilter): [Policy!]!
    policy(id: ID!): Policy
  }
`;

export default policiesSchema;