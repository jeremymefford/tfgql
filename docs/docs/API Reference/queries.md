---
title: Queries
description: All available root query fields
---

# Queries

All root-level query fields available in the TFGQL schema.

| Query | Return Type | Description |
| ----- | ----------- | ----------- |
| `adminUsers(filter: UserFilter, search: String, admin: Boolean, suspended: Boolean)` | `[AdminUser!]!` | Lists all Terraform Enterprise users available to site administrators. |
| `agentPools(includeOrgs: [String!], excludeOrgs: [String!], filter: AgentPoolFilter)` | `[AgentPool!]!` | List all agent pools across the selected organizations. |
| `agentPool(id: ID!)` | `AgentPool` | Look up a single agent pool by ID. |
| `agentTokens(poolId: ID!, filter: AgentTokenFilter)` | `[AgentToken!]!` | List all authentication tokens for a specific agent pool. |
| `agentToken(id: ID!)` | `AgentToken` | Look up a single agent token by ID. |
| `agents(poolId: ID!, filter: AgentFilter)` | `[Agent!]!` | List all agents registered in a specific agent pool. |
| `agent(id: ID!)` | `Agent` | Look up a single agent by ID. |
| `applyForRun(runId: ID!)` | `Apply` | Get the apply for a specific run. |
| `apply(id: ID!)` | `Apply` | Look up a single apply by ID. |
| `appliesForWorkspace(workspaceId: ID!, filter: ApplyFilter)` | `[Apply!]!` | List all applies for runs within a workspace. |
| `appliesForProject(projectId: ID!, filter: ApplyFilter)` | `[Apply!]!` | List all applies for runs across all workspaces in a project. |
| `appliesForOrganization(organizationId: ID!, filter: ApplyFilter)` | `[Apply!]!` | List all applies for runs across all workspaces in an organization. |
| `assessmentResults(workspaceId: ID!, filter: AssessmentResultFilter)` | `[AssessmentResult!]!` | List all health assessment results for a specific workspace. |
| `assessmentResult(id: ID!)` | `AssessmentResult` | Look up a single assessment result by ID. |
| `comments(runId: ID!, filter: CommentFilter)` | `[Comment!]!` | List all comments on a specific run. |
| `comment(id: ID!)` | `Comment` | Look up a single comment by ID. |
| `configurationVersion(id: ID!)` | `ConfigurationVersion` | Look up a single configuration version by ID. |
| `configurationVersions(workspaceId: ID!, filter: ConfigurationVersionFilter)` | `[ConfigurationVersion]!` | List configuration versions for a workspace. |
| `workspacesWithConfigurationVersionsLargerThan(includeOrgs: [String!], excludeOrgs: [String!], bytes: Int!)` | `[Workspace]!` | List workspaces that have at least one configuration version larger than the specified byte threshold. |
| `explorerWorkspaces(includeOrgs: [String!], excludeOrgs: [String!], sort: [ExplorerWorkspaceSortInput!], filters: [ExplorerWorkspaceFilterInput!])` | `[ExplorerWorkspaceRow!]!` | Query the HCP Terraform Explorer API for workspace data with server-side filtering and sorting. Only available on HCP Terraform (not Terraform Enterprise). |
| `explorerTerraformVersions(includeOrgs: [String!], excludeOrgs: [String!], sort: [ExplorerTerraformVersionSortInput!], filters: [ExplorerTerraformVersionFilterInput!])` | `[ExplorerTerraformVersionRow!]!` | Query the Explorer API for Terraform version usage across workspaces. |
| `explorerProviders(includeOrgs: [String!], excludeOrgs: [String!], sort: [ExplorerProviderSortInput!], filters: [ExplorerProviderFilterInput!])` | `[ExplorerProviderRow!]!` | Query the Explorer API for provider usage across workspaces. |
| `explorerModules(includeOrgs: [String!], excludeOrgs: [String!], sort: [ExplorerModuleSortInput!], filters: [ExplorerModuleFilterInput!])` | `[ExplorerModuleRow!]!` | Query the Explorer API for module usage across workspaces. |
| `organizationMemberships(includeOrgs: [String!], excludeOrgs: [String!], filter: OrganizationMembershipFilter)` | `[OrganizationMembership!]!` | List all organization memberships across the selected organizations. |
| `organizationMembership(id: ID!)` | `OrganizationMembership` | Look up a single organization membership by ID. |
| `myOrganizationMemberships(filter: OrganizationMembershipFilter)` | `[OrganizationMembership!]!` | List the authenticated user's own organization memberships. |
| `organizationTags(includeOrgs: [String!], excludeOrgs: [String!], filter: OrganizationTagFilter)` | `[OrganizationTag!]!` | List all tags across the selected organizations. |
| `organizations(filter: OrganizationFilter)` | `[Organization!]!` | List all organizations accessible to the authenticated user. |
| `organization(name: String!)` | `Organization` | Look up a single organization by name. |
| `plan(id: ID!)` | `Plan` |  |
| `policies(includeOrgs: [String!], excludeOrgs: [String!], filter: PolicyFilter)` | `[Policy!]!` | List all policies across the selected organizations. |
| `policy(id: ID!)` | `Policy` | Look up a single policy by ID. |
| `policyEvaluations(taskStageId: ID!, filter: PolicyEvaluationFilter)` | `[PolicyEvaluation!]!` | List all policy evaluations for a specific task stage. |
| `policySetParameters(policySetId: ID!, filter: PolicySetParameterFilter)` | `[PolicySetParameter!]!` | List all parameters for a specific policy set. |
| `policySets(includeOrgs: [String!], excludeOrgs: [String!], filter: PolicySetFilter)` | `[PolicySet!]!` | List all policy sets across the selected organizations. |
| `policySet(id: ID!)` | `PolicySet` | Look up a single policy set by ID. |
| `projectTeamAccessByProject(projectId: ID!, filter: ProjectTeamAccessFilter)` | `[ProjectTeamAccess!]!` | List all team access grants for a specific project. |
| `projectTeamAccessByTeam(teamId: ID!, filter: ProjectTeamAccessFilter)` | `[ProjectTeamAccess!]!` | List all project access grants for a specific team. |
| `projectTeamAccessById(id: ID!)` | `ProjectTeamAccess` | Look up a single project team access grant by ID. |
| `projects(includeOrgs: [String!], excludeOrgs: [String!], filter: ProjectFilter)` | `[Project!]!` | List all projects across the selected organizations. |
| `project(id: ID!)` | `Project` | Look up a single project by ID. |
| `metrics(format: MetricFormat, names: [String!], includeOrgs: [String!], excludeOrgs: [String!])` | `PrometheusResult!` | Execute all configured metric definitions and return results in Prometheus exposition format. |
| `metricFromQuery(name: String!, help: String, type: String, query: String!, variables: JSON, resultPath: String!, valueField: String!, labels: JSON!, format: MetricFormat)` | `PrometheusResult!` | Execute a single ad-hoc metric query. The caller supplies the GraphQL query, result path, value field, and label mappings. |
| `runTriggers(workspaceId: ID!, filter: RunTriggerFilter)` | `[WorkspaceRunTrigger!]!` | List all inbound and outbound run triggers for a specific workspace. |
| `runTrigger(id: ID!)` | `RunTrigger` | Look up a single run trigger by ID. |
| `runsForWorkspace(workspaceId: ID!, filter: RunFilter)` | `[Run!]!` | List all runs for a specific workspace. |
| `run(id: ID!)` | `Run` | Look up a single run by ID. |
| `runs(includeOrgs: [String!], excludeOrgs: [String!], filter: RunFilter)` | `[Run!]!` | List all runs across the selected organizations. |
| `runsWithOverriddenPolicy(includeOrgs: [String!], excludeOrgs: [String!], filter: RunFilter)` | `[Run!]!` | List runs where a policy check was soft-mandatory failed and then overridden. |
| `runsWithPlanApplyFilter(includeOrgs: [String!], excludeOrgs: [String!], filter: RunFilter, planFilter: PlanFilter, applyFilter: ApplyFilter)` | `[Run!]!` | List runs with additional filtering on plan and apply attributes. Each run's plan and apply are fetched individually to evaluate the filters. |
| `stateVersionOutputs(stateVersionId: ID!, filter: StateVersionOutputFilter)` | `[StateVersionOutput!]!` | List outputs for a specific state version. |
| `stateVersionOutput(id: ID!)` | `StateVersionOutput` | Look up a single state version output by ID. |
| `searchStateVersionOutputs(includeOrgs: [String!], excludeOrgs: [String!], filter: StateVersionOutputFilter!)` | `[StateVersionOutput!]!` | Search state version outputs across all workspaces in the selected organizations. Useful for finding cross-workspace output dependencies. |
| `stateVersions(orgName: String!, workspaceName: String!, filter: StateVersionFilter)` | `[StateVersion!]!` | List state versions for a specific workspace. |
| `stateVersion(id: ID!)` | `StateVersion` | Look up a single state version by ID. |
| `workspaceCurrentStateVersion(workspaceId: ID!)` | `StateVersion` | Get the current (most recent) state version for a workspace. |
| `teamTokens(teamId: ID!, filter: TeamTokenFilter)` | `[TeamToken!]!` | List all API tokens for a specific team. |
| `teamToken(id: ID!)` | `TeamToken` | Look up a single team token by ID. |
| `teams(includeOrgs: [String!], excludeOrgs: [String!], filter: TeamFilter)` | `[Team!]!` | List all teams across the selected organizations. |
| `teamsByQuery(organization: String!, query: String!, filter: TeamFilter)` | `[Team!]!` | Search teams within an organization by name query string. |
| `teamsByName(organization: String!, names: [String!]!, filter: TeamFilter)` | `[Team!]!` | Look up specific teams within an organization by exact name. |
| `team(id: ID!)` | `Team` | Look up a single team by ID. |
| `user(id: ID!)` | `User` | Look up a single user by ID. |
| `me` | `User` | Get the currently authenticated user's account details. |
| `variableSets(includeOrgs: [String!], excludeOrgs: [String!], filter: VariableSetFilter)` | `[VariableSet!]!` | List all variable sets across the selected organizations. |
| `variableSet(id: ID!)` | `VariableSet` | Look up a single variable set by ID. |
| `variables(organization: String!, workspaceName: String!, filter: VariableFilter)` | `[Variable!]!` | List variables for a specific workspace. |
| `workspacesWithTFLogCategory(includeOrgs: [String!], excludeOrgs: [String!], categories: [TF_LOG_CATEGORY!]!)` | `[Workspace!]!` | List workspaces that have a TF_LOG environment variable set to one of the given log categories. |
| `workspaceResources(workspaceId: ID!, filter: WorkspaceResourceFilter)` | `[WorkspaceResource!]!` | List all Terraform-managed resources tracked in a workspace's state. |
| `workspaceTeamAccessByWorkspace(workspaceId: ID!, filter: WorkspaceTeamAccessFilter)` | `[WorkspaceTeamAccess!]!` | List all team access grants for a specific workspace. |
| `workspaceTeamAccessByTeam(teamId: ID!, filter: WorkspaceTeamAccessFilter)` | `[WorkspaceTeamAccess!]!` | List all workspace access grants for a specific team. |
| `workspaceTeamAccessById(id: ID!)` | `WorkspaceTeamAccess` | Look up a single workspace team access grant by ID. |
| `workspaces(includeOrgs: [String!], excludeOrgs: [String!], filter: WorkspaceFilter)` | `[Workspace!]!` | List all workspaces across the selected organizations. |
| `workspace(id: ID!)` | `Workspace` | Look up a single workspace by ID. |
| `workspaceByName(organization: String!, workspaceName: String!)` | `Workspace` | Look up a single workspace by organization name and workspace name. |
| `workspacesWithNoResources(includeOrgs: [String!], excludeOrgs: [String!], filter: WorkspaceFilter)` | `[Workspace!]!` | List workspaces that have zero managed resources (empty state). |
| `workspacesWithFailedPolicyChecks(includeOrgs: [String!], excludeOrgs: [String!], filter: WorkspaceFilter)` | `[Workspace!]!` | List workspaces where the current run has failed policy checks. |
| `workspacesWithOpenCurrentRun(includeOrgs: [String!], excludeOrgs: [String!], filter: WorkspaceFilter)` | `[Workspace!]!` | List all workspaces across the selected organizations that have at least one run matching the given runFilter (e.g. non-terminal states). |
| `runTriggerGraph(includeOrgs: [String!], excludeOrgs: [String!])` | `[WorkspaceRunTrigger!]!` | List all run-trigger edges (workspace dependency graph) across the selected organizations. |
