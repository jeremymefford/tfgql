import { gql } from "graphql-tag";

const registryTestsSchema = gql`
  """
  A test run for a private registry module. Test runs validate module functionality
  by executing Terraform operations against the module code.
  """
  type RegistryTestRun {
    """The test run's unique identifier."""
    id: ID!
    """Current status of the test run."""
    status: String!
    """Timestamp when the test run was created."""
    createdAt: DateTime!
    """Timestamp when the test run was last updated."""
    updatedAt: DateTime!
    """URL for reading the test run logs."""
    logReadUrl: String
  }

  """
  Filter conditions for RegistryTestRun queries.
  """
  input RegistryTestRunFilter {
    _and: [RegistryTestRunFilter!]
    _or: [RegistryTestRunFilter!]
    _not: RegistryTestRunFilter

    id: StringComparisonExp
    status: StringComparisonExp
    createdAt: DateTimeComparisonExp
    updatedAt: DateTimeComparisonExp
  }

  """
  A variable configured for registry module tests.
  """
  type RegistryTestVariable {
    """The variable's unique identifier."""
    id: ID!
    """The variable key name."""
    key: String!
    """The variable value. Sensitive values are redacted."""
    value: String!
    """The variable category ('terraform' or 'env')."""
    category: String!
    """Whether the value is HCL."""
    hcl: Boolean!
    """Whether this is a sensitive variable."""
    sensitive: Boolean!
  }

  """
  Filter conditions for RegistryTestVariable queries.
  """
  input RegistryTestVariableFilter {
    _and: [RegistryTestVariableFilter!]
    _or: [RegistryTestVariableFilter!]
    _not: RegistryTestVariableFilter

    id: StringComparisonExp
    key: StringComparisonExp
    category: StringComparisonExp
  }

`;

export default registryTestsSchema;
