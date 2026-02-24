import { gql } from "graphql-tag";

const appliesSchema = gql`
  """
  Represents the results of applying a Terraform run's execution plan. Contains resource change counts, status, and log output.
  """
  type Apply {
    """The apply's unique identifier."""
    id: ID!
    """Execution mode: 'remote' or 'agent'."""
    mode: String
    """Current state of the apply (e.g., pending, queued, running, finished, errored, canceled)."""
    status: String!
    """Timestamp when the apply was queued."""
    queuedAt: DateTime
    """Timestamp when apply execution began."""
    startedAt: DateTime
    """Timestamp when apply execution completed."""
    finishedAt: DateTime
    """Temporary authenticated URL for streaming apply log output."""
    logReadUrl: String!
    """Structured apply log output, filtered by minimum log level."""
    applyLog(minimumLevel: LogLevel = TRACE): [JSON!]
    """Whether structured (JSON) run output is enabled."""
    structuredRunOutputEnabled: Boolean!
    """Count of resources that were created."""
    resourceAdditions: Int
    """Count of resources that were modified."""
    resourceChanges: Int
    """Count of resources that were removed."""
    resourceDestructions: Int
    """Count of resources that were imported."""
    resourceImports: Int
    """State versions produced by this apply."""
    stateVersions(filter: StateVersionFilter): [StateVersion!]!
  }

  """
  Filter conditions for Apply queries. Supports logical combinators (_and, _or, _not) and field-level comparisons.
  """
  input ApplyFilter {
    _and: [ApplyFilter!]
    _or: [ApplyFilter!]
    _not: ApplyFilter

    id: StringComparisonExp
    mode: StringComparisonExp
    status: StringComparisonExp
    queuedAt: DateTimeComparisonExp
    startedAt: DateTimeComparisonExp
    finishedAt: DateTimeComparisonExp
    logReadUrl: StringComparisonExp
    resourceAdditions: IntComparisonExp
    resourceChanges: IntComparisonExp
    resourceDestructions: IntComparisonExp
    resourceImports: IntComparisonExp
    stateVersionIds: StringComparisonExp
  }

  extend type Query {
    """
    Get the apply for a specific run.
    """
    applyForRun(runId: ID!): Apply
    """
    Look up a single apply by ID.
    """
    apply(id: ID!): Apply
    """
    List all applies for runs within a workspace.
    """
    appliesForWorkspace(workspaceId: ID!, filter: ApplyFilter): [Apply!]!
    """
    List all applies for runs across all workspaces in a project.
    """
    appliesForProject(projectId: ID!, filter: ApplyFilter): [Apply!]!
    """
    List all applies for runs across all workspaces in an organization.
    """
    appliesForOrganization(organizationId: ID!, filter: ApplyFilter): [Apply!]!
  }
`;

export default appliesSchema;
