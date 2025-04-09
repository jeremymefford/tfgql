import { gql } from 'graphql-tag';

const configurationVersionSchema = gql`
  type ConfigurationVersion {
    id: ID!
    autoQueueRuns: Boolean!
    error: String
    errorMessage: String
    provisional: Boolean!
    source: String
    speculative: Boolean!
    status: String!
    statusTimestamps: ConfigurationVersionStatusTimestamps
    changedFiles: [String!]!
    ingressAttributes: IngressAttributes
  }

  type ConfigurationVersionStatusTimestamps {
    archivedAt: DateTime
    fetchingAt: DateTime
    uploadedAt: DateTime
  }

  type IngressAttributes {
    id: ID!
  }

  extend type Query {
    configurationVersion(id: ID!): ConfigurationVersion
    configurationVersions(workspaceId: ID!): [ConfigurationVersion]!
  }
`;

export default configurationVersionSchema;
