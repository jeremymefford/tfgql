---
id: explorer
title: Explorer Views
sidebar_label: Explorer Views
---

The Explorer endpoints surface an aggregated view of Terraform Cloud / Enterprise data that mirrors the REST [`/organizations/:name/explorer`](https://developer.hashicorp.com/terraform/cloud-docs/api-docs/explorer) API. The GraphQL schema exposes each Explorer view as a dedicated query with optional multi-org targeting, field selection, sorting, and filtering.

## Available Views

| Query | Description |
| --- | --- |
| `explorerWorkspaces` | Row-per-workspace view, including module/provider counts, drift status, current run metadata, and workspace tags. |
| `explorerTerraformVersions` | Aggregated Terraform version usage across an organization, including a comma-delimited list of workspace names. |
| `explorerProviders` | Distinct providers in use with counts of referencing workspaces. |
| `explorerModules` | Distinct modules in use with counts of referencing workspaces. |

Each query accepts the following arguments:

- `includeOrgs` / `excludeOrgs` — optional organization scoping helpers (see [Multi-Organization Selection](../Concepts/concepts.md#multi-organization-selection)).
- `sort` — optional sort instructions in REST Explorer syntax (`field` or `-field`).
- `filters` — zero or more filter instructions mirroring the REST Explorer filter operators.

## Nested Entities

Explorer rows now expose richer relationships in addition to the raw CSV/string attributes returned by the REST API.

- `ExplorerWorkspaceRow.workspace` resolves the underlying `Workspace`.
- `ExplorerWorkspaceRow.project` resolves the associated `Project` by name.
- `ExplorerWorkspaceRow.currentRun` resolves the current `Run` when present.
- `ExplorerWorkspaceRow.organization` resolves the owning `Organization`.
- `ExplorerTerraformVersionRow.workspaceEntities`, `ExplorerProviderRow.workspaceEntities`, and `ExplorerModuleRow.workspaceEntities` expose fully-hydrated `Workspace` objects that match the comma-delimited workspace names. These resolvers accept an optional `WorkspaceFilter` argument so you can refine the returned workspaces without re-issuing REST calls.

All of the nested resolvers leverage the per-request cache, so repeated lookups for the same workspace, project, or run are automatically deduplicated.

## Example: Workspaces View With Nested Entities

```graphql
query ExplorerWorkspaceSnapshot($includeOrgs: [String!]) {
  explorerWorkspaces(
    includeOrgs: $includeOrgs
    sort: [{ field: workspace_updated_at, ascending: false }]
    filters: [
      { field: drifted, operator: is, value: "true" }
      { field: workspace_terraform_version, operator: gteq, value: "1.5.0" }
    ]
  ) {
    workspaceName
    workspaceUpdatedAt
    currentRunStatus
    providerCount
    providers
    workspace {
      id
      name
      terraformVersion
    }
    project {
      id
      name
    }
    currentRun {
      id
      status
      createdAt
    }
  }
}
```

## Example: Terraform Versions View With Workspace Filtering

```graphql
query ExplorerTerraformVersions($includeOrgs: [String!]) {
  explorerTerraformVersions(includeOrgs: $includeOrgs) {
    version
    workspaceCount
    workspaces
    workspaceEntities(filter: { name: { _ilike: "%production%" } }) {
      id
      name
      terraformVersion
    }
  }
}
```

The helper resolvers ensure each workspace is fetched at most once per request, even when a workspace appears in multiple Explorer rows.
