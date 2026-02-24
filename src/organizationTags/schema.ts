import { gql } from "graphql-tag";

// TODO come back and review

const organizationTagsSchema = gql`
  """
  A tag used to classify and organize workspaces within an organization. Tags can be applied to multiple workspaces and used for filtering.
  """
  type OrganizationTag {
    """The tag's unique identifier."""
    id: ID!
    """The tag name. Can include letters, numbers, colons, hyphens, and underscores (max 255 characters)."""
    name: String!
    """Timestamp when the tag was created."""
    createdAt: DateTime!
    """Number of workspaces this tag is applied to."""
    instanceCount: Int!
  }

  """
  Filter conditions for OrganizationTag queries. Supports logical combinators (_and, _or, _not) and field-level comparisons.
  """
  input OrganizationTagFilter {
    _and: [OrganizationTagFilter!]
    _or: [OrganizationTagFilter!]
    _not: OrganizationTagFilter

    id: StringComparisonExp
    name: StringComparisonExp
    createdAt: DateTimeComparisonExp
    instanceCount: IntComparisonExp
    organizationId: StringComparisonExp
  }

  extend type Query {
    """
    List all tags across the selected organizations.
    """
    organizationTags(
      includeOrgs: [String!]
      excludeOrgs: [String!]
      filter: OrganizationTagFilter
    ): [OrganizationTag!]!
  }
`;

export default organizationTagsSchema;
