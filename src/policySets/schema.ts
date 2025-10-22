import { gql } from "graphql-tag";

const policySetsSchema = gql`
  """
  A collection of policies that can be applied to Terraform Cloud workspaces.
  """
  type PolicySet {
    id: ID!
    name: String!
    description: String
    kind: String!
    global: Boolean!
    agentEnabled: Boolean!
    policyToolVersion: String!
    overridable: Boolean!
    workspaceCount: Int!
    projectCount: Int!
    policyCount: Int
    policiesPath: String
    versioned: Boolean!
    vcsRepo: PolicySetVcsRepo
    createdAt: DateTime!
    updatedAt: DateTime!
    organization: Organization!
    policies(filter: PolicyFilter): [Policy!]!
    projects(filter: ProjectFilter): [Project!]!
    workspaces(filter: WorkspaceFilter): [Workspace!]!
    workspaceExclusions(filter: WorkspaceFilter): [Workspace!]!
    parameters(filter: PolicySetParameterFilter): [PolicySetParameter!]!
  }

  """
  VCS repository configuration for a policy set.
  """
  type PolicySetVcsRepo {
    branch: String
    identifier: String!
    ingressSubmodules: Boolean!
    oauthTokenId: String
    githubAppInstallationId: String
  }

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
    policySets(
      includeOrgs: [String!]
      excludeOrgs: [String!]
      filter: PolicySetFilter
    ): [PolicySet!]!
    policySet(id: ID!): PolicySet
  }
`;

export default policySetsSchema;
