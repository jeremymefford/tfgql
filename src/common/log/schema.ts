import { gql } from "graphql-tag";

const logSchema = gql`
  enum LogLevel {
    TRACE
    DEBUG
    INFO
    WARN
    ERROR
    JSON
  }
`;

export default logSchema;
