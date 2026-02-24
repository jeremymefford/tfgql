import { gql } from "graphql-tag";

const policySetsSchema = gql`
  """
  A collection of policies that can be applied to Terraform Cloud workspaces.
  """
  type PolicySet {
    """
    The policy set's unique identifier.
    """
    id: ID!
    """
    The name of the policy set. Can include letters, numbers, hyphens, and underscores.
    """
    name: String!
    """
    A text description of the policy set's purpose.
    """
    description: String
    """
    The policy framework type: 'sentinel' or 'opa'.
    """
    kind: String!
    """
    When true, the policy set is automatically applied to all workspaces in the organization.
    """
    global: Boolean!
    """
    Whether agent-based policy evaluation is enabled (Sentinel only).
    """
    agentEnabled: Boolean!
    """
    The version of the policy evaluation tool (Sentinel or OPA).
    """
    policyToolVersion: String!
    """
    Whether users can override failed policies in this set.
    """
    overridable: Boolean!
    """
    Number of workspaces this policy set is applied to.
    """
    workspaceCount: Int!
    """
    Number of projects this policy set is applied to.
    """
    projectCount: Int!
    """
    Number of policies in this policy set.
    """
    policyCount: Int
    """
    Subdirectory path within the VCS repository containing the policies.
    """
    policiesPath: String
    """
    Whether the policy set is versioned through VCS.
    """
    versioned: Boolean!
    """
    VCS repository configuration for sourcing policies.
    """
    vcsRepo: PolicySetVcsRepo
    """
    Timestamp when the policy set was created.
    """
    createdAt: DateTime!
    """
    Timestamp when the policy set was last modified.
    """
    updatedAt: DateTime!
    """
    The organization this policy set belongs to.
    """
    organization: Organization!
    """
    Individual policies contained in this policy set.
    """
    policies(filter: PolicyFilter): [Policy!]!
    """
    Projects this policy set is applied to.
    """
    projects(filter: ProjectFilter): [Project!]!
    """
    Workspaces this policy set is applied to.
    """
    workspaces(filter: WorkspaceFilter): [Workspace!]!
    """
    Workspaces explicitly excluded from this policy set.
    """
    workspaceExclusions(filter: WorkspaceFilter): [Workspace!]!
    """
    Parameters passed to the policy runtime during evaluation.
    """
    parameters(filter: PolicySetParameterFilter): [PolicySetParameter!]!
  }

  """
  VCS repository configuration for a policy set.
  """
  type PolicySetVcsRepo {
    """
    The VCS branch to source policies from. Uses the default branch if empty.
    """
    branch: String
    """
    The VCS repository path in :org/:repo format.
    """
    identifier: String!
    """
    Whether to clone repository submodules.
    """
    ingressSubmodules: Boolean!
    """
    The OAuth token identifier used for VCS authentication.
    """
    oauthTokenId: String
    """
    The GitHub App installation ID, as an alternative to OAuth.
    """
    githubAppInstallationId: String
  }

  """
  Filter conditions for PolicySet queries. Supports logical combinators (_and, _or, _not) and field-level comparisons.
  """
  input PolicySetFilter {
    _and: [PolicySetFilter!]
    _or: [PolicySetFilter!]
    _not: PolicySetFilter

    id: StringComparisonExp
    name: StringComparisonExp
    description: StringComparisonExp
    kind: StringComparisonExp
    global: BooleanComparisonExp
    agentEnabled: BooleanComparisonExp
    projectCount: IntComparisonExp
    policyToolVersion: StringComparisonExp
    overridable: BooleanComparisonExp
    workspaceCount: IntComparisonExp
    policyCount: IntComparisonExp
    policiesPath: StringComparisonExp
    versioned: BooleanComparisonExp
    createdAt: DateTimeComparisonExp
    updatedAt: DateTimeComparisonExp
  }

  extend type Query {
    """
    List all policy sets across the selected organizations.
    """
    policySets(
      includeOrgs: [String!]
      excludeOrgs: [String!]
      filter: PolicySetFilter
    ): [PolicySet!]!
    """
    Look up a single policy set by ID.
    """
    policySet(id: ID!): PolicySet
  }
`;

export default policySetsSchema;
