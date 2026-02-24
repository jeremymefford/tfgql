import { gql } from "graphql-tag";

const plansSchema = gql`
  """
  Represents the execution plan of a run in a Terraform workspace. Contains resource change counts, status, and optional structured JSON output.
  """
  type Plan {
    """The plan's unique identifier."""
    id: ID!
    """Execution mode: 'remote' or 'agent'."""
    mode: String!
    """Identifier of the agent executing this plan, when using agent execution mode."""
    agentId: ID
    """Human-readable name of the agent executing this plan."""
    agentName: String
    """Identifier of the agent pool used for this plan."""
    agentPoolId: ID
    """Name of the agent pool used for this plan."""
    agentPoolName: String
    """Whether Terraform auto-generated configuration during import."""
    generatedConfiguration: Boolean!
    """Whether the plan detected any infrastructure changes."""
    hasChanges: Boolean!
    """Count of resources to be created."""
    resourceAdditions: Int!
    """Count of resources to be modified."""
    resourceChanges: Int!
    """Count of resources to be removed."""
    resourceDestructions: Int!
    """Count of resources to be imported."""
    resourceImports: Int!
    """Current state of the plan (e.g., pending, queued, running, finished, errored, canceled)."""
    status: String!
    """Temporary authenticated URL for streaming plan log output."""
    logReadUrl: String!
    """Structured plan log output, filtered by minimum log level."""
    planLog(minimumLevel: LogLevel = TRACE): [JSON!]
    """URL to download the exported plan file."""
    planExportDownloadUrl: String
    """Whether structured (JSON) run output is enabled."""
    structuredRunOutputEnabled: Boolean!
    """URL to download the plan's JSON output, if structured output is enabled."""
    jsonOutputUrl: String
    """Redacted JSON plan output with sensitive values removed."""
    jsonOutputRedacted: String
    """JSON provider schema associated with this plan."""
    jsonSchema: String
    """Timestamp when the plan was queued on an agent."""
    agentQueuedAt: DateTime
    """Timestamp when the plan entered pending state."""
    pendingAt: DateTime
    """Timestamp when plan execution began."""
    startedAt: DateTime
    """Timestamp when plan execution completed."""
    finishedAt: DateTime
  }

  """
  Filter conditions for Plan queries. Supports logical combinators (_and, _or, _not) and field-level comparisons.
  """
  input PlanFilter {
    _and: [PlanFilter!]
    _or: [PlanFilter!]
    _not: PlanFilter

    id: StringComparisonExp
    status: StringComparisonExp
    generatedConfiguration: BooleanComparisonExp
    hasChanges: BooleanComparisonExp
    resourceAdditions: IntComparisonExp
    resourceChanges: IntComparisonExp
    resourceDestructions: IntComparisonExp
    resourceImports: IntComparisonExp
    queuedAt: DateTimeComparisonExp
    pendingAt: DateTimeComparisonExp
    startedAt: DateTimeComparisonExp
    finishedAt: DateTimeComparisonExp
    mode: StringComparisonExp
    agentId: StringComparisonExp
    agentName: StringComparisonExp
    agentPoolId: StringComparisonExp
    agentPoolName: StringComparisonExp
  }

  extend type Query {
    plan(id: ID!): Plan
  }
`;

export default plansSchema;
