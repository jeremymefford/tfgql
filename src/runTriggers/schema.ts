import { gql } from "graphql-tag";

const runTriggersSchema = gql`
  """
  Inbound or outbound run-trigger connections between workspaces.
  """
  interface AbstractRunTrigger {
    """The run trigger's unique identifier."""
    id: ID!
    """The name of the destination workspace where triggered runs are created."""
    workspaceName: String!
    """The name of the source workspace whose successful applies trigger runs."""
    sourceableName: String!
    """Timestamp when the run trigger was created."""
    createdAt: DateTime!
    """The destination workspace where triggered runs are created."""
    workspace: Workspace!
    """The source workspace whose successful applies initiate runs in the destination."""
    sourceable: Workspace!
  }

  type RunTrigger implements AbstractRunTrigger {
    """The run trigger's unique identifier."""
    id: ID!
    """The name of the destination workspace where triggered runs are created."""
    workspaceName: String!
    """The name of the source workspace whose successful applies trigger runs."""
    sourceableName: String!
    """Timestamp when the run trigger was created."""
    createdAt: DateTime!
    """The destination workspace where triggered runs are created."""
    workspace: Workspace!
    """The source workspace whose successful applies initiate runs in the destination."""
    sourceable: Workspace!
  }

  type WorkspaceRunTrigger implements AbstractRunTrigger {
    """The run trigger's unique identifier."""
    id: ID!
    """The name of the destination workspace where triggered runs are created."""
    workspaceName: String!
    """The name of the source workspace whose successful applies trigger runs."""
    sourceableName: String!
    """Timestamp when the run trigger was created."""
    createdAt: DateTime!
    """The destination workspace where triggered runs are created."""
    workspace: Workspace!
    """The source workspace whose successful applies initiate runs in the destination."""
    sourceable: Workspace!
    """True if runs are triggered in this workspace (inbound), false if this workspace triggers runs elsewhere (outbound)."""
    inbound: Boolean!
  }

  """
  Filter conditions for RunTrigger queries. Supports logical combinators (_and, _or, _not) and field-level comparisons.
  """
  input RunTriggerFilter {
    _and: [RunTriggerFilter!]
    _or: [RunTriggerFilter!]
    _not: RunTriggerFilter

    id: StringComparisonExp
    workspaceName: StringComparisonExp
    sourceableName: StringComparisonExp
    createdAt: DateTimeComparisonExp
  }

  extend type Query {
    """
    List all inbound and outbound run triggers for a specific workspace.
    """
    runTriggers(
      workspaceId: ID!
      filter: RunTriggerFilter
    ): [WorkspaceRunTrigger!]!
    """
    Look up a single run trigger by ID.
    """
    runTrigger(id: ID!): RunTrigger
  }
`;

export default runTriggersSchema;
