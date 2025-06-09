import { gql } from 'graphql-tag';

const teamTokensSchema = gql`
  type TeamToken {
    id: ID!
    # TODO: add TeamToken fields based on Terraform Cloud API
  }

  input TeamTokenFilter {
    _and: [TeamTokenFilter!]
    _or: [TeamTokenFilter!]
    _not: TeamTokenFilter

    # TODO: add filter fields based on Terraform Cloud API
  }

  extend type Query {
    teamTokens(teamId: ID!, filter: TeamTokenFilter): [TeamToken!]!
    teamToken(id: ID!): TeamToken
  }
`;

export default teamTokensSchema;