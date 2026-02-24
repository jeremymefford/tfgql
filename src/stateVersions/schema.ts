import { gql } from "graphql-tag";

const stateVersionsSchema = gql`
  """
  An instance of Terraform state data for a workspace. State versions contain metadata about the state, its properties, and download URLs. They do not directly contain the stored state itself.
  """
  type StateVersion {
    """The state version's unique identifier."""
    id: ID!
    """Timestamp when this state version was created."""
    createdAt: DateTime!
    """The size of the state data in bytes."""
    size: Int
    """URL to download state data in a stable JSON format for external integrations. Only available for Terraform 1.3+."""
    hostedJsonStateDownloadUrl: String
    """URL to download the raw state data in Terraform's internal format."""
    hostedStateDownloadUrl: String
    """URL to upload JSON-formatted state data. Can only be used once per state version."""
    hostedJsonStateUploadUrl: String
    """URL to upload raw state data in Terraform's internal format. Can only be used once per state version."""
    hostedStateUploadUrl: String
    """Upload status of the state version content: 'pending', 'finalized', or 'discarded'."""
    status: String
    """Whether this is an intermediate state snapshot not yet set as the workspace's current state."""
    intermediate: Boolean
    """Extracted information about Terraform modules in this state. Populated asynchronously."""
    modules: JSON
    """Extracted information about Terraform providers used by resources in this state. Populated asynchronously."""
    providers: JSON
    """Extracted information about resources in this state. Populated asynchronously."""
    resources: JSON
    """Whether HCP Terraform has finished asynchronously extracting outputs, resources, and other information from this state."""
    resourcesProcessed: Boolean
    """The serial number of this state, which increments every time Terraform creates new state."""
    serial: Int
    """The internal state format version number."""
    stateVersion: Int
    """The Terraform version that created this state. Populated asynchronously."""
    terraformVersion: String
    """The SHA of the VCS commit used in the run that produced this state."""
    vcsCommitSha: String
    """A link to the VCS commit used in the run that produced this state."""
    vcsCommitUrl: String
    """Count of billable Resources Under Management (RUM)."""
    billableRumCount: Int
    """The run that created this state version, if applicable."""
    run: Run
    """The user who created this state version."""
    createdBy: User
    """The workspace this state version belongs to."""
    workspace: Workspace
    """Parsed output values from this state version."""
    outputs: [StateVersionOutput!]!
  }

  """
  Filter conditions for StateVersion queries. Supports logical combinators (_and, _or, _not) and field-level comparisons.
  """
  input StateVersionFilter {
    _and: [StateVersionFilter!]
    _or: [StateVersionFilter!]
    _not: StateVersionFilter

    id: StringComparisonExp
    status: StringComparisonExp
    intermediate: BooleanComparisonExp
    serial: IntComparisonExp
    billableRumCount: IntComparisonExp
    createdAt: DateTimeComparisonExp
    size: IntComparisonExp
    resourcesProcessed: BooleanComparisonExp
    stateVersion: IntComparisonExp
    terraformVersion: TerraformVersionComparisonExp
  }

  extend type Query {
    """
    List state versions for a specific workspace.
    """
    stateVersions(
      orgName: String!
      workspaceName: String!
      filter: StateVersionFilter
    ): [StateVersion!]!
    """
    Look up a single state version by ID.
    """
    stateVersion(id: ID!): StateVersion
    """
    Get the current (most recent) state version for a workspace.
    """
    workspaceCurrentStateVersion(workspaceId: ID!): StateVersion
  }
`;

export default stateVersionsSchema;
