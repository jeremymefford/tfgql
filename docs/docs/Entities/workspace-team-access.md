---
title: Workspace Team Access
description: Query team permission grants at the workspace level
---

# Workspace Team Access

**Workspace Team Access** defines the granular permissions a team has on a specific workspace. This is the workspace-level counterpart to [Project Team Access](project-team-access).

## Available Queries

| Query | Description |
| ----- | ----------- |
| `workspaceTeamAccessByWorkspace(workspaceId: ID!, filter)` | List team access grants for a workspace |
| `workspaceTeamAccessByTeam(teamId: ID!, filter)` | List workspace access grants for a team |
| `workspaceTeamAccessById(id: ID!)` | Fetch a single access grant by ID |

## Example

Audit who has access to a workspace:

```graphql
query WorkspacePermissions($wsId: ID!) {
  workspaceTeamAccessByWorkspace(workspaceId: $wsId) {
    id
    access
    team {
      name
    }
    runs
    variables
    stateVersions
    workspaceLocking
  }
}
```

Find all workspace grants for a team:

```graphql
query TeamWorkspaceAccess($teamId: ID!) {
  workspaceTeamAccessByTeam(teamId: $teamId) {
    access
    workspace {
      name
      organization {
        name
      }
    }
    runs
    variables
    stateVersions
  }
}
```

## Fields

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` | Access grant identifier |
| `access` | `String!` | Access level (e.g. `admin`, `plan`, `write`, `read`, `custom`) |
| `runs` | `String!` | Run permission level |
| `variables` | `String!` | Variable permission level |
| `stateVersions` | `String!` | State version permission level |
| `sentinelMocks` | `String!` | Sentinel mock permission level |
| `workspaceLocking` | `Boolean!` | Whether the team can lock/unlock the workspace |
| `runTasks` | `Boolean!` | Whether the team can manage run tasks |
| `team` | `Team!` | The team with access |
| `workspace` | `Workspace!` | The workspace being accessed |

## Filter Fields

| Field | Comparison Type |
| ----- | --------------- |
| `id` | `StringComparisonExp` |
| `access` | `StringComparisonExp` |
| `runs` | `StringComparisonExp` |
| `variables` | `StringComparisonExp` |
| `stateVersions` | `StringComparisonExp` |
| `sentinelMocks` | `StringComparisonExp` |
| `workspaceLocking` | `BooleanComparisonExp` |
| `runTasks` | `BooleanComparisonExp` |
| `workspaceId` | `StringComparisonExp` |
| `teamId` | `StringComparisonExp` |

## Related Entities

- [Workspaces](../Concepts/concepts.md#entity-graph) — The workspace being accessed
- [Teams](../Concepts/concepts.md#entity-graph) — The team with the permission grant
- [Project Team Access](project-team-access) — Project-level equivalent
