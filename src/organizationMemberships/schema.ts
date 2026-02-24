import { gql } from "graphql-tag";

const organizationMembershipsSchema = gql`
  """
  Represents a user's membership in an organization. Users are added by invitation and become members once accepted.
  """
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
    """
    List all organization memberships across the selected organizations.
    """
    organizationMemberships(
      includeOrgs: [String!]
      excludeOrgs: [String!]
      filter: OrganizationMembershipFilter
    ): [OrganizationMembership!]!
    """
    Look up a single organization membership by ID.
    """
    organizationMembership(id: ID!): OrganizationMembership
    """
    List the authenticated user's own organization memberships.
    """
    myOrganizationMemberships(
      filter: OrganizationMembershipFilter
    ): [OrganizationMembership!]!
  }
`;

export default organizationMembershipsSchema;
