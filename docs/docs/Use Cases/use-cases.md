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

TFC does not currently surface a global filter for run status.  Use the custom `workspacesWithOpenRuns` query to find all workspaces with the currentRun not in a terminal state.

```graphql
query WorkspacesWithOpenRuns {
  workspacesWithOpenRuns {
    id
    name
    currentRun {
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

## 2. Find Stale Workspaces with No Recent Runs

> **Persona:** Platform Admin  
> **Goal:** List workspaces whose last apply or run occurred before a given threshold (e.g. 90 days ago).

> **Query:**
```graphql
query StaleWorkspaces {
  workspaces(
    filter: { latestChangeAt: { _lt: "2025-01-01T00:00:00Z" } }
  ) {
    id
    name
    latestChangeAt
  }
}
```

---

## 4. List Workspaces Failing Policy Checks

> **Persona:** Compliance Auditor  
> **Goal:** See which workspaces currently have failing Sentinel/OPA policy checks.

> **Query:**
```graphql
query {
  workspacesWithFailedPolicyChecks {
    id
    name
    currentRun {
      status
      policyChecks {
        status
      }
      policyEvaluations {
        status
      }
    }
  }
}
```

---

## 5. Audit Overridden Policy Violations

> **Persona:** Security/Compliance Officer  
> **Goal:** Identify runs where a policy was violated but overridden by an admin.
:::warning
Due to how rate limiting works for `runs` related APIs, this is a very slow query.  Optimize it as much as you can by providing a run filter, like the example, which shows "year-to-date" for 2025
:::
> **Query:**
```graphql
query {
  runsWithOverriddenPolicy(filter:  {
     createdAt:  {
        _gt: "2025-01-01"
     }
  }) {
    id
    policyEvaluations {
      id
      status
    }
    policyChecks {
      id
      statusTimestamps {
        overriddenAt
      }
    }
  }
}
```

:::tip
Policy checks are for Sentinel policy evaluations running in "legacy" mode.  Policy evaluations are for OPA and Sentinel policies running in "agent" mode.  Both can be present on a run.
:::

---

## 6. Identify Workspaces Missing Mandatory Policy Sets

> **Persona:** Compliance Auditor  
> **Goal:** Ensure all workspaces have the required policy sets applied.

> **Query:**
```graphql
query {
  workspaces {
    id
    name
    appliedPolicySets {
      id
      name
    }
  }
}```

:::info
Due to the nature of dynamically resolving `appliedPolicySets`, you cannot filter them out, so this will return all workspaces, but those without policySets applied will have an empty array.  You can easily filter those out with `jq`
:::

---

## 7. Module Usage and Reuse Across Organization

> **Persona:** Platform Engineer / Module Author  
> **Goal:** Get insight into how internal Terraform modules are used across workspaces.

> **Query:**
```graphql
query {
  explorerModules {
    name
    source
    version
    workspaceEntities {
      id      
      name
    }
  } 
}```

:::warning
This only works for HCP Terraform at this point in time.  It requires explorer data, which is not available in TFE
:::

---

## 8. Track Provider Versions in Use (Provider Version Drift)

> **Persona:** Platform Engineer / Security  
> **Goal:** See all Terraform providers (and versions) in use to detect outdated or unapproved versions.

> **Query:**
```graphql
query {
  explorerProviders {
    name
    source
    version
    workspaceEntities {
      id      
      name
    }
  } 
}```

:::warning
This only works for HCP Terraform at this point in time.  It requires explorer data, which is not available in TFE
:::

---

## 9. Terraform Version Consistency Audit

> **Persona:** Platform Engineer  
> **Goal:** Ensure all teams use approved Terraform CLI versions.

> **Query:**
```graphql
query TerraformVersions {
  workspaces {
    name
    terraformVersion
  }
}
```

---

## 10. Resource Heavy Workspaces

> **Persona:** Platform Engineer  
> **Goal:** Identify workspaces managing the most resources for performance tuning or splitting.

> **Query:**
```graphql
query {
  workspaces(
    filter: { resourceCount: { _gt: 80 } }
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
query {
  workspacesWithOpenCurrentRun {
    name
    currentRun {
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
> **Goal:** Find runs in a non-terminal state and see the createdAt time to see if the run appears stuck

> **Query:**
```graphql
query PotentialStuckRuns($terminalStatuses: [String!]!) {
  runs(filter: { status: { _nin: $terminalStatuses }}) {
    id
    status
    createdAt
  }
}
```

> **Variables:**
```json
{
  "terminalStatuses": [
    "planned_and_finished", 
    "planned_and_saved",
    "applied",
    "discarded",
    "errored",
    "canceled",
    "force_canceled"]
}
```

---

## 13. Audit Auto-Apply vs. Manual Approval Settings

> **Persona:** DevOps / Compliance Engineer  
> **Goal:** Ensure critical environments require manual applies

> **Query:**
```graphql
query AutoApplySettings {
  workspaces {
    name
    autoApply
  }
}
```

---

## 14. Team Access Audit

> **Persona:** Org Admin  
> **Goal:** Review all team access across all orgs

> **Query:**
```graphql
query TeamAccessAudit {
 teams {
  id
  name
  organization {
    id
  }
  permissions {
    canUpdateMembership
    canDestroy
    canUpdateOrganizationAccess
    canUpdateApiToken
    canUpdateVisibility
    canUpdateName
    canUpdateSsoTeamId
    canUpdateMemberTokenManagement
    canViewApiToken
  }
  organizationAccess {
    managePolicies
    manageWorkspaces
    manageVcsSettings
    managePolicyOverrides
    manageModules
    manageProviders
    manageRunTasks
    manageProjects
    manageMembership
    manageTeams
    manageOrganizationAccess
    accessSecretTeams
    readProjects
    readWorkspaces
    manageAgentPools
  }
  projectAccess {
    id
    access
    projectAccess {
      settings
      teams
    }
    workspaceAccess {
      create
      move
      locking
      delete
      runs
      variables
      stateVersions
      sentinelMocks
      runTasks
    }
    project {
      id
      workspaces {
        id
        name
      }
    }
  }
  workspaceAccess {
    id
    access
    runs
    variables
    stateVersions
    sentinelMocks
    workspaceLocking
    runTasks
    workspace {
      id
    }
  }
 }
}
```

:::tip
By projecting the workspaces from the project, you get a point-in-time view of the RBAC model.  This can be nice when auditors want to know everything as it stood on a certain day.  You can run this query daily and store off the results and then go back and audit it later.
:::

---

## 18. Verify Variable Set Coverage

> **Persona:** Platform Engineer  
> **Goal:** Ensure variable sets are properly attached to all relevant workspaces / projects

> **Query:**
```graphql
query VariableSetAudit {
  variableSets {
    id
    name
    priority
    projects {
      id
      name
      workspaces {
        id
        name
      }
    }
    workspaces {
      id
      name
    }
  }
}
```

---

## 20. Ensure Sensitive Variables Are Properly Marked

> **Persona:** Security Engineer  
> **Goal:** Audit workspace variables and varsets to ensure secrets are not exposed in plaintext.

> **Query:**
```graphql
query PlaintextSecrets {
  workspaces {
    name
    variables(filter: { sensitive: { _eq: false } }) {
      key
      category
      value
    }
  }

  variableSets {
    vars(filter:  {
       sensitive:  {
          _eq: false
       }
    }) {
      key
      value
      sensitive
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
query ResourceCounts {
  organizations {
    name
    workspaces(filter:  {
       resourceCount:  {
          _gt: 0
       }
    }) {
      resourceCount
    }
  }
}
```

:::tip
If you want to get fancy with `jq` you could use this query to aggregate the output of TFGQL
```bash
jq '.data.organizations[] | {
  name: .name,
  workspace_count: (.workspaces | length),
  total_resources: ([.workspaces[].resourceCount] | add)
}'
```
This would give you output like this
```json
{
  "name": "my-org",
  "workspace_count": 31,
  "total_resources": 1424
}
```
:::


---

## 22. Fetch Key Outputs from Multiple Workspaces

> **Persona:** SRE / Integrator  
> **Goal:** Retrieve specific output values (e.g. `service_endpoint`) from a set of workspaces.

> **Query:**
```graphql
query StateVersionOutputSearch {
  searchStateVersionOutputs(filter:  {
     name:  {
        _ilike: "%fqdn%"
     }
  }) {
    name
    value
    stateVersion {
      workspace {
        id
        name
      }
    }
  }
}
```

---

## 24. Audit Workspace Execution Modes (Agent vs. Cloud)

> **Persona:** Platform Engineer  
> **Goal:** Review which workspaces use Terraform Cloud agents vs hosted execution.

> **Query:**
```graphql
query ExecutionModes {
  workspaces {
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
