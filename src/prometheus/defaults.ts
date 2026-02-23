import type { MetricDefinition } from "./types";

export const defaultMetricDefinitions: MetricDefinition[] = [
  {
    name: "tfgql_workspace_resource_count",
    help: "Number of resources managed by each workspace",
    type: "gauge",
    query: `query($orgs: [String!]) {
      workspaces(includeOrgs: $orgs) {
        name
        resourceCount
        terraformVersion
        organization { name }
        project { name }
      }
    }`,
    resultPath: "workspaces",
    valueField: "resourceCount",
    labels: {
      organization: "organization.name",
      workspace: "name",
      terraform_version: "terraformVersion",
      project: "project.name",
    },
  },
  {
    name: "tfgql_workspace_run_failures",
    help: "Number of run failures per workspace",
    type: "gauge",
    query: `query($orgs: [String!]) {
      workspaces(includeOrgs: $orgs) {
        name
        runFailures
        organization { name }
      }
    }`,
    resultPath: "workspaces",
    valueField: "runFailures",
    labels: {
      organization: "organization.name",
      workspace: "name",
    },
  },
  {
    name: "tfgql_workspace_locked",
    help: "Whether a workspace is locked (1=locked, 0=unlocked)",
    type: "gauge",
    query: `query($orgs: [String!]) {
      workspaces(includeOrgs: $orgs) {
        name
        locked
        lockedReason
        organization { name }
      }
    }`,
    resultPath: "workspaces",
    valueField: "locked",
    labels: {
      organization: "organization.name",
      workspace: "name",
      locked_reason: "lockedReason",
    },
  },
  {
    name: "tfgql_workspace_plan_duration_avg",
    help: "Average plan duration in seconds per workspace",
    type: "gauge",
    query: `query($orgs: [String!]) {
      workspaces(includeOrgs: $orgs) {
        name
        planDurationAverage
        organization { name }
      }
    }`,
    resultPath: "workspaces",
    valueField: "planDurationAverage",
    labels: {
      organization: "organization.name",
      workspace: "name",
    },
  },
  {
    name: "tfgql_workspace_apply_duration_avg",
    help: "Average apply duration in seconds per workspace",
    type: "gauge",
    query: `query($orgs: [String!]) {
      workspaces(includeOrgs: $orgs) {
        name
        applyDurationAverage
        organization { name }
      }
    }`,
    resultPath: "workspaces",
    valueField: "applyDurationAverage",
    labels: {
      organization: "organization.name",
      workspace: "name",
    },
  },
  {
    name: "tfgql_workspace_policy_check_failures",
    help: "Number of policy check failures per workspace",
    type: "gauge",
    query: `query($orgs: [String!]) {
      workspaces(includeOrgs: $orgs) {
        name
        policyCheckFailures
        organization { name }
      }
    }`,
    resultPath: "workspaces",
    valueField: "policyCheckFailures",
    labels: {
      organization: "organization.name",
      workspace: "name",
    },
  },
  {
    name: "tfgql_agent_status",
    help: "Agent pool agent status info",
    type: "info",
    query: `query($orgs: [String!]) {
      agentPools(includeOrgs: $orgs) {
        name
        organizationName
        agents {
          name
          status
          ipAddress
        }
      }
    }`,
    resultPath: "agentPools[].agents",
    valueField: "",
    labels: {
      organization: "__parent.organizationName",
      pool: "__parent.name",
      agent: "name",
      status: "status",
    },
  },
  {
    name: "tfgql_explorer_terraform_version_workspace_count",
    help: "Number of workspaces per Terraform version (TFC only)",
    type: "gauge",
    query: `query($orgs: [String!]) {
      explorerTerraformVersions(includeOrgs: $orgs) {
        version
        workspaceCount
      }
    }`,
    resultPath: "explorerTerraformVersions",
    valueField: "workspaceCount",
    labels: {
      terraform_version: "version",
    },
  },
];
