import { gql } from 'graphql-tag';

const teamMembershipsSchema = gql`
  type TeamMembership {
    id: ID!
    # TODO: add TeamMembership fields based on Terraform Cloud API
  }

  input TeamMembershipFilter {
    _and: [TeamMembershipFilter!]
    _or: [TeamMembershipFilter!]
    _not: TeamMembershipFilter

    # TODO: add filter fields based on Terraform Cloud API
  }

  extend type Query {
    teamMemberships(teamId: ID!, filter: TeamMembershipFilter): [TeamMembership!]!
    teamMembership(id: ID!): TeamMembership
  }
`;

export default teamMembershipsSchema;