import { gql } from "graphql-tag";

const runSchema = gql`
  """
  Represents a Terraform execution within a workspace. A run performs a plan and optionally an apply to create, update, or destroy infrastructure.
  """
  type Run {
    """
    The run's unique identifier.
    """
    id: ID!
    """
    Current state of the run (e.g., pending, planning, planned, applying, applied, errored, canceled).
    """
    status: String!
    """
    A custom message associated with the run, typically describing its purpose.
    """
    message: String
    """
    Whether this run is a destroy plan that removes all provisioned resources.
    """
    isDestroy: Boolean!
    """
    Timestamp when the run was created.
    """
    createdAt: DateTime!
    """
    Timestamp when the run was canceled, if applicable.
    """
    canceledAt: DateTime
    """
    Whether the plan detected any infrastructure changes.
    """
    hasChanges: Boolean!
    """
    Whether the run will automatically apply on a successful plan.
    """
    autoApply: Boolean!
    """
    Whether Terraform can apply the run even when the plan contains no changes.
    """
    allowEmptyApply: Boolean!
    """
    Whether Terraform can generate resource configuration during import operations.
    """
    allowConfigGeneration: Boolean!
    """
    Whether this is a speculative plan-only run that cannot be applied.
    """
    planOnly: Boolean!
    """
    The origin of the run (e.g., tfe-ui, tfe-api, tfe-configuration-version).
    """
    source: String!
    """
    Timestamps for run status transitions.
    """
    statusTimestamps: RunStatusTimestamps
    """
    The reason the run was initiated (e.g., manual, VCS push, run trigger).
    """
    triggerReason: String!
    """
    Optional list of resource addresses targeted with the -target flag.
    """
    targetAddrs: [String!]
    """
    Optional list of resource addresses targeted with the -replace flag.
    """
    replaceAddrs: [String!]
    """
    Permissions the current user has on this run.
    """
    permissions: RunPermissions!
    """
    Available actions for this run based on its current state.
    """
    actions: RunActions!
    """
    Whether the run refreshes state before planning.
    """
    refresh: Boolean!
    """
    When true, the run refreshes state without modifying resources.
    """
    refreshOnly: Boolean!
    """
    Whether this is a saved plan run for later confirmation.
    """
    savePlan: Boolean!
    """
    Run-specific variable values passed to this execution.
    """
    variables: [String!]!
    """
    The workspace this run belongs to.
    """
    workspace: Workspace
    """
    The configuration version used for this run.
    """
    configurationVersion: ConfigurationVersion
    """
    The apply phase of this run, if one exists.
    """
    apply: Apply
    """
    Comments left on this run.
    """
    comments(filter: CommentFilter): [Comment!]!
    """
    Events recorded during this run's lifecycle.
    """
    runEvents: [RunEvent!]!
    """
    Run triggers associated with this run.
    """
    runTriggers(filter: RunTriggerFilter): [RunTrigger!]!
    """
    The plan phase of this run.
    """
    plan: Plan
    """
    OPA/Sentinel policy evaluations performed during this run.
    """
    policyEvaluations(filter: PolicyEvaluationFilter): [PolicyEvaluation!]!
    """
    Sentinel policy checks performed during this run.
    """
    policyChecks(filter: PolicyCheckFilter): [PolicyCheck!]!
  }

  """
  Permissions the current API token has on a run, controlling which operations are allowed.
  """
  type RunPermissions {
    """
    Whether the current user can apply this run.
    """
    canApply: Boolean!
    """
    Whether the current user can cancel this run.
    """
    canCancel: Boolean!
    """
    Whether the current user can add comments to this run.
    """
    canComment: Boolean!
    """
    Whether the current user can discard this run.
    """
    canDiscard: Boolean!
    """
    Whether the current user can bypass workflow to execute immediately.
    """
    canForceExecute: Boolean!
    """
    Whether the current user can forcefully terminate this run.
    """
    canForceCancel: Boolean!
    """
    Whether the current user can override failed policy checks.
    """
    canOverridePolicyCheck: Boolean!
  }

  """
  Available actions for a run based on its current state.
  """
  type RunActions {
    """
    Whether the run can be interrupted during planning or applying.
    """
    isCancelable: Boolean!
    """
    Whether the run is awaiting user confirmation to proceed.
    """
    isConfirmable: Boolean!
    """
    Whether the run can be discarded to unlock the workspace.
    """
    isDiscardable: Boolean!
    """
    Whether an admin can forcibly terminate the run.
    """
    isForceCancelable: Boolean!
  }

  """
  Timestamps recording when a run transitioned between statuses.
  """
  type RunStatusTimestamps {
    """
    Timestamp when the plan becomes ready to be queued.
    """
    planQueueableAt: DateTime
  }

  """
  Filter conditions for Run.permissions fields.
  """
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

  """
  Filter conditions for Run.actions fields.
  """
  input RunActionsFilter {
    _and: [RunActionsFilter!]
    _or: [RunActionsFilter!]
    _not: RunActionsFilter

    isCancelable: BooleanComparisonExp
    isConfirmable: BooleanComparisonExp
    isDiscardable: BooleanComparisonExp
    isForceCancelable: BooleanComparisonExp
  }

  """
  Filter conditions for Run.statusTimestamps fields.
  """
  input RunStatusTimestampsFilter {
    planQueueableAt: DateTimeComparisonExp
  }

  """
  Filter conditions for Run queries. Supports logical combinators (_and, _or, _not) and field-level comparisons.
  """
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

  """
  An event recorded during a run's lifecycle, such as state transitions or user actions.
  """
  type RunEvent {
    """
    The run event's unique identifier.
    """
    id: ID!
    """
    The event payload as a JSON object.
    """
    body: JSON!
  }
`;

export default runSchema;
