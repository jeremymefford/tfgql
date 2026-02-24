---
title: Configuration Versions
description: Query Terraform configuration uploads and VCS metadata
---

# Configuration Versions

A **Configuration Version** represents a single upload of Terraform configuration to a workspace. For VCS-driven workspaces, each push creates a new configuration version with associated commit metadata via `IngressAttributes`.

## Available Queries

| Query | Description |
| ----- | ----------- |
| `configurationVersions(workspaceId: ID!, filter: ConfigurationVersionFilter)` | List configuration versions for a workspace |
| `configurationVersion(id: ID!)` | Fetch a single configuration version by ID |
| `workspacesWithConfigurationVersionsLargerThan(includeOrgs, excludeOrgs, bytes: Int!)` | Find workspaces with large configuration uploads |

## Example

Find VCS metadata for recent configuration uploads:

```graphql
query RecentConfigs($wsId: ID!) {
  configurationVersions(workspaceId: $wsId) {
    id
    status
    source
    speculative
    size
    changedFiles
    ingressAttributes {
      branch
      commitSha
      commitMessage
      senderUsername
      isPullRequest
      pullRequestNumber
    }
  }
}
```

Find workspaces with oversized configuration bundles:

```graphql
query LargeConfigs {
  workspacesWithConfigurationVersionsLargerThan(
    includeOrgs: ["my-org"]
    bytes: 10485760
  ) {
    name
    configurationVersions {
      id
      size
    }
  }
}
```

## Fields

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` | Configuration version identifier |
| `autoQueueRuns` | `Boolean!` | Whether runs are queued automatically |
| `error` | `String` | Error code if upload failed |
| `errorMessage` | `String` | Human-readable error description |
| `provisional` | `Boolean!` | Whether this is a provisional configuration |
| `source` | `String` | Upload source (e.g. `tfe-api`, `bitbucket`) |
| `speculative` | `Boolean!` | Whether this is for a speculative plan |
| `status` | `String!` | Upload status (`pending`, `uploaded`, `errored`, etc.) |
| `statusTimestamps` | `ConfigurationVersionStatusTimestamps` | Timestamps for status transitions |
| `changedFiles` | `[String!]!` | List of files changed in this version |
| `ingressAttributes` | `IngressAttributes` | VCS commit metadata (see below) |
| `size` | `Int` | Size in bytes of the configuration bundle |
| `downloadUrl` | `String` | URL to download the configuration archive |

### IngressAttributes

| Field | Type | Description |
| ----- | ---- | ----------- |
| `branch` | `String` | VCS branch name |
| `commitSha` | `String` | Full commit SHA |
| `commitMessage` | `String` | Commit message text |
| `commitUrl` | `String` | URL to the commit in the VCS provider |
| `isPullRequest` | `Boolean` | Whether triggered by a pull request |
| `pullRequestNumber` | `Int` | PR number, if applicable |
| `pullRequestTitle` | `String` | PR title |
| `senderUsername` | `String` | VCS username of the committer |

## Filter Fields

| Field | Comparison Type |
| ----- | --------------- |
| `id` | `StringComparisonExp` |
| `autoQueueRuns` | `BooleanComparisonExp` |
| `error` | `StringComparisonExp` |
| `errorMessage` | `StringComparisonExp` |
| `provisional` | `BooleanComparisonExp` |
| `source` | `StringComparisonExp` |
| `speculative` | `BooleanComparisonExp` |
| `status` | `StringComparisonExp` |
| `changedFiles` | `StringComparisonExp` |
| `statusTimestamps` | `ConfigurationVersionStatusTimestampsFilter` |

## Related Entities

- [Workspaces](../Concepts/concepts.md#entity-graph) — Parent workspace
- [Runs](../Concepts/concepts.md#entity-graph) — Runs created from this configuration version
