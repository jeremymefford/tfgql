import { gql } from 'graphql-tag';

const teamMembershipsSchema = gql`
  type TeamMembership {
    id: ID!
    teamId: ID!
    userId: ID!
  }

  input TeamMembershipFilter {
    _and: [TeamMembershipFilter!]
    _or: [TeamMembershipFilter!]
    _not: TeamMembershipFilter

    id: StringComparisonExp
    teamId: StringComparisonExp
    userId: StringComparisonExp
  }

  extend type Query {
    teamMemberships(teamId: ID!, filter: TeamMembershipFilter): [TeamMembership!]!
    teamMembership(id: ID!): TeamMembership
  }
`;

export default teamMembershipsSchema;