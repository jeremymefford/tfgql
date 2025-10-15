import { gql } from "graphql-tag";

export const USER_ACCOUNT_FIELDS_FRAGMENT = gql`
  fragment UserAccountFields on UserAccount {
    id
    username
    email
    avatarUrl
    isServiceAccount
  }
`;
