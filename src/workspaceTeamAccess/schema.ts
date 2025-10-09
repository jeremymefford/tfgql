import { gql } from "graphql-tag";

const teamAccessSchema = gql`
  extend type Query {
    teamWorkspaces(teamId: ID!, filter: WorkspaceFilter): [Workspace!]!
  }
`;

export default teamAccessSchema;
