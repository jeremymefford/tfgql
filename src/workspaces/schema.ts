import { gql } from "graphql-tag";

const workspaceSchema = gql`
  type Workspace {
    id: ID!
    name: String!
    description: String
    locked: Boolean!
    lockedReason: String
    autoApply: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
    applyDurationAverage: Int
    planDurationAverage: Int
    policyCheckFailures: Int
    queueAllRuns: Boolean
    resourceCount: Int
    runFailures: Int
    source: String
    sourceName: String
    sourceUrl: String
    speculativeEnabled: Boolean
    structuredRunOutputEnabled: Boolean
    tagNames: [String!]!
    terraformVersion: String
    triggerPrefixes: [String!]!
    vcsRepo: JSON
    vcsRepoIdentifier: String
    workingDirectory: String
    workspaceKpisRunsCount: Int
    executionMode: String
    environment: String
    operations: Boolean
    fileTriggersEnabled: Boolean
    globalRemoteState: Boolean
    latestChangeAt: DateTime
    lastAssessmentResultAt: DateTime
    autoDestroyAt: DateTime
    autoDestroyStatus: String
    autoDestroyActivityDuration: Int
    inheritsProjectAutoDestroy: Boolean
    assessmentsEnabled: Boolean
    allowDestroyPlan: Boolean
    autoApplyRunTrigger: Boolean
    oauthClientName: String
    actions: WorkspaceActions
    permissions: WorkspacePermissions
    settingOverwrites: WorkspaceSettingOverwrites
    organization: Organization
    runs(filter: RunFilter): [Run!]!
    configurationVersions(
      filter: ConfigurationVersionFilter
    ): [ConfigurationVersion!]!
    variables(filter: VariableFilter): [Variable!]!
    stateVersions(filter: StateVersionFilter): [StateVersion!]!
    currentStateVersion: StateVersion
    providers: [WorkspaceProvider!]!
    modules: [WorkspaceModule!]!
    project: Project
  }

  type WorkspaceActions {
    isDestroyable: Boolean!
  }

  type WorkspacePermissions {
    canUpdate: Boolean!
    canDestroy: Boolean!
    canQueueRun: Boolean!
    canReadRun: Boolean!
    canReadVariable: Boolean!
    canUpdateVariable: Boolean!
    canReadStateVersions: Boolean!
    canReadStateOutputs: Boolean!
    canCreateStateVersions: Boolean!
    canQueueApply: Boolean!
    canLock: Boolean!
    canUnlock: Boolean!
    canForceUnlock: Boolean!
    canReadSettings: Boolean!
    canManageTags: Boolean!
    canManageRunTasks: Boolean!
    canForceDelete: Boolean!
    canManageAssessments: Boolean!
    canManageEphemeralWorkspaces: Boolean!
    canReadAssessmentResults: Boolean!
    canQueueDestroy: Boolean!
  }

  type WorkspaceProvider {
    name: String
    version: String
    source: String
  }

  type WorkspaceModule {
    name: String
    version: String
    source: String
  }

  type WorkspaceSettingOverwrites {
    executionMode: Boolean
    agentPool: Boolean
  }

  scalar JSON

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
    workspaces(
      includeOrgs: [String!]
      excludeOrgs: [String!]
      filter: WorkspaceFilter
    ): [Workspace!]!
    workspace(id: ID!): Workspace
    workspaceByName(organization: String!, workspaceName: String!): Workspace
    workspacesWithNoResources(
      includeOrgs: [String!]
      excludeOrgs: [String!]
      filter: WorkspaceFilter
    ): [Workspace!]!
    """
    List all workspaces across the selected organizations that have at least one run matching the given runFilter (e.g. non-terminal states).
    """
    workspacesWithOpenRuns(
      includeOrgs: [String!]
      excludeOrgs: [String!]
      filter: WorkspaceFilter
      runFilter: RunFilter
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
