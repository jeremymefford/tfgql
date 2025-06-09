import { gql } from 'graphql-tag';

const projectTeamAccessSchema = gql`
  type ProjectTeamAccess {
    id: ID!
    # TODO: add ProjectTeamAccess fields based on Terraform Cloud API
  }

  input ProjectTeamAccessFilter {
    _and: [ProjectTeamAccessFilter!]
    _or: [ProjectTeamAccessFilter!]
    _not: ProjectTeamAccessFilter

    # TODO: add filter fields based on Terraform Cloud API
  }

  extend type Query {
    projectTeamAccess(projectId: ID!, filter: ProjectTeamAccessFilter): [ProjectTeamAccess!]!
    projectTeamAccessById(id: ID!): ProjectTeamAccess
  }
`;

export default projectTeamAccessSchema;