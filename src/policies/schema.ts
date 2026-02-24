import { gql } from "graphql-tag";

const policiesSchema = gql`
  """
  A Sentinel or OPA policy that enforces rules during Terraform runs. Policies are organized into policy sets and have configurable enforcement levels.
  """
  type Policy {
    """
    The policy's unique identifier.
    """
    id: ID!
    """
    The policy name. Contains letters, numbers, hyphens, and underscores. Immutable after creation.
    """
    name: String!
    """
    A text description of the policy's purpose.
    """
    description: String
    """
    The policy framework type: 'sentinel' or 'opa'.
    """
    kind: String!
    """
    The OPA query to execute. Only applicable to OPA policies.
    """
    query: String
    """
    The enforcement level. Sentinel: 'hard-mandatory', 'soft-mandatory', or 'advisory'. OPA: 'mandatory' or 'advisory'.
    """
    enforcementLevel: String!
    """
    Number of policy sets this policy belongs to.
    """
    policySetCount: Int!
    """
    Timestamp when the policy was last modified.
    """
    updatedAt: DateTime
  }

  """
  Filter conditions for Policy queries. Supports logical combinators (_and, _or, _not) and field-level comparisons.
  """
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
