import { gql } from "graphql-tag";

const policiesSchema = gql`
  """
  A Sentinel or OPA policy that enforces rules during Terraform runs. Policies are organized into policy sets and have configurable enforcement levels.
  """
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
    """
    List all policies across the selected organizations.
    """
    policies(
      includeOrgs: [String!]
      excludeOrgs: [String!]
      filter: PolicyFilter
    ): [Policy!]!
    """
    Look up a single policy by ID.
    """
    policy(id: ID!): Policy
  }
`;

export default policiesSchema;
