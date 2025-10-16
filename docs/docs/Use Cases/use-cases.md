---
id: use-cases
title: Use Cases
sidebar_label: Use Cases
---

## Common Admin Workflows

This page walks through ten frequent Terraform Cloud/Enterprise (TFC/E) administration tasks and shows how to accomplish each using the TFGQL API.  When the built‑in GraphQL schema is sufficient, we provide example queries.  For more specialized needs, we highlight the custom queries you can add (and note where API support is missing).

Looking for aggregated Explorer data across organizations? See the dedicated [Explorer Views](./explorer.md) guide for details on the `explorer*` queries and their nested workspace relationships.

> **Multi-org selection:** Unless noted otherwise, workspace-centric queries accept optional `includeOrgs` and `excludeOrgs` arguments. Omitting `includeOrgs` (or passing an empty array) uses every organization you can access; any organization listed in both arrays is excluded.

---

## 1. View all workspaces with open runs

TFC does not currently surface a global filter for run status.  Use the custom `workspacesWithOpenRuns` query to find all workspaces with at least one run matching a given status filter (e.g. planning/applying):

```graphql
query WorkspacesWithOpenRuns {
  workspacesWithOpenRuns {
    id
    name
    runs(filter:  {
       status:  {
          _nin: ["applied", "discarded", "errored", "canceled", "force_canceled", "planned_and_finished"]
       }
    }) {
      status
      id
    }
  }
}
```

The GraphQL layer pages through all workspace runs and looks for any that are not in a terminal state. To see which runs match, you can add the shown filter to that will narrow it down to just the open runs.  If no filter is presented, all runs for the resultant workspaces will be returned.
:::warning
Due to the heavy rate limiting imposed by HCP TF and TFE, this run can take a very long time to complete and there's a chance that the workspace is in the response but no runs if the run completed before the query returned.
:::

---

## 2. Identify resource‑heavy states

Use the built‑in `resourceCount` field on `Workspace` to find workspaces whose current state contains more than *N* resources:

```graphql
query ResourceHeavyWorkspaces {
  workspaces(
    filter: { resourceCount: { _gt: 100 } }
  ) {
    id
    name
    resourceCount
  }
}
```

---

## 3. Bulk export secrets or variables

You can page through all workspaces and then retrieve variables per workspace.  For example, to dump every variable across every workspace:

```graphql
query ExportAllWorkspaceVariables {
  workspaces {
    id
    name
    variables {
      key
      value
      sensitive
      category
    }
  }
}
```

Resolvers automatically page through large result sets (`variables` is fetched lazily under the hood).

---

## 4. Map workspace → policy sets

The GraphQL schema already supports bi‑directional mapping between policy sets and workspaces.  To see which workspaces each policy set applies to:

```graphql
query PolicySetWorkspaces {
  policySets(filter:  { _or: [ 
     { workspaceCount:  { _gt: 0 }},
     { projectCount: { _gt: 0}}
  ]}) {
    id
    name
    workspaces {
      id
      name
    }
    projects {
      id
      name
    }
  }
}
```

---

## 5. Audit users across teams

Use nested relationships to audit every team’s membership:

:::info
Due to privacy settings in HCP TF / TFE, you cannot get user emails outside of your own
:::

```graphql
query OrgTeamsUsers {
  organization {
    teams {
      id
      name
      users {
        id
        username
        email
      }
    }
  }
}
```

:::tip
If you're querying TFE and have an admin token, you can use the following query to get email addresses
:::
```graphql
query OrgTeamsUsers {
  organizations {
    teams {
      id
      name
      usersFromAdmin {
        id
        username
        email
      }
    }
  }
}
```

This query can be especially useful for auditing requirements in regulated industries.

## 6. Detect drift

:::info
This currently only works for HCP Terraform
:::

```graphql
query WorkspaceDrift {
  explorerWorkspaces(filters: [ {
     field: drifted, operator: is, value: "false"
  }]) {
    drifted
    workspace {
      id
      name
    }
  }
}
```

You can see how the nested workspace is retrieved.  This allows for querying of additional fields / relationships that aren't naturally available via explorer.

## 7. Generate Terraform "run trigger graph”

Fetch the full workspace dependency graph in a single call using the `runTriggerGraph` query:

```graphql
query RunTriggerGraph {
  runTriggerGraph {
    id
    workspaceName
    sourceableName
    createdAt
  }
}
```

The `runTriggerGraph` query returns a list of run-trigger edges (workspace dependencies) across all workspaces in the selected organizations.

---

## Top 25 GraphQL Queries for Terraform Cloud & Enterprise

Below is a list of 25 high-value GraphQL query use cases for Terraform Cloud (TFC) and Terraform Enterprise (TFE). Each section includes the persona, their goal, and an example GraphQL query (with variables). Use cases that require additional API endpoints or schema extensions are marked accordingly.

---

## 1. Identify All Active Runs for Concurrency Management

> **Persona:** Platform Engineer / SRE  
> **Goal:** Get a unified view of all active runs (planning, applying, etc.) across every workspace to troubleshoot pipeline bottlenecks.

> **Query:**
```graphql
query ActiveRuns(
  $orgs: [String!]!
  $runFilter: RunFilter!
) {
  workspacesWithOpenRuns(
    includeOrgs: $orgs
    runFilter: $runFilter
  ) {
    id
    name
    runs(filter: $runFilter) {
      id
      status
      createdAt
      triggerReason
    }
  }
}
```

> **Variables:**
```json
{
  "orgs": ["my-org"],
  "runFilter": { "status": { "_in": ["pending", "planning", "applying"] } }
}
```

---

## 2. Find Stale Workspaces with No Recent Runs

> **Persona:** Platform Admin  
> **Goal:** List workspaces whose last apply or run occurred before a given threshold (e.g. 90 days ago).

> **Query:**
```graphql
query StaleWorkspaces(
  $orgs: [String!]!
  $threshold: DateTime!
) {
  workspaces(
    includeOrgs: $orgs
    filter: { latestChangeAt: { _lt: $threshold } }
  ) {
    id
    name
    latestChangeAt
  }
}
```

> **Variables:**
```json
{
  "orgs": ["my-org"],
  "threshold": "2021-01-01T00:00:00Z"
}
```

---

## 3. Detect Workspaces with Drift

> **Persona:** SRE / Platform Engineer  
> **Goal:** Find all workspaces where infrastructure drift has been detected (resources changed outside Terraform).

> **Query (top-level):**
```graphql
query DriftedResults($workspaceId: ID!) {
  assessmentResults(
    workspaceId: $workspaceId
    filter: { drifted: { _eq: true } }
  ) {
    id
    drifted
    createdAt
  }
}
```

> **Note:** To aggregate this across workspaces or to count drifted resources per workspace, we need a nested `assessmentResults` field on `Workspace` and/or an aggregated drift count. Please provide the corresponding API endpoint so we can extend the schema.

---

## 4. List Workspaces Failing Policy Checks

> **Persona:** Compliance Auditor  
> **Goal:** See which workspaces currently have failing Sentinel/OPA policy checks.

> **Query:**
```graphql
# TODO: implement nested or top-level `policyEvaluations` query to list workspaces with failures.
```

> **Note:** The current schema exposes `policyEvaluations(taskStageId)`, but does not directly link it to `Run` or `Workspace` for filtering. Please provide the API endpoint for policy evaluations per run or workspace stage.

---

## 5. Audit Overridden Policy Violations

> **Persona:** Security/Compliance Officer  
> **Goal:** Identify runs where a policy was violated but overridden by an admin.

> **Query:**
```graphql
# TODO: implement `runs` or `policyChecks` override detection query.
```

> **Note:** Requires `overrideReason` and `approver` metadata from the policy checks API. Please provide the REST endpoint for fetching overridden policy check details.

---

## 6. Identify Workspaces Missing Mandatory Policy Sets

> **Persona:** Compliance Auditor  
> **Goal:** Ensure all workspaces have the required policy sets applied.

> **Query:**
```graphql
# TODO: list all workspaces and attached `policySets`, then filter missing mandatory set.
```

> **Note:** Please provide the API endpoint for fetching workspace–policy set attachments (or confirm if `workspace.policySets` is available).

---

## 7. Module Usage and Reuse Across Organization

> **Persona:** Platform Engineer / Module Author  
> **Goal:** Get insight into how internal Terraform modules are used across workspaces.

> **Query:**
```graphql
# TODO: implement `registryModules` or similar query for module usage counts.
```

> **Note:** Please provide the API endpoint for fetching module usage by workspace.

---

## 8. Track Provider Versions in Use (Provider Version Drift)

> **Persona:** Platform Engineer / Security  
> **Goal:** See all Terraform providers (and versions) in use to detect outdated or unapproved versions.

> **Query:**
```graphql
# TODO: implement `providers` view query returning provider name, version, and workspace counts.
```

> **Note:** Please provide the API endpoint for listing provider versions in use across workspaces.

---

## 9. Terraform Version Consistency Audit

> **Persona:** Platform Engineer  
> **Goal:** Ensure all teams use approved Terraform CLI versions.

> **Query:**
```graphql
query TerraformVersions($orgs: [String!]!) {
  workspaces(includeOrgs: $orgs) {
    name
    terraformVersion
  }
}
```

---

## 10. Find Largest Workspaces by Resource Count

> **Persona:** Platform Engineer  
> **Goal:** Identify workspaces managing the most resources for performance tuning or splitting.

> **Query:**
```graphql
query LargestWorkspaces($orgs: [String!]!, $min: Int!) {
  workspaces(
    includeOrgs: $orgs
    filter: { resourceCount: { _gt: $min } }
  ) {
    id
    name
    resourceCount
  }
}
```

---

## 11. Aggregate Recent Run Failures

> **Persona:** SRE / DevOps Engineer  
> **Goal:** List all failed runs (errored or canceled) in the last X days across the organization.

> **Query:**
```graphql
query RecentFailures($orgs: [String!]!, $since: DateTime!) {
  workspaces(includeOrgs: $orgs) {
    name
    runs(filter: { status: { _in: ["errored", "canceled"] }, createdAt: { _gt: $since } }) {
      id
      status
      message
      createdAt
    }
  }
}
```

---

## 12. Spot Long-Pending or Stuck Runs

> **Persona:** SRE  
> **Goal:** Find runs that have been waiting for manual input or stuck in queue longer than expected.

> **Query:**
```graphql
query StuckRuns($orgs: [String!]!, $statuses: [String!]!) {
  workspacesWithOpenRuns(includeOrgs: $orgs, runFilter: { status: { _in: $statuses } }) {
    id
    name
    runs(filter: { status: { _in: $statuses } }) {
      id
      status
      createdAt
    }
  }
}
```

> **Variables:**
```json
{
  "orgs": ["my-org"],
  "statuses": ["pending", "plan_queued", "policy_checking"]
}
```

---

## 13. Audit Auto-Apply vs. Manual Approval Settings

> **Persona:** DevOps / Compliance Engineer  
> **Goal:** Ensure critical environments require manual applies and lower environments use auto-apply for agility.

> **Query:**
```graphql
query AutoApplySettings($orgs: [String!]!) {
  workspaces(includeOrgs: $orgs) {
    name
    autoApply
    environment
  }
}
```

---

## 14. Workspace Team Access Matrix

> **Persona:** Org Admin  
> **Goal:** Review which teams have access to which workspaces and at what level.

> **Query:**
```graphql
# TODO: implement `teamAccess` query for workspace-team relationships.
```

> **Note:** Please provide the API endpoint for workspace–team access listings.

---

## 15. User Membership and Activity Audit

> **Persona:** Org Admin / Auditor  
> **Goal:** List all users in the org along with the teams they belong to. (Last-activity timestamps are not exposed by the API.)

> **Query:**
```graphql
query OrgUsersTeams(
  $org: String!
  $includeOrgs: [String!]
  $excludeOrgs: [String!]
) {
  organization(name: $org) {
    users {
      id
      username
      email
      teams(includeOrgs: $includeOrgs, excludeOrgs: $excludeOrgs) {
        id
        name
        organization { name }
      }
    }
  }
}
```

> **Variables:**
```json
{
  "org": "my-org",
  "includeOrgs": [],
  "excludeOrgs": []
}
```

Passing empty arrays uses the default multi-org expansion, mirroring how the resolver fans out across every organization the caller can access before applying exclusions.

---

## 16. Identify Cost Estimation Outliers

> **Persona:** FinOps / Cloud Cost Manager  
> **Goal:** Find runs with cost estimates above a threshold or summarize cost estimates per workspace.

> **Query:**
```graphql
# TODO: implement `costEstimates` fields on `Run` to filter by estimated cost.
```

> **Note:** Please provide the cost estimation API endpoint.

---

## 17. Map Workspace Run Triggers (Dependency Graph)

> **Persona:** Platform Engineer  
> **Goal:** Map run triggers between workspaces to understand cross-workspace dependencies.

> **Query:**
```graphql
query WorkspaceRunTriggers($workspaceId: ID!, $direction: String!) {
  runTriggers(workspaceId: $workspaceId, filter: { type: { _eq: $direction } }) {
    id
    workspaceName
    sourceableName
    createdAt
  }
}
```

---

## 18. Verify Variable Set Coverage

> **Persona:** Platform Engineer  
> **Goal:** Ensure global variable sets (e.g. credentials) are properly attached to all relevant workspaces.

> **Query:**
```graphql
query VariableSetCoverage(
  $includeOrgs: [String!]
  $excludeOrgs: [String!]
  $nameLike: String
) {
  variableSets(
    includeOrgs: $includeOrgs
    excludeOrgs: $excludeOrgs
    filter: { name: { _ilike: $nameLike } }
  ) {
    id
    name
    organization { name }
    workspaces {
      id
      name
      projectName
    }
    workspaceExclusions {
      id
      name
    }
  }
}
```

> **Variables:**
```json
{
  "includeOrgs": [],
  "excludeOrgs": [],
  "nameLike": "prod%"
}
```

Use the returned `workspaces` list to verify coverage and the `workspaceExclusions` list to confirm intentional opt-outs.

---

## 19. Search for a Specific Resource Across States

> **Persona:** Cloud Engineer  
> **Goal:** Quickly find if any workspace manages a given resource address or resource ID.

> **Query:**
```graphql
# TODO: implement state resource search / index query across state versions.
```

> **Note:** Requires an API to search state JSON for resource addresses across all workspaces.

---

## 20. Ensure Sensitive Variables Are Properly Marked

> **Persona:** Security Engineer  
> **Goal:** Audit workspace variables to ensure secrets are not exposed in plaintext.

> **Query:**
```graphql
query PlaintextSecrets($orgs: [String!]!) {
  workspaces(includeOrgs: $orgs) {
    name
    variables(filter: { sensitive: { _eq: false } }) {
      key
      category
      value
    }
  }
}
```

---

## 21. Multi-Org Terraform Usage Summary

> **Persona:** Enterprise Platform Owner  
> **Goal:** Aggregate workspace counts, resource counts, etc. across multiple organizations.

> **Query:**
```graphql
# TODO: extend top-level `organizations` query with nested stats (requires multi-org support).
```

---

## 22. Fetch Key Outputs from Multiple Workspaces

> **Persona:** SRE / Integrator  
> **Goal:** Retrieve specific output values (e.g. `service_endpoint`) from a set of workspaces.

> **Query:**
```graphql
# TODO: use `stateVersionOutputs` across multiple workspaces with filtering.
```

---

## 23. Find Unassigned or Ungrouped Workspaces

> **Persona:** Platform Admin  
> **Goal:** Identify workspaces missing project assignments or required tags.

> **Query:**
```graphql
query UngroupedWorkspaces($orgs: [String!]!) {
  workspaces(includeOrgs: $orgs, filter: { projectName: { _eq: null } }) {
    id
    name
    tagNames
  }
}
```

---

## 24. Audit Workspace Execution Modes (Agent vs. Cloud)

> **Persona:** Platform Engineer  
> **Goal:** Review which workspaces use Terraform Cloud agents vs hosted execution.

> **Query:**
```graphql
query ExecutionModes($orgs: [String!]!) {
  workspaces(includeOrgs: $orgs) {
    id
    name
    executionMode
    agentPool
  }
}
```

---

## 25. Highlight Runs with Large Plan Changes

> **Persona:** SRE / Change Manager  
> **Goal:** Identify runs that propose a very large number of resource adds/changes/deletes.

> **Query:**
```graphql
# TODO: include plan summary fields (e.g. `resourceAddCount`, `resourceChangeCount`, `resourceDestroyCount`).
```

---

For any use case marked **TODO** above, please share the corresponding Terraform Cloud/Enterprise REST API endpoint so we can implement them in the GraphQL schema and resolvers.
