import { gql } from "graphql-tag";

const policyCheckSchema = gql`
  """
  Timestamps for each policy check status transition.
  """
  type PolicyCheckStatusTimestamps {
    queuedAt: DateTime
    passedAt: DateTime
    hardFailedAt: DateTime
    softFailedAt: DateTime
    advisoryFailedAt: DateTime
    overriddenAt: DateTime
  }

  """
  Permissions the current user has on a policy check.
  """
  type PolicyCheckPermissions {
    canOverride: Boolean!
  }

  """
  Available actions for a policy check based on its current state.
  """
  type PolicyCheckActions {
    isOverridable: Boolean!
  }

  """
  The result of a Sentinel policy check performed during a run. Contains the overall status, scope, and detailed result data including pass/fail outcomes.
  """
  type PolicyCheck {
    id: ID!
    status: String!
    scope: String!
    result: JSON!
    sentinel: JSON
    statusTimestamps: PolicyCheckStatusTimestamps!
    permissions: PolicyCheckPermissions!
    actions: PolicyCheckActions!
    createdAt: DateTime
    finishedAt: DateTime
    outputUrl: String
    run: Run!
  }

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
