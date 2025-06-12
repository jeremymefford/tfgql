import { gql } from 'graphql-tag';

const stateVersionsSchema = gql`
  """
  Remote Terraform state version data and metadata.
  """
  type StateVersion {
    id: ID!
    createdAt: DateTime!
    size: Int
    hostedJsonStateDownloadUrl: String
    hostedStateDownloadUrl: String
    hostedJsonStateUploadUrl: String
    hostedStateUploadUrl: String
    status: String
    intermediate: Boolean
    modules: JSON
    providers: JSON
    resources: JSON
    resourcesProcessed: Boolean
    serial: Int
    stateVersion: Int
    terraformVersion: String
    vcsCommitSha: String
    vcsCommitUrl: String
    run: Run
    createdBy: User
    workspace: Workspace
    outputs: [StateVersionOutput!]!
  }

  input StateVersionFilter {
    _and: [StateVersionFilter!]
    _or: [StateVersionFilter!]
    _not: StateVersionFilter

    id: StringComparisonExp
    status: StringComparisonExp
    intermediate: BooleanComparisonExp
    serial: IntComparisonExp
    stateVersion: IntComparisonExp
  }

  extend type Query {
    stateVersions(
      orgName: String!
      workspaceName: String!
      filter: StateVersionFilter
    ): [StateVersion!]!
    stateVersion(id: ID!): StateVersion
    workspaceCurrentStateVersion(workspaceId: ID!): StateVersion
  }
`;

export default stateVersionsSchema;