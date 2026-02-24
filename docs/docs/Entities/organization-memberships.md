---
title: Organization Memberships
description: Query user membership records across organizations
---

# Organization Memberships

An **Organization Membership** represents a user's membership in an organization, including their status and team assignments.

## Available Queries

| Query | Description |
| ----- | ----------- |
| `organizationMemberships(includeOrgs, excludeOrgs, filter)` | List memberships across organizations |
| `organizationMembership(id: ID!)` | Fetch a single membership by ID |
| `myOrganizationMemberships(filter)` | List the authenticated user's own memberships |

## Example

List all members across your organizations:

```graphql
query AllMembers {
  organizationMemberships(includeOrgs: ["my-org"]) {
    id
    status
    organizationId
    userId
    teamIds
  }
}
```

Check your own memberships:

```graphql
query MyMemberships {
  myOrganizationMemberships {
    id
    status
    organizationId
    teamIds
  }
}
```

## Fields

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` | Membership identifier |
| `status` | `String!` | Membership status (e.g. `active`, `invited`) |
| `organizationId` | `ID!` | ID of the organization |
| `userId` | `ID!` | ID of the member user |
| `teamIds` | `[ID!]!` | IDs of teams the member belongs to |

## Filter Fields

| Field | Comparison Type |
| ----- | --------------- |
| `id` | `StringComparisonExp` |
| `status` | `StringComparisonExp` |
| `organizationId` | `StringComparisonExp` |
| `userId` | `StringComparisonExp` |
| `teamIds` | `StringComparisonExp` |

## Related Entities

- [Organizations](../Concepts/concepts.md#entity-graph) — The organization this membership belongs to
- [Users](../Concepts/concepts.md#entity-graph) — The user who holds this membership
- [Teams](../Concepts/concepts.md#entity-graph) — Teams the member is assigned to
