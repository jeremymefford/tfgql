import { gql } from "graphql-tag";

const adminSchema = gql`
  """
  Represents a user managed through the Terraform Enterprise admin APIs.
  """
  type AdminUser implements UserAccount {
    id: ID!
    username: String!
    email: String
    avatarUrl: String
    isServiceAccount: Boolean!
    isAdmin: Boolean!
    isSuspended: Boolean!
    organizations: [Organization!]!
    teams(includeOrgs: [String!], excludeOrgs: [String!], filter: TeamFilter): [Team!]!
  }

  extend type Query {
    """
    Lists all Terraform Enterprise users available to site administrators.
    """
    adminUsers(
      filter: UserFilter
      search: String
      admin: Boolean
      suspended: Boolean
    ): [AdminUser!]! @tfeOnly
  }
`;

export default adminSchema;
