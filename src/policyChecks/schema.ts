import { gql } from "graphql-tag";

const policyCheckSchema = gql`
  type PolicyCheckStatusTimestamps {
    queuedAt: DateTime
    passedAt: DateTime
    hardFailedAt: DateTime
    softFailedAt: DateTime
    advisoryFailedAt: DateTime
    overriddenAt: DateTime
  }

  type PolicyCheckPermissions {
    canOverride: Boolean!
  }

  type PolicyCheckActions {
    isOverridable: Boolean!
  }

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
