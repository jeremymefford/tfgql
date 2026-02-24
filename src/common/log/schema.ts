import { gql } from "graphql-tag";

const logSchema = gql`
  """
  Log level filter for structured Terraform run output. Controls the minimum severity of log entries returned.
  """
  enum LogLevel {
    """
    Show all log messages including the most verbose trace output.
    """
    TRACE
    """
    Show debug-level messages and above.
    """
    DEBUG
    """
    Show informational messages and above.
    """
    INFO
    """
    Show warning messages and above.
    """
    WARN
    """
    Show only error messages.
    """
    ERROR
    """
    Return raw JSON log lines without level filtering.
    """
    JSON
  }
`;

export default logSchema;
