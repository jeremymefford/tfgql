import { gql } from "graphql-tag";

const policiesSchema = gql`
  type Policy {
    id: ID!
    name: String!
    description: String
    kind: String!
    query: String
    enforcementLevel: String!
    policySetCount: Int!
    updatedAt: DateTime
  }

  input PolicyFilter {
    _and: [PolicyFilter!]
    _or: [PolicyFilter!]
    _not: PolicyFilter

    id: StringComparisonExp
    name: StringComparisonExp
    description: StringComparisonExp
    kind: StringComparisonExp
    query: StringComparisonExp
    enforcementLevel: StringComparisonExp
    policySetCount: IntComparisonExp
    updatedAt: DateTimeComparisonExp
    organizationId: StringComparisonExp
    policySetIds: StringComparisonExp
  }

  extend type Query {
    policies(
      includeOrgs: [String!]
      excludeOrgs: [String!]
      filter: PolicyFilter
    ): [Policy!]!
    policy(id: ID!): Policy
  }
`;

export default policiesSchema;
