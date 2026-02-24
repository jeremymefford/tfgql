import { gql } from "graphql-tag";

const appliesSchema = gql`
  """
  Represents the results of applying a Terraform run's execution plan. Contains resource change counts, status, and log output.
  """
  type Apply {
    id: ID!
    mode: String
    status: String!
    queuedAt: DateTime
    startedAt: DateTime
    finishedAt: DateTime
    logReadUrl: String!
    applyLog(minimumLevel: LogLevel = TRACE): [JSON!]
    structuredRunOutputEnabled: Boolean!
    resourceAdditions: Int
    resourceChanges: Int
    resourceDestructions: Int
    resourceImports: Int
    stateVersions(filter: StateVersionFilter): [StateVersion!]!
  }

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
