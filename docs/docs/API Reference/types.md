---
title: Types
description: All GraphQL object types, interfaces, and enums
---

# Types

All object types, interfaces, and enums in the TFGQL schema.

## Object Types

- [AdminUser](#adminuser)
- [Agent](#agent)
- [AgentPool](#agentpool)
- [AgentToken](#agenttoken)
- [Apply](#apply)
- [AssessmentResult](#assessmentresult)
- [Comment](#comment)
- [ConfigurationVersion](#configurationversion)
- [ConfigurationVersionStatusTimestamps](#configurationversionstatustimestamps)
- [ExplorerModuleRow](#explorermodulerow)
- [ExplorerProviderRow](#explorerproviderrow)
- [ExplorerTerraformVersionRow](#explorerterraformversionrow)
- [ExplorerWorkspaceRow](#explorerworkspacerow)
- [IngressAttributes](#ingressattributes)
- [Organization](#organization)
- [OrganizationMembership](#organizationmembership)
- [OrganizationPermissions](#organizationpermissions)
- [OrganizationTag](#organizationtag)
- [Plan](#plan)
- [Policy](#policy)
- [PolicyCheck](#policycheck)
- [PolicyCheckActions](#policycheckactions)
- [PolicyCheckPermissions](#policycheckpermissions)
- [PolicyCheckStatusTimestamps](#policycheckstatustimestamps)
- [PolicyEvaluation](#policyevaluation)
- [PolicyEvaluationResultCount](#policyevaluationresultcount)
- [PolicyEvaluationStatusTimestamps](#policyevaluationstatustimestamps)
- [PolicySet](#policyset)
- [PolicySetOutcome](#policysetoutcome)
- [PolicySetOutcomeResultCount](#policysetoutcomeresultcount)
- [PolicySetParameter](#policysetparameter)
- [PolicySetVcsRepo](#policysetvcsrepo)
- [Project](#project)
- [ProjectAccess](#projectaccess)
- [ProjectPermissions](#projectpermissions)
- [ProjectTeamAccess](#projectteamaccess)
- [PrometheusMetricSample](#prometheusmetricsample)
- [PrometheusResult](#prometheusresult)
- [Run](#run)
- [RunActions](#runactions)
- [RunEvent](#runevent)
- [RunPermissions](#runpermissions)
- [RunStatusTimestamps](#runstatustimestamps)
- [RunTrigger](#runtrigger)
- [SettingOverwrites](#settingoverwrites)
- [StateVersion](#stateversion)
- [StateVersionOutput](#stateversionoutput)
- [Team](#team)
- [TeamOrganizationAccess](#teamorganizationaccess)
- [TeamPermissions](#teampermissions)
- [TeamToken](#teamtoken)
- [User](#user)
- [UserPermissions](#userpermissions)
- [Variable](#variable)
- [VariableSet](#variableset)
- [VariableSetPermissions](#variablesetpermissions)
- [Workspace](#workspace)
- [WorkspaceAccess](#workspaceaccess)
- [WorkspaceActions](#workspaceactions)
- [WorkspaceModule](#workspacemodule)
- [WorkspacePermissions](#workspacepermissions)
- [WorkspaceProvider](#workspaceprovider)
- [WorkspaceResource](#workspaceresource)
- [WorkspaceRunTrigger](#workspaceruntrigger)
- [WorkspaceSettingOverwrites](#workspacesettingoverwrites)
- [WorkspaceTeamAccess](#workspaceteamaccess)

## Interfaces

- [AbstractRunTrigger](#abstractruntrigger)
- [UserAccount](#useraccount)

## Enums

- [ExplorerFilterOperator](#explorerfilteroperator)
- [ExplorerModuleField](#explorermodulefield)
- [ExplorerProviderField](#explorerproviderfield)
- [ExplorerTerraformVersionField](#explorerterraformversionfield)
- [ExplorerWorkspaceField](#explorerworkspacefield)
- [LogLevel](#loglevel)
- [MetricFormat](#metricformat)
- [TF_LOG_CATEGORY](#tf_log_category)

---

### AdminUser

Represents a user managed through the Terraform Enterprise admin APIs.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` |  |
| `username` | `String!` |  |
| `email` | `String` |  |
| `avatarUrl` | `String` |  |
| `isServiceAccount` | `Boolean!` |  |
| `isAdmin` | `Boolean!` |  |
| `isSuspended` | `Boolean!` |  |
| `organizations` | `[Organization!]!` |  |
| `teams(includeOrgs: [String!], excludeOrgs: [String!], filter: TeamFilter)` | `[Team!]!` |  |

---

### Agent

A Terraform Cloud agent that executes runs on isolated, private, or on-premises infrastructure. Agents connect to HCP Terraform and are organized into agent pools.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` |  |
| `name` | `String` |  |
| `status` | `String!` |  |
| `ipAddress` | `String!` |  |
| `lastPingAt` | `DateTime!` |  |

---

### AgentPool

A group of agents, often sharing a common network segment or purpose. Workspaces can be configured to use an agent pool for remote operations with isolated infrastructure.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` |  |
| `type` | `String!` |  |
| `name` | `String!` |  |
| `createdAt` | `DateTime!` |  |
| `organizationScoped` | `Boolean!` |  |
| `organizationName` | `String` | The name of the organization this agent pool belongs to. |
| `agentCount` | `Int!` |  |
| `workspaces(filter: WorkspaceFilter)` | `[Workspace!]!` |  |
| `allowedWorkspaces(filter: WorkspaceFilter)` | `[Workspace!]!` |  |
| `agents(filter: AgentFilter)` | `[Agent!]!` |  |
| `authenticationTokens(filter: AgentTokenFilter)` | `[AgentToken!]!` |  |

---

### AgentToken

An authentication token used by agents to register with an agent pool.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` |  |
| `poolId` | `String` |  |
| `createdAt` | `DateTime!` |  |
| `lastUsedAt` | `DateTime` |  |
| `description` | `String!` |  |
| `createdById` | `ID!` |  |

---

### Apply

Represents the results of applying a Terraform run's execution plan. Contains resource change counts, status, and log output.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` |  |
| `mode` | `String` |  |
| `status` | `String!` |  |
| `queuedAt` | `DateTime` |  |
| `startedAt` | `DateTime` |  |
| `finishedAt` | `DateTime` |  |
| `logReadUrl` | `String!` |  |
| `applyLog(minimumLevel: LogLevel)` | `[JSON!]` |  |
| `structuredRunOutputEnabled` | `Boolean!` |  |
| `resourceAdditions` | `Int` |  |
| `resourceChanges` | `Int` |  |
| `resourceDestructions` | `Int` |  |
| `resourceImports` | `Int` |  |
| `stateVersions(filter: StateVersionFilter)` | `[StateVersion!]!` |  |

---

### AssessmentResult

The result of a health assessment for a workspace, including drift detection and continuous validation status.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` |  |
| `drifted` | `Boolean!` |  |
| `succeeded` | `Boolean!` |  |
| `errorMessage` | `String` |  |
| `createdAt` | `DateTime!` |  |

---

### Comment

A comment left on a Terraform run. Comments appear in the run timeline and can be used for review discussions.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` |  |
| `body` | `String!` |  |
| `runEventId` | `ID` |  |

---

### ConfigurationVersion

A snapshot of Terraform configuration files uploaded to a workspace. Each run is associated with a configuration version that provides the code to plan and apply.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` |  |
| `autoQueueRuns` | `Boolean!` |  |
| `error` | `String` |  |
| `errorMessage` | `String` |  |
| `provisional` | `Boolean!` |  |
| `source` | `String` |  |
| `speculative` | `Boolean!` |  |
| `status` | `String!` |  |
| `statusTimestamps` | `ConfigurationVersionStatusTimestamps` |  |
| `changedFiles` | `[String!]!` |  |
| `ingressAttributes` | `IngressAttributes` |  |
| `size` | `Int` |  |
| `downloadUrl` | `String` |  |

---

### ConfigurationVersionStatusTimestamps

| Field | Type | Description |
| ----- | ---- | ----------- |
| `archivedAt` | `DateTime` |  |
| `fetchingAt` | `DateTime` |  |
| `uploadedAt` | `DateTime` |  |

---

### ExplorerModuleRow

A row from the Explorer API grouping workspaces by Terraform module.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `name` | `String` |  |
| `source` | `String` |  |
| `version` | `String` |  |
| `workspaceCount` | `Int` |  |
| `workspaces` | `String` |  |
| `organization` | `Organization` |  |
| `workspaceEntities(filter: WorkspaceFilter)` | `[Workspace!]!` |  |

---

### ExplorerProviderRow

A row from the Explorer API grouping workspaces by Terraform provider.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `name` | `String` |  |
| `source` | `String` |  |
| `version` | `String` |  |
| `workspaceCount` | `Int` |  |
| `workspaces` | `String` |  |
| `organization` | `Organization` |  |
| `workspaceEntities(filter: WorkspaceFilter)` | `[Workspace!]!` |  |

---

### ExplorerTerraformVersionRow

A row from the Explorer API grouping workspaces by Terraform version.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `version` | `String` |  |
| `workspaceCount` | `Int` |  |
| `workspaces` | `String` |  |
| `organization` | `Organization` |  |
| `workspaceEntities(filter: WorkspaceFilter)` | `[Workspace!]!` |  |

---

### ExplorerWorkspaceRow

A denormalized row from the HCP Terraform Explorer API representing a workspace with inline metadata about its current run, drift status, checks, providers, and modules.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `allChecksSucceeded` | `Boolean` |  |
| `currentRumCount` | `Int` |  |
| `checksErrored` | `Int` |  |
| `checksFailed` | `Int` |  |
| `checksPassed` | `Int` |  |
| `checksUnknown` | `Int` |  |
| `currentRunAppliedAt` | `DateTime` |  |
| `currentRunExternalId` | `String` |  |
| `currentRunStatus` | `String` |  |
| `drifted` | `Boolean` |  |
| `externalId` | `String` |  |
| `moduleCount` | `Int` |  |
| `modules` | `String` |  |
| `organizationName` | `String` |  |
| `projectExternalId` | `String` |  |
| `projectName` | `String` |  |
| `providerCount` | `Int` |  |
| `providers` | `String` |  |
| `resourcesDrifted` | `Int` |  |
| `resourcesUndrifted` | `Int` |  |
| `stateVersionTerraformVersion` | `String` |  |
| `tags` | `String` |  |
| `vcsRepoIdentifier` | `String` |  |
| `workspaceCreatedAt` | `DateTime` |  |
| `workspaceName` | `String` |  |
| `workspaceTerraformVersion` | `String` |  |
| `workspaceUpdatedAt` | `DateTime` |  |
| `workspace` | `Workspace` |  |
| `project` | `Project` |  |
| `currentRun` | `Run` |  |
| `organization` | `Organization` |  |

---

### IngressAttributes

Commit metadata for VCS-based configuration versions.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` |  |
| `branch` | `String` |  |
| `cloneUrl` | `String` |  |
| `commitMessage` | `String` |  |
| `commitSha` | `String` |  |
| `commitUrl` | `String` |  |
| `compareUrl` | `String` |  |
| `identifier` | `String` |  |
| `isPullRequest` | `Boolean` |  |
| `onDefaultBranch` | `Boolean` |  |
| `pullRequestNumber` | `Int` |  |
| `pullRequestUrl` | `String` |  |
| `pullRequestTitle` | `String` |  |
| `pullRequestBody` | `String` |  |
| `tag` | `String` |  |
| `senderUsername` | `String` |  |
| `senderAvatarUrl` | `String` |  |
| `senderHtmlUrl` | `String` |  |
| `createdBy` | `String` |  |

---

### Organization

A shared space for teams to collaborate on workspaces in HCP Terraform. Organizations manage access, settings, and billing.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` |  |
| `name` | `String!` |  |
| `externalId` | `String!` |  |
| `email` | `String!` |  |
| `createdAt` | `DateTime!` |  |
| `sessionTimeout` | `Int` |  |
| `sessionRemember` | `Int` |  |
| `collaboratorAuthPolicy` | `String!` |  |
| `planExpired` | `Boolean!` |  |
| `planExpiresAt` | `DateTime` |  |
| `planIsTrial` | `Boolean` |  |
| `planIsEnterprise` | `Boolean` |  |
| `planIdentifier` | `String` |  |
| `costEstimationEnabled` | `Boolean!` |  |
| `sendPassingStatusesForUntriggeredSpeculativePlans` | `Boolean!` |  |
| `aggregatedCommitStatusEnabled` | `Boolean!` |  |
| `speculativePlanManagementEnabled` | `Boolean!` |  |
| `allowForceDeleteWorkspaces` | `Boolean!` |  |
| `fairRunQueuingEnabled` | `Boolean!` |  |
| `samlEnabled` | `Boolean!` |  |
| `ownersTeamSamlRoleId` | `String` |  |
| `twoFactorConformant` | `Boolean!` |  |
| `assessmentsEnforced` | `Boolean!` |  |
| `defaultExecutionMode` | `String!` |  |
| `permissions` | `OrganizationPermissions!` |  |
| `workspaces(filter: WorkspaceFilter)` | `[Workspace!]` |  |
| `teams(filter: TeamFilter)` | `[Team!]` |  |
| `users(filter: UserFilter)` | `[User!]` |  |
| `variableSets(filter: VariableSetFilter)` | `[VariableSet!]` |  |
| `memberships(filter: OrganizationMembershipFilter)` | `[OrganizationMembership!]!` |  |
| `tags(filter: OrganizationTagFilter)` | `[OrganizationTag!]!` |  |
| `policySets(filter: PolicySetFilter)` | `[PolicySet!]` |  |
| `usersFromAdmin(filter: UserFilter)` | `[AdminUser!]` |  |
| `projects(filter: ProjectFilter)` | `[Project!]` |  |

---

### OrganizationMembership

Represents a user's membership in an organization. Users are added by invitation and become members once accepted.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` |  |
| `status` | `String!` |  |
| `organizationId` | `ID!` |  |
| `userId` | `ID!` |  |
| `teamIds` | `[ID!]!` |  |

---

### OrganizationPermissions

| Field | Type | Description |
| ----- | ---- | ----------- |
| `canUpdate` | `Boolean!` |  |
| `canDestroy` | `Boolean!` |  |
| `canAccessViaTeams` | `Boolean!` |  |
| `canCreateModule` | `Boolean!` |  |
| `canCreateTeam` | `Boolean!` |  |
| `canCreateWorkspace` | `Boolean!` |  |
| `canManageUsers` | `Boolean!` |  |
| `canManageSubscription` | `Boolean!` |  |
| `canManageSso` | `Boolean!` |  |
| `canUpdateOauth` | `Boolean!` |  |
| `canUpdateSentinel` | `Boolean!` |  |
| `canUpdateSshKeys` | `Boolean!` |  |
| `canUpdateApiToken` | `Boolean!` |  |
| `canTraverse` | `Boolean!` |  |
| `canStartTrial` | `Boolean!` |  |
| `canUpdateAgentPools` | `Boolean!` |  |
| `canManageTags` | `Boolean!` |  |
| `canManageVarsets` | `Boolean!` |  |
| `canReadVarsets` | `Boolean!` |  |
| `canManagePublicProviders` | `Boolean!` |  |
| `canCreateProvider` | `Boolean!` |  |
| `canManagePublicModules` | `Boolean!` |  |
| `canManageCustomProviders` | `Boolean!` |  |
| `canManageRunTasks` | `Boolean!` |  |
| `canReadRunTasks` | `Boolean!` |  |
| `canCreateProject` | `Boolean!` |  |

---

### OrganizationTag

A tag used to classify and organize workspaces within an organization. Tags can be applied to multiple workspaces and used for filtering.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` |  |
| `name` | `String!` |  |
| `createdAt` | `DateTime!` |  |
| `instanceCount` | `Int!` |  |

---

### Plan

Represents the execution plan of a run in a Terraform workspace. Contains resource change counts, status, and optional structured JSON output.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` |  |
| `mode` | `String!` |  |
| `agentId` | `ID` |  |
| `agentName` | `String` |  |
| `agentPoolId` | `ID` |  |
| `agentPoolName` | `String` |  |
| `generatedConfiguration` | `Boolean!` |  |
| `hasChanges` | `Boolean!` |  |
| `resourceAdditions` | `Int!` |  |
| `resourceChanges` | `Int!` |  |
| `resourceDestructions` | `Int!` |  |
| `resourceImports` | `Int!` |  |
| `status` | `String!` |  |
| `logReadUrl` | `String!` |  |
| `planLog(minimumLevel: LogLevel)` | `[JSON!]` |  |
| `planExportDownloadUrl` | `String` |  |
| `structuredRunOutputEnabled` | `Boolean!` |  |
| `jsonOutputUrl` | `String` |  |
| `jsonOutputRedacted` | `String` |  |
| `jsonSchema` | `String` |  |
| `agentQueuedAt` | `DateTime` |  |
| `pendingAt` | `DateTime` |  |
| `startedAt` | `DateTime` |  |
| `finishedAt` | `DateTime` |  |

---

### Policy

A Sentinel or OPA policy that enforces rules during Terraform runs. Policies are organized into policy sets and have configurable enforcement levels.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` |  |
| `name` | `String!` |  |
| `description` | `String` |  |
| `kind` | `String!` |  |
| `query` | `String` |  |
| `enforcementLevel` | `String!` |  |
| `policySetCount` | `Int!` |  |
| `updatedAt` | `DateTime` |  |

---

### PolicyCheck

The result of a Sentinel policy check performed during a run. Contains the overall status, scope, and detailed result data including pass/fail outcomes.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` |  |
| `status` | `String!` |  |
| `scope` | `String!` |  |
| `result` | `JSON!` |  |
| `sentinel` | `JSON` |  |
| `statusTimestamps` | `PolicyCheckStatusTimestamps!` |  |
| `permissions` | `PolicyCheckPermissions!` |  |
| `actions` | `PolicyCheckActions!` |  |
| `createdAt` | `DateTime` |  |
| `finishedAt` | `DateTime` |  |
| `outputUrl` | `String` |  |
| `run` | `Run!` |  |

---

### PolicyCheckActions

Available actions for a policy check based on its current state.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `isOverridable` | `Boolean!` |  |

---

### PolicyCheckPermissions

Permissions the current user has on a policy check.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `canOverride` | `Boolean!` |  |

---

### PolicyCheckStatusTimestamps

Timestamps for each policy check status transition.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `queuedAt` | `DateTime` |  |
| `passedAt` | `DateTime` |  |
| `hardFailedAt` | `DateTime` |  |
| `softFailedAt` | `DateTime` |  |
| `advisoryFailedAt` | `DateTime` |  |
| `overriddenAt` | `DateTime` |  |

---

### PolicyEvaluation

An OPA or Sentinel policy evaluation performed during a run's task stage. Contains aggregated result counts and individual policy set outcomes.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` |  |
| `status` | `String!` |  |
| `policyKind` | `String!` |  |
| `resultCount` | `PolicyEvaluationResultCount!` |  |
| `statusTimestamps` | `PolicyEvaluationStatusTimestamps!` |  |
| `createdAt` | `DateTime!` |  |
| `updatedAt` | `DateTime!` |  |
| `policyAttachableId` | `ID` |  |
| `policySetOutcomes` | `[PolicySetOutcome!]!` |  |

---

### PolicyEvaluationResultCount

Counts of policy evaluation results, grouped by outcome.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `advisoryFailed` | `Int!` |  |
| `errored` | `Int!` |  |
| `mandatoryFailed` | `Int!` |  |
| `passed` | `Int!` |  |

---

### PolicyEvaluationStatusTimestamps

Timestamps for each policy evaluation status transition.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `queuedAt` | `DateTime` |  |
| `runningAt` | `DateTime` |  |
| `passedAt` | `DateTime` |  |
| `erroredAt` | `DateTime` |  |

---

### PolicySet

A collection of policies that can be applied to Terraform Cloud workspaces.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` |  |
| `name` | `String!` |  |
| `description` | `String` |  |
| `kind` | `String!` |  |
| `global` | `Boolean!` |  |
| `agentEnabled` | `Boolean!` |  |
| `policyToolVersion` | `String!` |  |
| `overridable` | `Boolean!` |  |
| `workspaceCount` | `Int!` |  |
| `projectCount` | `Int!` |  |
| `policyCount` | `Int` |  |
| `policiesPath` | `String` |  |
| `versioned` | `Boolean!` |  |
| `vcsRepo` | `PolicySetVcsRepo` |  |
| `createdAt` | `DateTime!` |  |
| `updatedAt` | `DateTime!` |  |
| `organization` | `Organization!` |  |
| `policies(filter: PolicyFilter)` | `[Policy!]!` |  |
| `projects(filter: ProjectFilter)` | `[Project!]!` |  |
| `workspaces(filter: WorkspaceFilter)` | `[Workspace!]!` |  |
| `workspaceExclusions(filter: WorkspaceFilter)` | `[Workspace!]!` |  |
| `parameters(filter: PolicySetParameterFilter)` | `[PolicySetParameter!]!` |  |

---

### PolicySetOutcome

The evaluation result of a single policy set, including individual policy outcomes and override status.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` |  |
| `outcomes` | `JSON` |  |
| `error` | `String` |  |
| `warnings` | `[JSON!]!` |  |
| `overridable` | `Boolean!` |  |
| `policySetName` | `String!` |  |
| `policySetDescription` | `String` |  |
| `resultCount` | `PolicySetOutcomeResultCount!` |  |

---

### PolicySetOutcomeResultCount

Counts of policy outcomes within a single policy set evaluation.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `advisoryFailed` | `Int!` |  |
| `mandatoryFailed` | `Int!` |  |
| `passed` | `Int!` |  |
| `errored` | `Int!` |  |

---

### PolicySetParameter

A key/value pair sent to the Sentinel runtime during policy checks. Parameters help avoid hardcoding sensitive values into policies.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` |  |
| `key` | `String!` |  |
| `value` | `String` |  |
| `sensitive` | `Boolean!` |  |
| `category` | `String!` |  |

---

### PolicySetVcsRepo

VCS repository configuration for a policy set.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `branch` | `String` |  |
| `identifier` | `String!` |  |
| `ingressSubmodules` | `Boolean!` |  |
| `oauthTokenId` | `String` |  |
| `githubAppInstallationId` | `String` |  |

---

### Project

A container for organizing workspaces within an organization. Projects group related workspaces and control team access at a higher level.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` |  |
| `name` | `String!` |  |
| `description` | `String` |  |
| `createdAt` | `DateTime` |  |
| `workspaceCount` | `Int` |  |
| `teamCount` | `Int` |  |
| `stackCount` | `Int` |  |
| `autoDestroyActivityDuration` | `String` |  |
| `defaultExecutionMode` | `String` |  |
| `settingOverwrites` | `SettingOverwrites` |  |
| `permissions` | `ProjectPermissions` |  |
| `organization` | `Organization` |  |
| `workspaces(filter: WorkspaceFilter)` | `[Workspace!]!` |  |
| `teams(filter: TeamFilter)` | `[Team!]!` |  |
| `variableSets(filter: VariableSetFilter)` | `[VariableSet!]!` |  |
| `teamAccess(filter: ProjectTeamAccessFilter)` | `[ProjectTeamAccess!]!` |  |

---

### ProjectAccess

Project-level permission settings for a team.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `settings` | `String!` |  |
| `teams` | `String!` |  |

---

### ProjectPermissions

| Field | Type | Description |
| ----- | ---- | ----------- |
| `canRead` | `Boolean` |  |
| `canUpdate` | `Boolean` |  |
| `canDestroy` | `Boolean` |  |
| `canCreateWorkspace` | `Boolean` |  |
| `canMoveWorkspace` | `Boolean` |  |
| `canMoveStack` | `Boolean` |  |
| `canDeployNoCodeModules` | `Boolean` |  |
| `canReadTeams` | `Boolean` |  |
| `canManageTags` | `Boolean` |  |
| `canManageTeams` | `Boolean` |  |
| `canManageInHcp` | `Boolean` |  |
| `canManageEphemeralWorkspaceForProjects` | `Boolean` |  |
| `canManageVarsets` | `Boolean` |  |

---

### ProjectTeamAccess

Associates a team with a project and defines the team's permission level for project settings, teams, and workspace operations within the project.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` |  |
| `access` | `String!` |  |
| `projectAccess` | `ProjectAccess!` |  |
| `workspaceAccess` | `WorkspaceAccess!` |  |
| `project` | `Project!` |  |
| `team` | `Team!` |  |

---

### PrometheusMetricSample

| Field | Type | Description |
| ----- | ---- | ----------- |
| `name` | `String!` |  |
| `labels` | `JSON!` |  |
| `value` | `Float` |  |

---

### PrometheusResult

| Field | Type | Description |
| ----- | ---- | ----------- |
| `text` | `String!` | Raw Prometheus exposition text, ready for ingestion |
| `samples` | `[PrometheusMetricSample!]!` | Structured metric samples for programmatic access |
| `familyCount` | `Int!` | Number of metric families rendered |
| `sampleCount` | `Int!` | Number of individual samples rendered |

---

### Run

Represents a Terraform execution within a workspace. A run performs a plan and optionally an apply to create, update, or destroy infrastructure.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` |  |
| `status` | `String!` |  |
| `message` | `String` |  |
| `isDestroy` | `Boolean!` |  |
| `createdAt` | `DateTime!` |  |
| `canceledAt` | `DateTime` |  |
| `hasChanges` | `Boolean!` |  |
| `autoApply` | `Boolean!` |  |
| `allowEmptyApply` | `Boolean!` |  |
| `allowConfigGeneration` | `Boolean!` |  |
| `planOnly` | `Boolean!` |  |
| `source` | `String!` |  |
| `statusTimestamps` | `RunStatusTimestamps` |  |
| `triggerReason` | `String!` |  |
| `targetAddrs` | `[String!]` |  |
| `replaceAddrs` | `[String!]` |  |
| `permissions` | `RunPermissions!` |  |
| `actions` | `RunActions!` |  |
| `refresh` | `Boolean!` |  |
| `refreshOnly` | `Boolean!` |  |
| `savePlan` | `Boolean!` |  |
| `variables` | `[String!]!` |  |
| `workspace` | `Workspace` |  |
| `configurationVersion` | `ConfigurationVersion` |  |
| `apply` | `Apply` |  |
| `comments(filter: CommentFilter)` | `[Comment!]!` |  |
| `runEvents` | `[RunEvent!]!` |  |
| `runTriggers(filter: RunTriggerFilter)` | `[RunTrigger!]!` |  |
| `plan` | `Plan` |  |
| `policyEvaluations(filter: PolicyEvaluationFilter)` | `[PolicyEvaluation!]!` |  |
| `policyChecks(filter: PolicyCheckFilter)` | `[PolicyCheck!]!` |  |

---

### RunActions

| Field | Type | Description |
| ----- | ---- | ----------- |
| `isCancelable` | `Boolean!` |  |
| `isConfirmable` | `Boolean!` |  |
| `isDiscardable` | `Boolean!` |  |
| `isForceCancelable` | `Boolean!` |  |

---

### RunEvent

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` |  |
| `body` | `JSON!` |  |

---

### RunPermissions

| Field | Type | Description |
| ----- | ---- | ----------- |
| `canApply` | `Boolean!` |  |
| `canCancel` | `Boolean!` |  |
| `canComment` | `Boolean!` |  |
| `canDiscard` | `Boolean!` |  |
| `canForceExecute` | `Boolean!` |  |
| `canForceCancel` | `Boolean!` |  |
| `canOverridePolicyCheck` | `Boolean!` |  |

---

### RunStatusTimestamps

| Field | Type | Description |
| ----- | ---- | ----------- |
| `planQueueableAt` | `DateTime` |  |

---

### RunTrigger

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` |  |
| `workspaceName` | `String!` |  |
| `sourceableName` | `String!` |  |
| `createdAt` | `DateTime!` |  |
| `workspace` | `Workspace!` |  |
| `sourceable` | `Workspace!` |  |

---

### SettingOverwrites

| Field | Type | Description |
| ----- | ---- | ----------- |
| `defaultExecutionMode` | `Boolean` |  |
| `defaultAgentPool` | `Boolean` |  |

---

### StateVersion

An instance of Terraform state data for a workspace. State versions contain metadata about the state, its properties, and download URLs. They do not directly contain the stored state itself.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` |  |
| `createdAt` | `DateTime!` |  |
| `size` | `Int` |  |
| `hostedJsonStateDownloadUrl` | `String` |  |
| `hostedStateDownloadUrl` | `String` |  |
| `hostedJsonStateUploadUrl` | `String` |  |
| `hostedStateUploadUrl` | `String` |  |
| `status` | `String` |  |
| `intermediate` | `Boolean` |  |
| `modules` | `JSON` |  |
| `providers` | `JSON` |  |
| `resources` | `JSON` |  |
| `resourcesProcessed` | `Boolean` |  |
| `serial` | `Int` |  |
| `stateVersion` | `Int` |  |
| `terraformVersion` | `String` |  |
| `vcsCommitSha` | `String` |  |
| `vcsCommitUrl` | `String` |  |
| `billableRumCount` | `Int` |  |
| `run` | `Run` |  |
| `createdBy` | `User` |  |
| `workspace` | `Workspace` |  |
| `outputs` | `[StateVersionOutput!]!` |  |

---

### StateVersionOutput

An output value from a Terraform state version. Contains the output name, type, value, and sensitivity flag.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` |  |
| `name` | `String!` |  |
| `sensitive` | `Boolean!` |  |
| `type` | `String!` |  |
| `value` | `JSON!` |  |
| `detailedType` | `JSON!` |  |
| `stateVersion` | `StateVersion` |  |

---

### Team

A group of HCP Terraform users with shared permissions. Teams can be granted access to workspaces and projects within an organization.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` |  |
| `name` | `String!` |  |
| `ssoTeamId` | `String` |  |
| `usersCount` | `Int!` |  |
| `visibility` | `String!` |  |
| `allowMemberTokenManagement` | `Boolean!` |  |
| `permissions` | `TeamPermissions!` |  |
| `organizationAccess` | `TeamOrganizationAccess!` |  |
| `organization` | `Organization!` |  |
| `users(filter: UserFilter)` | `[User!]!` |  |
| `usersFromAdmin(filter: UserFilter)` | `[AdminUser!]` |  |
| `tokens(filter: TeamTokenFilter)` | `[TeamToken!]!` |  |
| `workspaceAccess(filter: WorkspaceTeamAccessFilter)` | `[WorkspaceTeamAccess!]!` |  |
| `projectAccess(filter: ProjectTeamAccessFilter)` | `[ProjectTeamAccess!]!` |  |

---

### TeamOrganizationAccess

| Field | Type | Description |
| ----- | ---- | ----------- |
| `managePolicies` | `Boolean` |  |
| `manageWorkspaces` | `Boolean` |  |
| `manageVcsSettings` | `Boolean` |  |
| `managePolicyOverrides` | `Boolean` |  |
| `manageModules` | `Boolean` |  |
| `manageProviders` | `Boolean` |  |
| `manageRunTasks` | `Boolean` |  |
| `manageProjects` | `Boolean` |  |
| `manageMembership` | `Boolean` |  |
| `manageTeams` | `Boolean` |  |
| `manageOrganizationAccess` | `Boolean` |  |
| `accessSecretTeams` | `Boolean` |  |
| `readProjects` | `Boolean` |  |
| `readWorkspaces` | `Boolean` |  |
| `manageAgentPools` | `Boolean` |  |

---

### TeamPermissions

| Field | Type | Description |
| ----- | ---- | ----------- |
| `canUpdateMembership` | `Boolean` |  |
| `canDestroy` | `Boolean` |  |
| `canUpdateOrganizationAccess` | `Boolean` |  |
| `canUpdateApiToken` | `Boolean` |  |
| `canUpdateVisibility` | `Boolean` |  |
| `canUpdateName` | `Boolean` |  |
| `canUpdateSsoTeamId` | `Boolean` |  |
| `canUpdateMemberTokenManagement` | `Boolean` |  |
| `canViewApiToken` | `Boolean` |  |

---

### TeamToken

An API token associated with a team. Team tokens can be used to authenticate API requests on behalf of the team.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` |  |
| `teamId` | `ID!` |  |
| `createdAt` | `DateTime!` |  |
| `lastUsedAt` | `DateTime` |  |
| `description` | `String` |  |
| `token` | `String` |  |
| `expiredAt` | `DateTime` |  |
| `createdById` | `ID!` |  |

---

### User

An HCP Terraform user account. User objects contain username, avatar, and permission information but not other personal identifying details.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` |  |
| `username` | `String!` |  |
| `email` | `String` |  |
| `avatarUrl` | `String` |  |
| `isServiceAccount` | `Boolean!` |  |
| `authMethod` | `String!` |  |
| `v2Only` | `Boolean!` |  |
| `permissions` | `UserPermissions!` |  |
| `teams(includeOrgs: [String!], excludeOrgs: [String!], filter: TeamFilter)` | `[Team!]!` |  |

---

### UserPermissions

| Field | Type | Description |
| ----- | ---- | ----------- |
| `canCreateOrganizations` | `Boolean!` |  |
| `canViewSettings` | `Boolean!` |  |
| `canViewProfile` | `Boolean!` |  |
| `canChangeEmail` | `Boolean!` |  |
| `canChangeUsername` | `Boolean!` |  |
| `canChangePassword` | `Boolean!` |  |
| `canManageSessions` | `Boolean!` |  |
| `canManageSsoIdentities` | `Boolean!` |  |
| `canManageUserTokens` | `Boolean!` |  |
| `canUpdateUser` | `Boolean!` |  |
| `canReenable2faByUnlinking` | `Boolean!` |  |
| `canManageHcpAccount` | `Boolean!` |  |

---

### Variable

A key/value pair used to parameterize Terraform runs. Variables can be Terraform input variables or environment variables, and may be marked as sensitive.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` |  |
| `key` | `String!` |  |
| `value` | `String` |  |
| `sensitive` | `Boolean!` |  |
| `category` | `String!` |  |
| `hcl` | `Boolean!` |  |
| `createdAt` | `DateTime!` |  |
| `description` | `String` |  |
| `versionId` | `String` |  |
| `workspace` | `Workspace` |  |

---

### VariableSet

A reusable collection of variables that can be applied to multiple workspaces and projects across an organization. Global variable sets apply to all workspaces automatically.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` |  |
| `name` | `String!` |  |
| `description` | `String` |  |
| `global` | `Boolean!` |  |
| `updatedAt` | `DateTime!` |  |
| `varCount` | `Int!` |  |
| `workspaceCount` | `Int!` |  |
| `projectCount` | `Int!` |  |
| `priority` | `Boolean!` |  |
| `permissions` | `VariableSetPermissions!` |  |
| `organization` | `Organization` |  |
| `vars(filter: VariableFilter)` | `[Variable!]` |  |
| `workspaces(filter: WorkspaceFilter)` | `[Workspace!]` |  |
| `projects(filter: ProjectFilter)` | `[Project!]` |  |

---

### VariableSetPermissions

| Field | Type | Description |
| ----- | ---- | ----------- |
| `canUpdate` | `Boolean!` |  |

---

### Workspace

Represents running infrastructure managed by Terraform. Each workspace is associated with a Terraform configuration and maintains state, variables, and run history.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` |  |
| `name` | `String!` |  |
| `description` | `String` |  |
| `locked` | `Boolean!` |  |
| `lockedReason` | `String` |  |
| `autoApply` | `Boolean!` |  |
| `createdAt` | `DateTime!` |  |
| `updatedAt` | `DateTime!` |  |
| `applyDurationAverage` | `Int` |  |
| `planDurationAverage` | `Int` |  |
| `policyCheckFailures` | `Int` |  |
| `queueAllRuns` | `Boolean` |  |
| `resourceCount` | `Int` |  |
| `runFailures` | `Int` |  |
| `source` | `String` |  |
| `sourceName` | `String` |  |
| `sourceUrl` | `String` |  |
| `speculativeEnabled` | `Boolean` |  |
| `structuredRunOutputEnabled` | `Boolean` |  |
| `tagNames` | `[String!]!` |  |
| `terraformVersion` | `String` |  |
| `triggerPrefixes` | `[String!]!` |  |
| `vcsRepo` | `JSON` |  |
| `vcsRepoIdentifier` | `String` |  |
| `workingDirectory` | `String` |  |
| `workspaceKpisRunsCount` | `Int` |  |
| `executionMode` | `String` |  |
| `environment` | `String` |  |
| `operations` | `Boolean` |  |
| `fileTriggersEnabled` | `Boolean` |  |
| `globalRemoteState` | `Boolean` |  |
| `latestChangeAt` | `DateTime` |  |
| `lastAssessmentResultAt` | `DateTime` |  |
| `autoDestroyAt` | `DateTime` |  |
| `autoDestroyStatus` | `String` |  |
| `autoDestroyActivityDuration` | `Int` |  |
| `inheritsProjectAutoDestroy` | `Boolean` |  |
| `assessmentsEnabled` | `Boolean` |  |
| `allowDestroyPlan` | `Boolean` |  |
| `autoApplyRunTrigger` | `Boolean` |  |
| `oauthClientName` | `String` |  |
| `actions` | `WorkspaceActions` |  |
| `permissions` | `WorkspacePermissions` |  |
| `settingOverwrites` | `WorkspaceSettingOverwrites` |  |
| `organization` | `Organization` |  |
| `runs(filter: RunFilter)` | `[Run!]!` |  |
| `configurationVersions(filter: ConfigurationVersionFilter)` | `[ConfigurationVersion!]!` |  |
| `variables(filter: VariableFilter)` | `[Variable!]!` |  |
| `stateVersions(filter: StateVersionFilter)` | `[StateVersion!]!` |  |
| `currentStateVersion` | `StateVersion` |  |
| `providers` | `[WorkspaceProvider!]!` |  |
| `modules` | `[WorkspaceModule!]!` |  |
| `project` | `Project` |  |
| `appliedPolicySets(filter: PolicySetFilter)` | `[PolicySet!]!` |  |
| `currentRun` | `Run` |  |
| `teamAccess(filter: WorkspaceTeamAccessFilter)` | `[WorkspaceTeamAccess!]!` |  |
| `workspaceResources(filter: WorkspaceResourceFilter)` | `[WorkspaceResource!]!` |  |

---

### WorkspaceAccess

Workspace-level permission settings granted through project team access.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `create` | `Boolean!` |  |
| `move` | `Boolean!` |  |
| `locking` | `Boolean!` |  |
| `delete` | `Boolean!` |  |
| `runs` | `String!` |  |
| `variables` | `String!` |  |
| `stateVersions` | `String!` |  |
| `sentinelMocks` | `String!` |  |
| `runTasks` | `Boolean!` |  |

---

### WorkspaceActions

| Field | Type | Description |
| ----- | ---- | ----------- |
| `isDestroyable` | `Boolean!` |  |

---

### WorkspaceModule

| Field | Type | Description |
| ----- | ---- | ----------- |
| `name` | `String` |  |
| `version` | `String` |  |
| `source` | `String` |  |

---

### WorkspacePermissions

| Field | Type | Description |
| ----- | ---- | ----------- |
| `canUpdate` | `Boolean!` |  |
| `canDestroy` | `Boolean!` |  |
| `canQueueRun` | `Boolean!` |  |
| `canReadRun` | `Boolean!` |  |
| `canReadVariable` | `Boolean!` |  |
| `canUpdateVariable` | `Boolean!` |  |
| `canReadStateVersions` | `Boolean!` |  |
| `canReadStateOutputs` | `Boolean!` |  |
| `canCreateStateVersions` | `Boolean!` |  |
| `canQueueApply` | `Boolean!` |  |
| `canLock` | `Boolean!` |  |
| `canUnlock` | `Boolean!` |  |
| `canForceUnlock` | `Boolean!` |  |
| `canReadSettings` | `Boolean!` |  |
| `canManageTags` | `Boolean!` |  |
| `canManageRunTasks` | `Boolean!` |  |
| `canForceDelete` | `Boolean!` |  |
| `canManageAssessments` | `Boolean!` |  |
| `canManageEphemeralWorkspaces` | `Boolean!` |  |
| `canReadAssessmentResults` | `Boolean!` |  |
| `canQueueDestroy` | `Boolean!` |  |

---

### WorkspaceProvider

| Field | Type | Description |
| ----- | ---- | ----------- |
| `name` | `String` |  |
| `version` | `String` |  |
| `source` | `String` |  |

---

### WorkspaceResource

A Terraform-managed resource tracked in a workspace's state. Includes the resource address, provider, module path, and the state version that last modified it.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` |  |
| `address` | `String!` |  |
| `name` | `String!` |  |
| `createdAt` | `DateTime!` |  |
| `updatedAt` | `DateTime!` |  |
| `module` | `String!` |  |
| `provider` | `String!` |  |
| `providerType` | `String!` |  |
| `modifiedByStateVersion` | `StateVersion!` |  |
| `nameIndex` | `String` |  |
| `workspace` | `Workspace!` |  |

---

### WorkspaceRunTrigger

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` |  |
| `workspaceName` | `String!` |  |
| `sourceableName` | `String!` |  |
| `createdAt` | `DateTime!` |  |
| `workspace` | `Workspace!` |  |
| `sourceable` | `Workspace!` |  |
| `inbound` | `Boolean!` |  |

---

### WorkspaceSettingOverwrites

| Field | Type | Description |
| ----- | ---- | ----------- |
| `executionMode` | `Boolean` |  |
| `agentPool` | `Boolean` |  |

---

### WorkspaceTeamAccess

Associates a team with a workspace and defines the team's permission level for runs, variables, state, and other workspace operations.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` |  |
| `access` | `String!` |  |
| `runs` | `String!` |  |
| `variables` | `String!` |  |
| `stateVersions` | `String!` |  |
| `sentinelMocks` | `String!` |  |
| `workspaceLocking` | `Boolean!` |  |
| `runTasks` | `Boolean!` |  |
| `team` | `Team!` |  |
| `workspace` | `Workspace!` |  |

---

### AbstractRunTrigger

Inbound or outbound run-trigger connections between workspaces.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` |  |
| `workspaceName` | `String!` |  |
| `sourceableName` | `String!` |  |
| `createdAt` | `DateTime!` |  |
| `workspace` | `Workspace!` |  |
| `sourceable` | `Workspace!` |  |

---

### UserAccount

Common fields shared by regular users and admin-managed users.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` |  |
| `username` | `String!` |  |
| `email` | `String` |  |
| `avatarUrl` | `String` |  |
| `isServiceAccount` | `Boolean!` |  |
| `teams(includeOrgs: [String!], excludeOrgs: [String!], filter: TeamFilter)` | `[Team!]!` |  |

---

### ExplorerFilterOperator

| Value |
| ----- |
| `is` |
| `is_not` |
| `contains` |
| `does_not_contain` |
| `is_empty` |
| `is_not_empty` |
| `gt` |
| `lt` |
| `gteq` |
| `lteq` |
| `is_before` |
| `is_after` |

---

### ExplorerModuleField

| Value |
| ----- |
| `name` |
| `source` |
| `version` |
| `workspace_count` |
| `workspaces` |

---

### ExplorerProviderField

| Value |
| ----- |
| `name` |
| `source` |
| `version` |
| `workspace_count` |
| `workspaces` |

---

### ExplorerTerraformVersionField

| Value |
| ----- |
| `version` |
| `workspace_count` |
| `workspaces` |

---

### ExplorerWorkspaceField

| Value |
| ----- |
| `all_checks_succeeded` |
| `current_rum_count` |
| `checks_errored` |
| `checks_failed` |
| `checks_passed` |
| `checks_unknown` |
| `current_run_applied_at` |
| `current_run_external_id` |
| `current_run_status` |
| `drifted` |
| `external_id` |
| `module_count` |
| `modules` |
| `organization_name` |
| `project_external_id` |
| `project_name` |
| `provider_count` |
| `providers` |
| `resources_drifted` |
| `resources_undrifted` |
| `state_version_terraform_version` |
| `tags` |
| `vcs_repo_identifier` |
| `workspace_created_at` |
| `workspace_name` |
| `workspace_terraform_version` |
| `workspace_updated_at` |

---

### LogLevel

| Value |
| ----- |
| `TRACE` |
| `DEBUG` |
| `INFO` |
| `WARN` |
| `ERROR` |
| `JSON` |

---

### MetricFormat

| Value |
| ----- |
| `PROMETHEUS` |
| `OPENMETRICS` |

---

### TF_LOG_CATEGORY

| Value |
| ----- |
| `JSON` |
| `TRACE` |
| `DEBUG` |
| `INFO` |
| `WARN` |
| `ERROR` |

---

