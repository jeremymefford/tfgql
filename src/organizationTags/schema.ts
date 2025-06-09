import { gql } from 'graphql-tag';

const organizationTagsSchema = gql`
  type OrganizationTag {
    id: ID!
    # TODO: add OrganizationTag fields based on Terraform Cloud API
  }

  input OrganizationTagFilter {
    _and: [OrganizationTagFilter!]
    _or: [OrganizationTagFilter!]
    _not: OrganizationTagFilter

    # TODO: add filter fields based on Terraform Cloud API
  }

  extend type Query {
    organizationTags(orgName: String!, filter: OrganizationTagFilter): [OrganizationTag!]!
    organizationTag(id: ID!): OrganizationTag
  }
`;

export default organizationTagsSchema;