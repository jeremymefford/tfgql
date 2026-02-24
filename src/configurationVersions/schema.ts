import { gql } from "graphql-tag";

const configurationVersionSchema = gql`
  """
  A snapshot of Terraform configuration files uploaded to a workspace. Each run is associated with a configuration version that provides the code to plan and apply.
  """
  type ConfigurationVersion {
    """The configuration version's unique identifier."""
    id: ID!
    """When true, runs are queued automatically upon upload."""
    autoQueueRuns: Boolean!
    """Error code if the configuration version failed processing."""
    error: String
    """Human-readable error message if the configuration version failed processing."""
    errorMessage: String
    """When true, this configuration version does not immediately become the workspace's current version."""
    provisional: Boolean!
    """The origin of the configuration (e.g., 'tfe-api', 'gitlab', 'github')."""
    source: String
    """When true, this configuration version can only create speculative (plan-only) runs."""
    speculative: Boolean!
    """Current processing state (pending, fetching, uploaded, archived, errored)."""
    status: String!
    """Timestamps for each status transition."""
    statusTimestamps: ConfigurationVersionStatusTimestamps
    """List of files that changed in this configuration version."""
    changedFiles: [String!]!
    """VCS commit metadata for VCS-sourced configurations."""
    ingressAttributes: IngressAttributes
    """The size of the configuration archive in bytes."""
    size: Int
    """URL to download the configuration archive."""
    downloadUrl: String
  }

  """
  Timestamps recording when a configuration version transitioned between processing states.
  """
  type ConfigurationVersionStatusTimestamps {
    """Timestamp when the configuration version was archived."""
    archivedAt: DateTime
    """Timestamp when HCP Terraform began fetching files from VCS."""
    fetchingAt: DateTime
    """Timestamp when the configuration was fully uploaded and processed."""
    uploadedAt: DateTime
  }

  """
  Commit metadata for VCS-based configuration versions.
  """
  type IngressAttributes {
    """The ingress attributes' unique identifier."""
    id: ID!
    """The VCS branch the configuration was sourced from."""
    branch: String
    """The URL used to clone the VCS repository."""
    cloneUrl: String
    """The commit message from the VCS commit."""
    commitMessage: String
    """The SHA hash of the VCS commit."""
    commitSha: String
    """A URL linking to the VCS commit."""
    commitUrl: String
    """A URL linking to the VCS comparison/diff view."""
    compareUrl: String
    """The VCS repository identifier in :org/:repo format."""
    identifier: String
    """Whether this configuration was triggered by a pull request."""
    isPullRequest: Boolean
    """Whether the commit is on the repository's default branch."""
    onDefaultBranch: Boolean
    """The pull request number, if triggered by a PR."""
    pullRequestNumber: Int
    """A URL linking to the pull request, if triggered by a PR."""
    pullRequestUrl: String
    """The title of the pull request, if triggered by a PR."""
    pullRequestTitle: String
    """The body/description of the pull request, if triggered by a PR."""
    pullRequestBody: String
    """The VCS tag that triggered this configuration, if applicable."""
    tag: String
    """The VCS username of the person who triggered the configuration."""
    senderUsername: String
    """The avatar URL of the person who triggered the configuration."""
    senderAvatarUrl: String
    """The profile URL of the person who triggered the configuration."""
    senderHtmlUrl: String
    """The username or system that created this configuration version."""
    createdBy: String
  }

  """
  Filter conditions for ConfigurationVersion.statusTimestamps fields.
  """
  input ConfigurationVersionStatusTimestampsFilter {
    _and: [ConfigurationVersionStatusTimestampsFilter!]
    _or: [ConfigurationVersionStatusTimestampsFilter!]
    _not: ConfigurationVersionStatusTimestampsFilter

    archivedAt: DateTimeComparisonExp
    fetchingAt: DateTimeComparisonExp
    uploadedAt: DateTimeComparisonExp
  }

  """
  Filter conditions for ConfigurationVersion queries. Supports logical combinators (_and, _or, _not) and field-level comparisons.
  """
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
