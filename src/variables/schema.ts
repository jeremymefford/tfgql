import gql from "graphql-tag";

const variableSchema = gql`
  type Variable {
    id: ID!
    key: String!
    value: String
    sensitive: Boolean!
    category: String!
    hcl: Boolean!
    createdAt: DateTime!
    description: String
    versionId: String
    workspace: Workspace
  }

  enum TF_LOG_CATEGORY {
    JSON
    TRACE
    DEBUG
    INFO
    WARN
    ERROR
  }

  input VariableFilter {
    _and: [VariableFilter!]
    _or: [VariableFilter!]
    _not: VariableFilter

    id: StringComparisonExp
    key: StringComparisonExp
    value: StringComparisonExp
    category: StringComparisonExp
    hcl: BooleanComparisonExp
    sensitive: BooleanComparisonExp
    description: StringComparisonExp
    versionId: StringComparisonExp
  }

  extend type Query {
    variables(
      organization: String!
      workspaceName: String!
      filter: VariableFilter
    ): [Variable!]!
    workspacesWithTFLogCategory(
      includeOrgs: [String!]
      excludeOrgs: [String!]
      categories: [TF_LOG_CATEGORY!]!
    ): [Workspace!]!
  }
`;
export default variableSchema;
