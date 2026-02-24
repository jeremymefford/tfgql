import { gql } from "graphql-tag";

const stateVersionsSchema = gql`
  """
  An instance of Terraform state data for a workspace. State versions contain metadata about the state, its properties, and download URLs. They do not directly contain the stored state itself.
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
    billableRumCount: Int
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
