import { gql } from "graphql-tag";

const runSchema = gql`
  """
  Represents a Terraform execution within a workspace. A run performs a plan and optionally an apply to create, update, or destroy infrastructure.
  """
  type Run {
    id: ID!
    status: String!
    message: String
    isDestroy: Boolean!
    createdAt: DateTime!
    canceledAt: DateTime
    hasChanges: Boolean!
    autoApply: Boolean!
    allowEmptyApply: Boolean!
    allowConfigGeneration: Boolean!
    planOnly: Boolean!
    source: String!
    statusTimestamps: RunStatusTimestamps
    triggerReason: String!
    targetAddrs: [String!]
    replaceAddrs: [String!]
    permissions: RunPermissions!
    actions: RunActions!
    refresh: Boolean!
    refreshOnly: Boolean!
    savePlan: Boolean!
    variables: [String!]!
    workspace: Workspace
    configurationVersion: ConfigurationVersion
    apply: Apply
    comments(filter: CommentFilter): [Comment!]!
    runEvents: [RunEvent!]!
    runTriggers(filter: RunTriggerFilter): [RunTrigger!]!
    plan: Plan
    policyEvaluations(filter: PolicyEvaluationFilter): [PolicyEvaluation!]!
    policyChecks(filter: PolicyCheckFilter): [PolicyCheck!]!
  }

  type RunPermissions {
    canApply: Boolean!
    canCancel: Boolean!
    canComment: Boolean!
    canDiscard: Boolean!
    canForceExecute: Boolean!
    canForceCancel: Boolean!
    canOverridePolicyCheck: Boolean!
  }

  type RunActions {
    isCancelable: Boolean!
    isConfirmable: Boolean!
    isDiscardable: Boolean!
    isForceCancelable: Boolean!
  }

  type RunStatusTimestamps {
    planQueueableAt: DateTime
  }

  input RunPermissionsFilter {
    _and: [RunPermissionsFilter!]
    _or: [RunPermissionsFilter!]
    _not: RunPermissionsFilter

    canApply: BooleanComparisonExp
    canCancel: BooleanComparisonExp
    canComment: BooleanComparisonExp
    canDiscard: BooleanComparisonExp
    canForceExecute: BooleanComparisonExp
    canForceCancel: BooleanComparisonExp
    canOverridePolicyCheck: BooleanComparisonExp
  }

  input RunActionsFilter {
    _and: [RunActionsFilter!]
    _or: [RunActionsFilter!]
    _not: RunActionsFilter

    isCancelable: BooleanComparisonExp
    isConfirmable: BooleanComparisonExp
    isDiscardable: BooleanComparisonExp
    isForceCancelable: BooleanComparisonExp
  }

  input RunStatusTimestampsFilter {
    planQueueableAt: DateTimeComparisonExp
  }

  input RunFilter {
    _and: [RunFilter!]
    _or: [RunFilter!]
    _not: RunFilter

    id: StringComparisonExp
    status: StringComparisonExp
    message: StringComparisonExp
    source: StringComparisonExp
    triggerReason: StringComparisonExp

    isDestroy: BooleanComparisonExp
    hasChanges: BooleanComparisonExp
    autoApply: BooleanComparisonExp
    allowEmptyApply: BooleanComparisonExp
    allowConfigGeneration: BooleanComparisonExp
    planOnly: BooleanComparisonExp
    refresh: BooleanComparisonExp
    refreshOnly: BooleanComparisonExp
    savePlan: BooleanComparisonExp
    createdAt: DateTimeComparisonExp
    canceledAt: DateTimeComparisonExp

    permissions: RunPermissionsFilter
    actions: RunActionsFilter
    statusTimestamps: RunStatusTimestampsFilter
  }

  extend type Query {
    """
    List all runs for a specific workspace.
    """
    runsForWorkspace(workspaceId: ID!, filter: RunFilter): [Run!]!
    """
    Look up a single run by ID.
    """
    run(id: ID!): Run
    """
    List all runs across the selected organizations.
    """
    runs(
      includeOrgs: [String!]
      excludeOrgs: [String!]
      filter: RunFilter
    ): [Run!]!
    """
    List runs where a policy check was soft-mandatory failed and then overridden.
    """
    runsWithOverriddenPolicy(
      includeOrgs: [String!]
      excludeOrgs: [String!]
      filter: RunFilter
    ): [Run!]!
    """
    List runs with additional filtering on plan and apply attributes. Each run's plan and apply are fetched individually to evaluate the filters.
    """
    runsWithPlanApplyFilter(
      includeOrgs: [String!]
      excludeOrgs: [String!]
      filter: RunFilter
      planFilter: PlanFilter
      applyFilter: ApplyFilter
    ): [Run!]!
  }

  type RunEvent {
    id: ID!
    body: JSON!
  }
`;

export default runSchema;
