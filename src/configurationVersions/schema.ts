import { gql } from "graphql-tag";

const configurationVersionSchema = gql`
  """
  A snapshot of Terraform configuration files uploaded to a workspace. Each run is associated with a configuration version that provides the code to plan and apply.
  """
  type ConfigurationVersion {
    id: ID!
    autoQueueRuns: Boolean!
    error: String
    errorMessage: String
    provisional: Boolean!
    source: String
    speculative: Boolean!
    status: String!
    statusTimestamps: ConfigurationVersionStatusTimestamps
    changedFiles: [String!]!
    ingressAttributes: IngressAttributes
    size: Int
    downloadUrl: String
  }

  type ConfigurationVersionStatusTimestamps {
    archivedAt: DateTime
    fetchingAt: DateTime
    uploadedAt: DateTime
  }

  """
  Commit metadata for VCS-based configuration versions.
  """
  type IngressAttributes {
    id: ID!
    branch: String
    cloneUrl: String
    commitMessage: String
    commitSha: String
    commitUrl: String
    compareUrl: String
    identifier: String
    isPullRequest: Boolean
    onDefaultBranch: Boolean
    pullRequestNumber: Int
    pullRequestUrl: String
    pullRequestTitle: String
    pullRequestBody: String
    tag: String
    senderUsername: String
    senderAvatarUrl: String
    senderHtmlUrl: String
    createdBy: String
  }

  input ConfigurationVersionStatusTimestampsFilter {
    _and: [ConfigurationVersionStatusTimestampsFilter!]
    _or: [ConfigurationVersionStatusTimestampsFilter!]
    _not: ConfigurationVersionStatusTimestampsFilter

    archivedAt: DateTimeComparisonExp
    fetchingAt: DateTimeComparisonExp
    uploadedAt: DateTimeComparisonExp
  }

  input ConfigurationVersionFilter {
    _and: [ConfigurationVersionFilter!]
    _or: [ConfigurationVersionFilter!]
    _not: ConfigurationVersionFilter

    id: StringComparisonExp
    autoQueueRuns: BooleanComparisonExp
    error: StringComparisonExp
    errorMessage: StringComparisonExp
    provisional: BooleanComparisonExp
    source: StringComparisonExp
    speculative: BooleanComparisonExp
    status: StringComparisonExp
    changedFiles: StringComparisonExp
    # size cannot be filtered directly, but can be derived from the downloadUrl
    statusTimestamps: ConfigurationVersionStatusTimestampsFilter
  }

  extend type Query {
    """
    Look up a single configuration version by ID.
    """
    configurationVersion(id: ID!): ConfigurationVersion
    """
    List configuration versions for a workspace.
    """
    configurationVersions(
      workspaceId: ID!
      filter: ConfigurationVersionFilter
    ): [ConfigurationVersion]!
    """
    List workspaces that have at least one configuration version larger than the specified byte threshold.
    """
    workspacesWithConfigurationVersionsLargerThan(
      includeOrgs: [String!]
      excludeOrgs: [String!]
      bytes: Int!
    ): [Workspace]!
  }
`;

export default configurationVersionSchema;
