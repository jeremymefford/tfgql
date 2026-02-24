import gql from "graphql-tag";

const variableSchema = gql`
  """
  A key/value pair used to parameterize Terraform runs. Variables can be Terraform input variables or environment variables, and may be marked as sensitive.
  """
  type Variable {
    """The variable's unique identifier."""
    id: ID!
    """The variable name."""
    key: String!
    """The variable value. Returns null for sensitive variables."""
    value: String
    """Whether the variable value is sensitive and write-only."""
    sensitive: Boolean!
    """The variable category: 'terraform' for Terraform input variables or 'env' for environment variables."""
    category: String!
    """When true, the value is evaluated as HCL code rather than a literal string."""
    hcl: Boolean!
    """Timestamp when the variable was created."""
    createdAt: DateTime!
    """A text description of the variable's purpose."""
    description: String
    """The version identifier for this variable, used for optimistic locking."""
    versionId: String
    """The workspace this variable belongs to."""
    workspace: Workspace
  }

  """
  Terraform log verbosity levels. Used to identify workspaces with TF_LOG environment variables set.
  """
  enum TF_LOG_CATEGORY {
    JSON
    TRACE
    DEBUG
    INFO
    WARN
    ERROR
  }

  """
  Filter conditions for Variable queries. Supports logical combinators (_and, _or, _not) and field-level comparisons.
  """
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
