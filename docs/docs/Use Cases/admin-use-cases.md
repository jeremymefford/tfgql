---
id: admin-use-cases
title: Admin Use Cases
sidebar_label: Admin Use Cases
---

# Common Admin Workflows

This page walks through ten frequent Terraform Cloud/Enterprise (TFC/E) administration tasks and shows how to accomplish each using the TFCE GraphQL API.  When the built‑in GraphQL schema is sufficient, we provide example queries.  For more specialized needs, we highlight the custom queries you can add (and note where API support is missing).

---

## 1. View all workspaces with open runs

TFC does not currently surface a global filter for run status.  Use the custom `workspacesWithOpenRuns` query to find all workspaces with at least one run matching a given status filter (e.g. planning/applying):

```graphql
query WorkspacesWithOpenRuns(
  $org: String!
  $runFilter: RunFilter!
) {
  workspacesWithOpenRuns(
    orgName: $org
    runFilter: $runFilter
  ) {
    id
    name
    runs(filter: $runFilter) {
      id
      status
      message
      createdAt
    }
  }
}
```

```json
# Variables:
{
  "org": "my-org",
  "runFilter": { "status": { "_in": ["planning", "applying"] } }
}
```

The GraphQL layer pages through all workspaces and tests the first page of runs for each, so this remains efficient even at scale.

---

## 2. Identify resource‑heavy states

Use the built‑in `resourceCount` field on `Workspace` to find workspaces whose current state contains more than *N* resources:

```graphql
query HeavyWorkspaces($org: String!, $min: Int!) {
  workspaces(
    orgName: $org
    filter: { resourceCount: { _gt: $min } }
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
query ExportAllVariables($org: String!) {
  workspaces(orgName: $org) {
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

Our resolvers automatically page through large result sets (`variables` is fetched lazily under the hood).

---

## 4. Map workspace → policy sets

The GraphQL schema already supports bi‑directional mapping between policy sets and workspaces.  To see which workspaces each policy set applies to:

```graphql
query PolicySetWorkspaces {
  policySets {
    id
    name
    workspaces {
      id
      name
    }
  }
}
```

If you prefer workspace‑centric output, you can also nest a policySets field under each `Workspace` (this will require adding a reverse lookup on Workspace, see note below).

---

## 5. Audit users across teams

Use nested relationships to audit every team’s membership:

```graphql
query OrgTeamsUsers($org: String!) {
  organization(name: $org) {
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

This leverages built‑in pagination and filtering on the `teams` and `users` connections.

## 6. Detect drift from VCS

To compare the last run’s commit SHA with your VCS HEAD, fetch the new `ingressAttributes.commitSha` (and related VCS metadata) on the `configurationVersion`:

```graphql
query WorkspaceDrift($org: String!) {
  workspaces(orgName: $org) {
    id
    name
    runs(filter: { status: { _in: ["applied"] } }) {
      configurationVersion {
        ingressAttributes {
          commitSha
          commitUrl
          branch
        }
      }
    }
  }
}
```

## 7. Generate Terraform “stack graph”

Modeling workspace dependencies requires ingesting run‑trigger events from `/runs/:run_id/run-events`.

We’ve added a new `runEvents` connection on `Run` so you can build the full dependency graph.  You can also query inbound/outbound run triggers on a workspace:

```graphql
query RunEvents($runId: ID!) {
  run(id: $runId) {
    id
    runEvents {
      id
      body
    }
  }
}
```

```graphql
query RunTriggers($workspaceId: ID!, $dir: String!) {
  runTriggers(workspaceId: $workspaceId, filter: { type: { _eq: $dir } }) {
    id
    workspaceName
    sourceableName
    createdAt
  }
}
```

## 8. Export workspace inputs & outputs

You can combine the variables (inputs) and state version outputs (outputs) per workspace:

```graphql
query WorkspaceIO($org: String!) {
  workspaces(orgName: $org) {
    id
    name
    variables {
      key
      value
      sensitive
    }
    # Assuming you know the last applied configuration version:
    latestConfiguration: configurationVersions(filter: { status: { _eq: "applied" } }) {
      id
      downloadUrl
    }
    stateVersionOutputs(stateVersionId: "<LATEST_CONFIG_ID>") {
      key
      value
    }
  }
}
```

---

## 9. Search across state versions

Finding which state version contains a given resource requires downloading the JSON state for each version.  We now expose the hosted JSON download URL on `StateVersion`.

```graphql
query SearchStateVersions($org: String!, $workspace: String!) {
  stateVersions(orgName: $org, workspaceName: $workspace) {
    id
    serial
    hostedJsonStateDownloadUrl
  }
}
```

Download `hostedJsonStateDownloadUrl` and scan for your resource (e.g. `aws_s3_bucket.foo`).

---

_For feedback or contributions on any of these use cases, please open an issue or PR!_