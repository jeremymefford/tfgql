---
title: Project Team Access
description: Query team permission grants at the project level
---

# Project Team Access

**Project Team Access** defines the permissions a team has on a project and its child workspaces. This controls what team members can do with settings, runs, variables, state, and more at the project scope.

## Available Queries

| Query | Description |
| ----- | ----------- |
| `projectTeamAccessByProject(projectId: ID!, filter)` | List team access grants for a project |
| `projectTeamAccessByTeam(teamId: ID!, filter)` | List project access grants for a team |
| `projectTeamAccessById(id: ID!)` | Fetch a single access grant by ID |

## Example

Audit team permissions across a project:

```graphql
query ProjectPermissions($projectId: ID!) {
  projectTeamAccessByProject(projectId: $projectId) {
    id
    access
    team {
      name
    }
    project {
      name
    }
    projectAccess {
      settings
      teams
    }
    workspaceAccess {
      runs
      variables
      stateVersions
      create
      delete
      locking
    }
  }
}
```

## Fields

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` | Access grant identifier |
| `access` | `String!` | Access level (e.g. `admin`, `maintain`, `write`, `read`, `custom`) |
| `projectAccess` | `ProjectAccess!` | Project-level permission details |
| `workspaceAccess` | `WorkspaceAccess!` | Inherited workspace-level permissions |
| `project` | `Project!` | The project being accessed |
| `team` | `Team!` | The team with access |

### ProjectAccess

| Field | Type | Description |
| ----- | ---- | ----------- |
| `settings` | `String!` | Project settings access level |
| `teams` | `String!` | Team management access level |

### WorkspaceAccess

| Field | Type | Description |
| ----- | ---- | ----------- |
| `create` | `Boolean!` | Can create workspaces |
| `move` | `Boolean!` | Can move workspaces |
| `locking` | `Boolean!` | Can lock/unlock workspaces |
| `delete` | `Boolean!` | Can delete workspaces |
| `runs` | `String!` | Run access level |
| `variables` | `String!` | Variable access level |
| `stateVersions` | `String!` | State version access level |
| `sentinelMocks` | `String!` | Sentinel mock access level |
| `runTasks` | `Boolean!` | Can manage run tasks |

## Filter Fields

| Field | Comparison Type |
| ----- | --------------- |
| `id` | `StringComparisonExp` |
| `access` | `StringComparisonExp` |
| `projectId` | `StringComparisonExp` |
| `teamId` | `StringComparisonExp` |

## Related Entities

- [Projects](../Concepts/concepts.md#entity-graph) — The project being accessed
- [Teams](../Concepts/concepts.md#entity-graph) — The team with the permission grant
- [Workspace Team Access](workspace-team-access) — Workspace-level equivalent
