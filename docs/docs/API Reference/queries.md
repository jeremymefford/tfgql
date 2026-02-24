---
title: Queries
description: All available root query fields
---

# Queries

All root-level query fields available in the TFGQL schema.

| Query | Return Type | Description |
| ----- | ----------- | ----------- |
| `adminUsers(filter: UserFilter, search: String, admin: Boolean, suspended: Boolean)` | `[AdminUser!]!` | Lists all Terraform Enterprise users available to site administrators. |
| `agentPools(includeOrgs: [String!], excludeOrgs: [String!], filter: AgentPoolFilter)` | `[AgentPool!]!` |  |
| `agentPool(id: ID!)` | `AgentPool` |  |
| `agentTokens(poolId: ID!, filter: AgentTokenFilter)` | `[AgentToken!]!` |  |
| `agentToken(id: ID!)` | `AgentToken` |  |
| `agents(poolId: ID!, filter: AgentFilter)` | `[Agent!]!` |  |
| `agent(id: ID!)` | `Agent` |  |
| `applyForRun(runId: ID!)` | `Apply` |  |
| `apply(id: ID!)` | `Apply` |  |
| `appliesForWorkspace(workspaceId: ID!, filter: ApplyFilter)` | `[Apply!]!` |  |
| `appliesForProject(projectId: ID!, filter: ApplyFilter)` | `[Apply!]!` |  |
| `appliesForOrganization(organizationId: ID!, filter: ApplyFilter)` | `[Apply!]!` |  |
| `assessmentResults(workspaceId: ID!, filter: AssessmentResultFilter)` | `[AssessmentResult!]!` |  |
| `assessmentResult(id: ID!)` | `AssessmentResult` |  |
| `comments(runId: ID!, filter: CommentFilter)` | `[Comment!]!` |  |
| `comment(id: ID!)` | `Comment` |  |
| `configurationVersion(id: ID!)` | `ConfigurationVersion` |  |
| `configurationVersions(workspaceId: ID!, filter: ConfigurationVersionFilter)` | `[ConfigurationVersion]!` |  |
| `workspacesWithConfigurationVersionsLargerThan(includeOrgs: [String!], excludeOrgs: [String!], bytes: Int!)` | `[Workspace]!` |  |
| `explorerWorkspaces(includeOrgs: [String!], excludeOrgs: [String!], sort: [ExplorerWorkspaceSortInput!], filters: [ExplorerWorkspaceFilterInput!])` | `[ExplorerWorkspaceRow!]!` |  |
| `explorerTerraformVersions(includeOrgs: [String!], excludeOrgs: [String!], sort: [ExplorerTerraformVersionSortInput!], filters: [ExplorerTerraformVersionFilterInput!])` | `[ExplorerTerraformVersionRow!]!` |  |
| `explorerProviders(includeOrgs: [String!], excludeOrgs: [String!], sort: [ExplorerProviderSortInput!], filters: [ExplorerProviderFilterInput!])` | `[ExplorerProviderRow!]!` |  |
| `explorerModules(includeOrgs: [String!], excludeOrgs: [String!], sort: [ExplorerModuleSortInput!], filters: [ExplorerModuleFilterInput!])` | `[ExplorerModuleRow!]!` |  |
| `organizationMemberships(includeOrgs: [String!], excludeOrgs: [String!], filter: OrganizationMembershipFilter)` | `[OrganizationMembership!]!` |  |
| `organizationMembership(id: ID!)` | `OrganizationMembership` |  |
| `myOrganizationMemberships(filter: OrganizationMembershipFilter)` | `[OrganizationMembership!]!` |  |
| `organizationTags(includeOrgs: [String!], excludeOrgs: [String!], filter: OrganizationTagFilter)` | `[OrganizationTag!]!` |  |
| `organizations(filter: OrganizationFilter)` | `[Organization!]!` |  |
| `organization(name: String!)` | `Organization` |  |
| `plan(id: ID!)` | `Plan` |  |
| `policies(includeOrgs: [String!], excludeOrgs: [String!], filter: PolicyFilter)` | `[Policy!]!` |  |
| `policy(id: ID!)` | `Policy` |  |
| `policyEvaluations(taskStageId: ID!, filter: PolicyEvaluationFilter)` | `[PolicyEvaluation!]!` |  |
| `policySetParameters(policySetId: ID!, filter: PolicySetParameterFilter)` | `[PolicySetParameter!]!` |  |
| `policySets(includeOrgs: [String!], excludeOrgs: [String!], filter: PolicySetFilter)` | `[PolicySet!]!` |  |
| `policySet(id: ID!)` | `PolicySet` |  |
| `projectTeamAccessByProject(projectId: ID!, filter: ProjectTeamAccessFilter)` | `[ProjectTeamAccess!]!` |  |
| `projectTeamAccessByTeam(teamId: ID!, filter: ProjectTeamAccessFilter)` | `[ProjectTeamAccess!]!` |  |
| `projectTeamAccessById(id: ID!)` | `ProjectTeamAccess` |  |
| `projects(includeOrgs: [String!], excludeOrgs: [String!], filter: ProjectFilter)` | `[Project!]!` |  |
| `project(id: ID!)` | `Project` |  |
| `metrics(format: MetricFormat, names: [String!], includeOrgs: [String!], excludeOrgs: [String!])` | `PrometheusResult!` | Execute all configured metric definitions and return results in Prometheus exposition format. |
| `metricFromQuery(name: String!, help: String, type: String, query: String!, variables: JSON, resultPath: String!, valueField: String!, labels: JSON!, format: MetricFormat)` | `PrometheusResult!` | Execute a single ad-hoc metric query. The caller supplies the GraphQL query, result path, value field, and label mappings. |
| `runTriggers(workspaceId: ID!, filter: RunTriggerFilter)` | `[WorkspaceRunTrigger!]!` |  |
| `runTrigger(id: ID!)` | `RunTrigger` |  |
| `runsForWorkspace(workspaceId: ID!, filter: RunFilter)` | `[Run!]!` |  |
| `run(id: ID!)` | `Run` |  |
| `runs(includeOrgs: [String!], excludeOrgs: [String!], filter: RunFilter)` | `[Run!]!` |  |
| `runsWithOverriddenPolicy(includeOrgs: [String!], excludeOrgs: [String!], filter: RunFilter)` | `[Run!]!` |  |
| `runsWithPlanApplyFilter(includeOrgs: [String!], excludeOrgs: [String!], filter: RunFilter, planFilter: PlanFilter, applyFilter: ApplyFilter)` | `[Run!]!` |  |
| `stateVersionOutputs(stateVersionId: ID!, filter: StateVersionOutputFilter)` | `[StateVersionOutput!]!` |  |
| `stateVersionOutput(id: ID!)` | `StateVersionOutput` |  |
| `searchStateVersionOutputs(includeOrgs: [String!], excludeOrgs: [String!], filter: StateVersionOutputFilter!)` | `[StateVersionOutput!]!` |  |
| `stateVersions(orgName: String!, workspaceName: String!, filter: StateVersionFilter)` | `[StateVersion!]!` |  |
| `stateVersion(id: ID!)` | `StateVersion` |  |
| `workspaceCurrentStateVersion(workspaceId: ID!)` | `StateVersion` |  |
| `teamTokens(teamId: ID!, filter: TeamTokenFilter)` | `[TeamToken!]!` |  |
| `teamToken(id: ID!)` | `TeamToken` |  |
| `teams(includeOrgs: [String!], excludeOrgs: [String!], filter: TeamFilter)` | `[Team!]!` |  |
| `teamsByQuery(organization: String!, query: String!, filter: TeamFilter)` | `[Team!]!` |  |
| `teamsByName(organization: String!, names: [String!]!, filter: TeamFilter)` | `[Team!]!` |  |
| `team(id: ID!)` | `Team` |  |
| `user(id: ID!)` | `User` |  |
| `me` | `User` |  |
| `variableSets(includeOrgs: [String!], excludeOrgs: [String!], filter: VariableSetFilter)` | `[VariableSet!]!` |  |
| `variableSet(id: ID!)` | `VariableSet` |  |
| `variables(organization: String!, workspaceName: String!, filter: VariableFilter)` | `[Variable!]!` |  |
| `workspacesWithTFLogCategory(includeOrgs: [String!], excludeOrgs: [String!], categories: [TF_LOG_CATEGORY!]!)` | `[Workspace!]!` |  |
| `workspaceResources(workspaceId: ID!, filter: WorkspaceResourceFilter)` | `[WorkspaceResource!]!` |  |
| `workspaceTeamAccessByWorkspace(workspaceId: ID!, filter: WorkspaceTeamAccessFilter)` | `[WorkspaceTeamAccess!]!` |  |
| `workspaceTeamAccessByTeam(teamId: ID!, filter: WorkspaceTeamAccessFilter)` | `[WorkspaceTeamAccess!]!` |  |
| `workspaceTeamAccessById(id: ID!)` | `WorkspaceTeamAccess` |  |
| `workspaces(includeOrgs: [String!], excludeOrgs: [String!], filter: WorkspaceFilter)` | `[Workspace!]!` |  |
| `workspace(id: ID!)` | `Workspace` |  |
| `workspaceByName(organization: String!, workspaceName: String!)` | `Workspace` |  |
| `workspacesWithNoResources(includeOrgs: [String!], excludeOrgs: [String!], filter: WorkspaceFilter)` | `[Workspace!]!` |  |
| `workspacesWithFailedPolicyChecks(includeOrgs: [String!], excludeOrgs: [String!], filter: WorkspaceFilter)` | `[Workspace!]!` |  |
| `workspacesWithOpenCurrentRun(includeOrgs: [String!], excludeOrgs: [String!], filter: WorkspaceFilter)` | `[Workspace!]!` | List all workspaces across the selected organizations that have at least one run matching the given runFilter (e.g. non-terminal states). |
| `runTriggerGraph(includeOrgs: [String!], excludeOrgs: [String!])` | `[WorkspaceRunTrigger!]!` | List all run-trigger edges (workspace dependency graph) across the selected organizations. |
