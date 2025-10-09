import { gql } from "graphql-tag";

const teamTokensSchema = gql`
  type TeamToken {
    id: ID!
    teamId: ID!
    createdAt: DateTime!
    lastUsedAt: DateTime
    description: String
    token: String
    expiredAt: DateTime
    createdById: ID!
  }

  input TeamTokenFilter {
    _and: [TeamTokenFilter!]
    _or: [TeamTokenFilter!]
    _not: TeamTokenFilter

    id: StringComparisonExp
    teamId: StringComparisonExp
    createdAt: DateTimeComparisonExp
    lastUsedAt: DateTimeComparisonExp
    description: StringComparisonExp
    token: StringComparisonExp
    expiredAt: DateTimeComparisonExp
    createdById: StringComparisonExp
  }

  extend type Query {
    teamTokens(teamId: ID!, filter: TeamTokenFilter): [TeamToken!]!
    teamToken(id: ID!): TeamToken
  }
`;

export default teamTokensSchema;
