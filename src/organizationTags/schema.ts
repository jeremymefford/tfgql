import { gql } from "graphql-tag";

// TODO come back and review

const organizationTagsSchema = gql`
  """
  A tag used to classify and organize workspaces within an organization. Tags can be applied to multiple workspaces and used for filtering.
  """
  type OrganizationTag {
    id: ID!
    name: String!
    createdAt: DateTime!
    instanceCount: Int!
  }

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
