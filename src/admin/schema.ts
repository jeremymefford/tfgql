import { gql } from "graphql-tag";

const adminSchema = gql`
  """
  Represents a user managed through the Terraform Enterprise admin APIs.
  """
  type AdminUser implements UserAccount {
    """The user's unique identifier."""
    id: ID!
    """The user's login name."""
    username: String!
    """The user's email address."""
    email: String
    """URL to the user's Gravatar profile image."""
    avatarUrl: String
    """Whether this is a synthetic service account rather than a human user."""
    isServiceAccount: Boolean!
    """Whether the user has site administrator privileges."""
    isAdmin: Boolean!
    """Whether the user account is currently suspended."""
    isSuspended: Boolean!
    """Organizations this user belongs to."""
    organizations: [Organization!]!
    """Teams the user belongs to across organizations."""
    teams(
      includeOrgs: [String!]
      excludeOrgs: [String!]
      filter: TeamFilter
    ): [Team!]!
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
