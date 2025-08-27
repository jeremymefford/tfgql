import { gql } from 'graphql-tag';

const organizationMembershipsSchema = gql`
  type OrganizationMembership {
    id: ID!
    status: String!
    organizationId: ID!
    userId: ID!
    teamIds: [ID!]!
  }

  input OrganizationMembershipFilter {
    _and: [OrganizationMembershipFilter!]
    _or: [OrganizationMembershipFilter!]
    _not: OrganizationMembershipFilter

    id: StringComparisonExp
    status: StringComparisonExp
    organizationId: StringComparisonExp
    userId: StringComparisonExp
    teamIds: StringComparisonExp
  }

  extend type Query {
    organizationMemberships(orgName: String!, filter: OrganizationMembershipFilter): [OrganizationMembership!]!
    organizationMembership(id: ID!): OrganizationMembership
    myOrganizationMemberships(filter: OrganizationMembershipFilter): [OrganizationMembership!]!
  }
`;

export default organizationMembershipsSchema;