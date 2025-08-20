import { gql } from 'graphql-tag';

const appliesSchema = gql`
  type Apply {
    id: ID!
    mode: String
    status: String!
    queuedAt: DateTime
    startedAt: DateTime
    finishedAt: DateTime
    logReadUrl: String!
    structuredRunOutputEnabled: Boolean!
    resourceAdditions: Int
    resourceChanges: Int
    resourceDestructions: Int
    resourceImports: Int
    stateVersionIds: [ID]!
  }

  input ApplyFilter {
    _and: [ApplyFilter!]
    _or: [ApplyFilter!]
    _not: ApplyFilter

    id: StringComparisonExp
    mode: StringComparisonExp
    status: StringComparisonExp
    queuedAt: DateTimeComparisonExp
    startedAt: DateTimeComparisonExp
    finishedAt: DateTimeComparisonExp
    logReadUrl: StringComparisonExp
    resourceAdditions: IntComparisonExp
    resourceChanges: IntComparisonExp
    resourceDestructions: IntComparisonExp
    resourceImports: IntComparisonExp
    stateVersionIds: StringComparisonExp
  }

  extend type Query {
    applyForRun(runId: ID!): Apply
    apply(id: ID!): Apply
    appliesForWorkspace(workspaceId: ID!, filter: ApplyFilter): [Apply!]!
    appliesForProject(projectId: ID!, filter: ApplyFilter): [Apply!]!
    appliesForOrganization(organizationId: ID!, filter: ApplyFilter): [Apply!]!
  }
`;

export default appliesSchema;