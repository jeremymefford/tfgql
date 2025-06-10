import { gql } from 'graphql-tag';

const organizationTagsSchema = gql`
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
    organizationTags(orgName: String!, filter: OrganizationTagFilter): [OrganizationTag!]!
    organizationTag(id: ID!): OrganizationTag
  }
`;

export default organizationTagsSchema;