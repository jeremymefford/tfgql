import gql from "graphql-tag";

const variableSchema = gql`
  """
  A key/value pair used to parameterize Terraform runs. Variables can be Terraform input variables or environment variables, and may be marked as sensitive.
  """
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
    """
    List variables for a specific workspace.
    """
    variables(
      organization: String!
      workspaceName: String!
      filter: VariableFilter
    ): [Variable!]!
    """
    List workspaces that have a TF_LOG environment variable set to one of the given log categories.
    """
    workspacesWithTFLogCategory(
      includeOrgs: [String!]
      excludeOrgs: [String!]
      categories: [TF_LOG_CATEGORY!]!
    ): [Workspace!]!
  }
`;
export default variableSchema;
