import { gql } from "graphql-tag";

const policyCheckSchema = gql`
  """
  Timestamps for each policy check status transition.
  """
  type PolicyCheckStatusTimestamps {
    """Timestamp when the policy check was queued."""
    queuedAt: DateTime
    """Timestamp when the policy check passed."""
    passedAt: DateTime
    """Timestamp when a hard-mandatory policy failure occurred."""
    hardFailedAt: DateTime
    """Timestamp when a soft-mandatory policy failure occurred."""
    softFailedAt: DateTime
    """Timestamp when an advisory policy failure occurred."""
    advisoryFailedAt: DateTime
    """Timestamp when the policy check was overridden."""
    overriddenAt: DateTime
  }

  """
  Permissions the current user has on a policy check.
  """
  type PolicyCheckPermissions {
    """Whether the current user can override this policy check."""
    canOverride: Boolean!
  }

  """
  Available actions for a policy check based on its current state.
  """
  type PolicyCheckActions {
    """Whether this policy check can be overridden."""
    isOverridable: Boolean!
  }

  """
  The result of a Sentinel policy check performed during a run. Contains the overall status, scope, and detailed result data including pass/fail outcomes.
  """
  type PolicyCheck {
    """The policy check's unique identifier."""
    id: ID!
    """Current state of the policy check (e.g., 'passed', 'soft_failed', 'hard_failed', 'overridden')."""
    status: String!
    """The scope of the policy check (e.g., 'organization')."""
    scope: String!
    """Detailed result object containing pass/fail counts and policy outcomes."""
    result: JSON!
    """Low-level Sentinel engine details generated during policy evaluation."""
    sentinel: JSON
    """Timestamps for each policy check status transition."""
    statusTimestamps: PolicyCheckStatusTimestamps!
    """Permissions the current user has on this policy check."""
    permissions: PolicyCheckPermissions!
    """Available actions for this policy check based on its current state."""
    actions: PolicyCheckActions!
    """Timestamp when the policy check was created."""
    createdAt: DateTime
    """Timestamp when the policy check completed."""
    finishedAt: DateTime
    """URL to retrieve detailed policy check output."""
    outputUrl: String
    """The run this policy check was performed on."""
    run: Run!
  }

  """
  Filter conditions for PolicyCheck queries. Supports logical combinators (_and, _or, _not) and field-level comparisons.
  """
  input PolicyCheckFilter {
    _and: [PolicyCheckFilter!]
    _or: [PolicyCheckFilter!]
    _not: PolicyCheckFilter

    id: StringComparisonExp
    status: StringComparisonExp
    scope: StringComparisonExp
    runId: StringComparisonExp
  }
`;

export default policyCheckSchema;
