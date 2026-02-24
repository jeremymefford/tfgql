import { gql } from "graphql-tag";

const workspaceSchema = gql`
  """
  Represents running infrastructure managed by Terraform. Each workspace is associated with a Terraform configuration and maintains state, variables, and run history.
  """
  type Workspace {
    """
    The workspace's unique identifier.
    """
    id: ID!
    """
    The workspace name. Must contain only letters, numbers, hyphens, and underscores.
    """
    name: String!
    """
    A text description of the workspace's purpose.
    """
    description: String
    """
    Whether the workspace is currently locked, preventing new runs.
    """
    locked: Boolean!
    """
    The reason the workspace was locked, if provided.
    """
    lockedReason: String
    """
    When true, automatically applies successful plans triggered by VCS pushes.
    """
    autoApply: Boolean!
    """
    Timestamp when the workspace was created.
    """
    createdAt: DateTime!
    """
    Timestamp when the workspace was last modified.
    """
    updatedAt: DateTime!
    """
    Mean apply phase duration in milliseconds.
    """
    applyDurationAverage: Int
    """
    Mean plan phase duration in milliseconds.
    """
    planDurationAverage: Int
    """
    Count of runs that failed due to policy check violations.
    """
    policyCheckFailures: Int
    """
    When true, runs are queued immediately when the workspace is created, rather than waiting for configuration.
    """
    queueAllRuns: Boolean
    """
    Number of infrastructure resources managed by the workspace.
    """
    resourceCount: Int
    """
    Total count of unsuccessful runs.
    """
    runFailures: Int
    """
    The application or system that created the workspace.
    """
    source: String
    """
    A friendly display name for the creating application.
    """
    sourceName: String
    """
    A URL referencing the application that created the workspace.
    """
    sourceUrl: String
    """
    When true, allows automatic speculative plans on pull requests.
    """
    speculativeEnabled: Boolean
    """
    When true, enables structured (JSON) run output.
    """
    structuredRunOutputEnabled: Boolean
    """
    List of tag names applied to the workspace.
    """
    tagNames: [String!]!
    """
    The Terraform version or version constraint configured for the workspace.
    """
    terraformVersion: String
    """
    List of directory paths that trigger runs when files change within them.
    """
    triggerPrefixes: [String!]!
    """
    VCS repository settings object, including branch, OAuth token, and repository identifier.
    """
    vcsRepo: JSON
    """
    The VCS repository reference string in :org/:repo format.
    """
    vcsRepoIdentifier: String
    """
    The relative path within the repo where Terraform commands are executed.
    """
    workingDirectory: String
    """
    Number of runs included in workspace KPI metrics.
    """
    workspaceKpisRunsCount: Int
    """
    How Terraform runs execute: 'remote', 'local', or 'agent'.
    """
    executionMode: String
    """
    Deployment environment classification for the workspace.
    """
    environment: String
    """
    Deprecated: use executionMode instead.
    """
    operations: Boolean
    """
    When true, only VCS pushes that change files matching trigger patterns or prefixes start runs.
    """
    fileTriggersEnabled: Boolean
    """
    When true, all workspaces in the organization can access this workspace's state.
    """
    globalRemoteState: Boolean
    """
    Timestamp of the most recent state version change or workspace modification.
    """
    latestChangeAt: DateTime
    """
    Timestamp of the most recent health assessment completion.
    """
    lastAssessmentResultAt: DateTime
    """
    Scheduled timestamp for automatic destroy operation.
    """
    autoDestroyAt: DateTime
    """
    Current status of the scheduled auto-destroy.
    """
    autoDestroyStatus: String
    """
    Inactivity period (in milliseconds) before the workspace is scheduled for auto-destroy.
    """
    autoDestroyActivityDuration: Int
    """
    Whether the workspace inherits its auto-destroy settings from its parent project.
    """
    inheritsProjectAutoDestroy: Boolean
    """
    When true, health assessments (drift detection) are enabled for this workspace.
    """
    assessmentsEnabled: Boolean
    """
    Whether destroy plans can be queued on this workspace.
    """
    allowDestroyPlan: Boolean
    """
    When true, automatically applies successful plans initiated by run triggers.
    """
    autoApplyRunTrigger: Boolean
    """
    The name of the OAuth client used for VCS connection.
    """
    oauthClientName: String
    """
    Available actions for the workspace based on its current state.
    """
    actions: WorkspaceActions
    """
    Permissions the current user has on this workspace.
    """
    permissions: WorkspacePermissions
    """
    Indicates which settings are overridden at the workspace level rather than inherited from the project.
    """
    settingOverwrites: WorkspaceSettingOverwrites
    """
    The parent organization containing this workspace.
    """
    organization: Organization
    """
    Runs executed in this workspace, with optional filtering.
    """
    runs(filter: RunFilter): [Run!]!
    """
    Configuration versions uploaded to this workspace, with optional filtering.
    """
    configurationVersions(
      filter: ConfigurationVersionFilter
    ): [ConfigurationVersion!]!
    """
    Terraform and environment variables configured on this workspace.
    """
    variables(filter: VariableFilter): [Variable!]!
    """
    State version history for this workspace.
    """
    stateVersions(filter: StateVersionFilter): [StateVersion!]!
    """
    The active (most recent) infrastructure state for this workspace.
    """
    currentStateVersion: StateVersion
    """
    Terraform providers used by resources in this workspace.
    """
    providers: [WorkspaceProvider!]!
    """
    Terraform modules used in this workspace's configuration.
    """
    modules: [WorkspaceModule!]!
    """
    The project this workspace belongs to.
    """
    project: Project
    """
    Policy sets currently enforced on this workspace.
    """
    appliedPolicySets(filter: PolicySetFilter): [PolicySet!]!
    """
    The active or most recent run for this workspace.
    """
    currentRun: Run
    """
    Team access grants for this workspace.
    """
    teamAccess(filter: WorkspaceTeamAccessFilter): [WorkspaceTeamAccess!]!
  }

  """
  Available actions for a workspace based on its current state.
  """
  type WorkspaceActions {
    """
    Whether the workspace's infrastructure can be safely destroyed.
    """
    isDestroyable: Boolean!
  }

  """
  Permissions the current API token has on a workspace, controlling which operations are allowed.
  """
  type WorkspacePermissions {
    """
    Whether the current user can modify workspace settings.
    """
    canUpdate: Boolean!
    """
    Whether the current user can queue destroy operations.
    """
    canDestroy: Boolean!
    """
    Whether the current user can initiate new Terraform runs.
    """
    canQueueRun: Boolean!
    """
    Whether the current user can view run details and status.
    """
    canReadRun: Boolean!
    """
    Whether the current user can access workspace variables.
    """
    canReadVariable: Boolean!
    """
    Whether the current user can modify variable values.
    """
    canUpdateVariable: Boolean!
    """
    Whether the current user can access state file history.
    """
    canReadStateVersions: Boolean!
    """
    Whether the current user can view computed output values.
    """
    canReadStateOutputs: Boolean!
    """
    Whether the current user can upload state files directly.
    """
    canCreateStateVersions: Boolean!
    """
    Whether the current user can execute approved Terraform plans.
    """
    canQueueApply: Boolean!
    """
    Whether the current user can lock the workspace to prevent concurrent modifications.
    """
    canLock: Boolean!
    """
    Whether the current user can remove the workspace lock.
    """
    canUnlock: Boolean!
    """
    Whether the current user can override a stuck workspace lock.
    """
    canForceUnlock: Boolean!
    """
    Whether the current user can view workspace configuration settings.
    """
    canReadSettings: Boolean!
    """
    Whether the current user can add or remove workspace tags.
    """
    canManageTags: Boolean!
    """
    Whether the current user can configure run task enforcement.
    """
    canManageRunTasks: Boolean!
    """
    Whether the current user can remove the workspace without safeguards.
    """
    canForceDelete: Boolean!
    """
    Whether the current user can control health assessment settings.
    """
    canManageAssessments: Boolean!
    """
    Whether the current user can create temporary workspaces.
    """
    canManageEphemeralWorkspaces: Boolean!
    """
    Whether the current user can view health assessment outcomes.
    """
    canReadAssessmentResults: Boolean!
    """
    Whether the current user can schedule infrastructure destruction.
    """
    canQueueDestroy: Boolean!
  }

  """
  A Terraform provider used by resources in a workspace, extracted from state data.
  """
  type WorkspaceProvider {
    """
    The provider's display name.
    """
    name: String
    """
    The provider version in use.
    """
    version: String
    """
    The provider's source address (e.g., hashicorp/aws).
    """
    source: String
  }

  """
  A Terraform module used in a workspace's configuration, extracted from state data.
  """
  type WorkspaceModule {
    """
    The module's display name.
    """
    name: String
    """
    The module version in use.
    """
    version: String
    """
    The module's source location.
    """
    source: String
  }

  """
  Indicates which workspace settings are overridden locally rather than inherited from the parent project.
  """
  type WorkspaceSettingOverwrites {
    """
    Whether the workspace overrides the project's default execution mode.
    """
    executionMode: Boolean
    """
    Whether the workspace overrides the project's default agent pool.
    """
    agentPool: Boolean
  }

  scalar JSON

  """
  Filter conditions for Workspace queries. Supports logical combinators (_and, _or, _not) and field-level comparisons.
  """
  input WorkspaceFilter {
    _and: [WorkspaceFilter!]
    _or: [WorkspaceFilter!]
    _not: WorkspaceFilter

    id: StringComparisonExp
    name: StringComparisonExp
    description: StringComparisonExp
    locked: BooleanComparisonExp
    lockedReason: StringComparisonExp
    autoApply: BooleanComparisonExp
    createdAt: DateTimeComparisonExp
    updatedAt: DateTimeComparisonExp
    applyDurationAverage: IntComparisonExp
    planDurationAverage: IntComparisonExp
    policyCheckFailures: IntComparisonExp
    queueAllRuns: BooleanComparisonExp
    resourceCount: IntComparisonExp
    runFailures: IntComparisonExp
    source: StringComparisonExp
    sourceName: StringComparisonExp
    sourceUrl: StringComparisonExp
    speculativeEnabled: BooleanComparisonExp
    structuredRunOutputEnabled: BooleanComparisonExp
    tagNames: StringComparisonExp
    terraformVersion: TerraformVersionComparisonExp
    triggerPrefixes: StringComparisonExp
    vcsRepoIdentifier: StringComparisonExp
    workingDirectory: StringComparisonExp
    workspaceKpisRunsCount: IntComparisonExp
    executionMode: StringComparisonExp
    environment: StringComparisonExp
    operations: BooleanComparisonExp
    fileTriggersEnabled: BooleanComparisonExp
    globalRemoteState: BooleanComparisonExp
    latestChangeAt: DateTimeComparisonExp
    lastAssessmentResultAt: DateTimeComparisonExp
    autoDestroyAt: DateTimeComparisonExp
    autoDestroyStatus: StringComparisonExp
    autoDestroyActivityDuration: IntComparisonExp
    inheritsProjectAutoDestroy: BooleanComparisonExp
    assessmentsEnabled: BooleanComparisonExp
    allowDestroyPlan: BooleanComparisonExp
    autoApplyRunTrigger: BooleanComparisonExp
    oauthClientName: StringComparisonExp
  }

  extend type Query {
    """
    List all workspaces across the selected organizations.
    """
    workspaces(
      includeOrgs: [String!]
      excludeOrgs: [String!]
      filter: WorkspaceFilter
    ): [Workspace!]!
    """
    Look up a single workspace by ID.
    """
    workspace(id: ID!): Workspace
    """
    Look up a single workspace by organization name and workspace name.
    """
    workspaceByName(organization: String!, workspaceName: String!): Workspace
    """
    List workspaces that have zero managed resources (empty state).
    """
    workspacesWithNoResources(
      includeOrgs: [String!]
      excludeOrgs: [String!]
      filter: WorkspaceFilter
    ): [Workspace!]!
    """
    List workspaces where the current run has failed policy checks.
    """
    workspacesWithFailedPolicyChecks(
      includeOrgs: [String!]
      excludeOrgs: [String!]
      filter: WorkspaceFilter
    ): [Workspace!]!
    """
    List all workspaces across the selected organizations that have at least one run matching the given runFilter (e.g. non-terminal states).
    """
    workspacesWithOpenCurrentRun(
      includeOrgs: [String!]
      excludeOrgs: [String!]
      filter: WorkspaceFilter
    ): [Workspace!]!
    """
    List all run-trigger edges (workspace dependency graph) across the selected organizations.
    """
    runTriggerGraph(
      includeOrgs: [String!]
      excludeOrgs: [String!]
    ): [WorkspaceRunTrigger!]!
  }
`;
export default workspaceSchema;
