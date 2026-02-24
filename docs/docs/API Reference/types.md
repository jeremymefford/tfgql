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
| `id` | `ID!` | The user's unique identifier. |
| `username` | `String!` | The user's login name. |
| `email` | `String` | The user's email address. |
| `avatarUrl` | `String` | URL to the user's Gravatar profile image. |
| `isServiceAccount` | `Boolean!` | Whether this is a synthetic service account rather than a human user. |
| `isAdmin` | `Boolean!` | Whether the user has site administrator privileges. |
| `isSuspended` | `Boolean!` | Whether the user account is currently suspended. |
| `organizations` | `[Organization!]!` | Organizations this user belongs to. |
| `teams(includeOrgs: [String!], excludeOrgs: [String!], filter: TeamFilter)` | `[Team!]!` | Teams the user belongs to across organizations. |

---

### Agent

A Terraform Cloud agent that executes runs on isolated, private, or on-premises infrastructure. Agents connect to HCP Terraform and are organized into agent pools.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` | The agent's unique identifier. |
| `name` | `String` | The agent's display name. |
| `status` | `String!` | Current state of the agent: 'idle', 'busy', 'unknown', 'exited', or 'errored'. |
| `ipAddress` | `String!` | The agent's IP address. |
| `lastPingAt` | `DateTime!` | Timestamp of the most recent communication from the agent. |

---

### AgentPool

A group of agents, often sharing a common network segment or purpose. Workspaces can be configured to use an agent pool for remote operations with isolated infrastructure.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` | The agent pool's unique identifier. |
| `type` | `String!` | The resource type identifier. |
| `name` | `String!` | The agent pool name. Must be unique per organization. |
| `createdAt` | `DateTime!` | Timestamp when the agent pool was created. |
| `organizationScoped` | `Boolean!` | When true, all workspaces in the organization can use this agent pool. |
| `organizationName` | `String` | The name of the organization this agent pool belongs to. |
| `agentCount` | `Int!` | Number of agents in idle, busy, or unknown states. |
| `workspaces(filter: WorkspaceFilter)` | `[Workspace!]!` | Workspaces currently configured to use this agent pool. |
| `allowedWorkspaces(filter: WorkspaceFilter)` | `[Workspace!]!` | Workspaces explicitly allowed to use this agent pool. |
| `agents(filter: AgentFilter)` | `[Agent!]!` | Agents registered in this pool. |
| `authenticationTokens(filter: AgentTokenFilter)` | `[AgentToken!]!` | Authentication tokens used by agents to connect to this pool. |

---

### AgentToken

An authentication token used by agents to register with an agent pool.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` | The agent token's unique identifier. |
| `poolId` | `String` | The ID of the agent pool this token belongs to. |
| `createdAt` | `DateTime!` | Timestamp when the token was created. |
| `lastUsedAt` | `DateTime` | Timestamp when the token was last used, or null if never used. |
| `description` | `String!` | A text label describing the token's purpose. |
| `createdById` | `ID!` | The ID of the user who created this token. |

---

### Apply

Represents the results of applying a Terraform run's execution plan. Contains resource change counts, status, and log output.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` | The apply's unique identifier. |
| `mode` | `String` | Execution mode: 'remote' or 'agent'. |
| `status` | `String!` | Current state of the apply (e.g., pending, queued, running, finished, errored, canceled). |
| `queuedAt` | `DateTime` | Timestamp when the apply was queued. |
| `startedAt` | `DateTime` | Timestamp when apply execution began. |
| `finishedAt` | `DateTime` | Timestamp when apply execution completed. |
| `logReadUrl` | `String!` | Temporary authenticated URL for streaming apply log output. |
| `applyLog(minimumLevel: LogLevel)` | `[JSON!]` | Structured apply log output, filtered by minimum log level. |
| `structuredRunOutputEnabled` | `Boolean!` | Whether structured (JSON) run output is enabled. |
| `resourceAdditions` | `Int` | Count of resources that were created. |
| `resourceChanges` | `Int` | Count of resources that were modified. |
| `resourceDestructions` | `Int` | Count of resources that were removed. |
| `resourceImports` | `Int` | Count of resources that were imported. |
| `stateVersions(filter: StateVersionFilter)` | `[StateVersion!]!` | State versions produced by this apply. |

---

### AssessmentResult

The result of a health assessment for a workspace, including drift detection and continuous validation status.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` | The assessment result's unique identifier. |
| `drifted` | `Boolean!` | Whether infrastructure drift was detected during the health assessment. |
| `succeeded` | `Boolean!` | Whether the assessment execution completed successfully. |
| `errorMessage` | `String` | Error details if the assessment failed, or null if no errors occurred. |
| `createdAt` | `DateTime!` | Timestamp when the assessment was performed. |

---

### Comment

A comment left on a Terraform run. Comments appear in the run timeline and can be used for review discussions.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` | The comment's unique identifier. |
| `body` | `String!` | The text content of the comment. |
| `runEventId` | `ID` | The ID of the run event this comment is associated with. |

---

### ConfigurationVersion

A snapshot of Terraform configuration files uploaded to a workspace. Each run is associated with a configuration version that provides the code to plan and apply.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` | The configuration version's unique identifier. |
| `autoQueueRuns` | `Boolean!` | When true, runs are queued automatically upon upload. |
| `error` | `String` | Error code if the configuration version failed processing. |
| `errorMessage` | `String` | Human-readable error message if the configuration version failed processing. |
| `provisional` | `Boolean!` | When true, this configuration version does not immediately become the workspace's current version. |
| `source` | `String` | The origin of the configuration (e.g., 'tfe-api', 'gitlab', 'github'). |
| `speculative` | `Boolean!` | When true, this configuration version can only create speculative (plan-only) runs. |
| `status` | `String!` | Current processing state (pending, fetching, uploaded, archived, errored). |
| `statusTimestamps` | `ConfigurationVersionStatusTimestamps` | Timestamps for each status transition. |
| `changedFiles` | `[String!]!` | List of files that changed in this configuration version. |
| `ingressAttributes` | `IngressAttributes` | VCS commit metadata for VCS-sourced configurations. |
| `size` | `Int` | The size of the configuration archive in bytes. |
| `downloadUrl` | `String` | URL to download the configuration archive. |

---

### ConfigurationVersionStatusTimestamps

Timestamps recording when a configuration version transitioned between processing states.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `archivedAt` | `DateTime` | Timestamp when the configuration version was archived. |
| `fetchingAt` | `DateTime` | Timestamp when HCP Terraform began fetching files from VCS. |
| `uploadedAt` | `DateTime` | Timestamp when the configuration was fully uploaded and processed. |

---

### ExplorerModuleRow

A row from the Explorer API grouping workspaces by Terraform module.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `name` | `String` | The module's display name. |
| `source` | `String` | The module's source location. |
| `version` | `String` | The semantic version string for this module. |
| `workspaceCount` | `Int` | Number of workspaces using this module version. |
| `workspaces` | `String` | Comma-separated list of workspace names using this module version. |
| `organization` | `Organization` | The resolved Organization entity. |
| `workspaceEntities(filter: WorkspaceFilter)` | `[Workspace!]!` | Resolved Workspace entities using this module, with optional filtering. |

---

### ExplorerProviderRow

A row from the Explorer API grouping workspaces by Terraform provider.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `name` | `String` | The provider's display name. |
| `source` | `String` | The provider's source address. |
| `version` | `String` | The semantic version string for this provider. |
| `workspaceCount` | `Int` | Number of workspaces using this provider. |
| `workspaces` | `String` | Comma-separated list of workspace names using this provider. |
| `organization` | `Organization` | The resolved Organization entity. |
| `workspaceEntities(filter: WorkspaceFilter)` | `[Workspace!]!` | Resolved Workspace entities using this provider, with optional filtering. |

---

### ExplorerTerraformVersionRow

A row from the Explorer API grouping workspaces by Terraform version.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `version` | `String` | The semantic version string for this Terraform version. |
| `workspaceCount` | `Int` | Number of workspaces using this Terraform version. |
| `workspaces` | `String` | Comma-separated list of workspace names using this version. |
| `organization` | `Organization` | The resolved Organization entity. |
| `workspaceEntities(filter: WorkspaceFilter)` | `[Workspace!]!` | Resolved Workspace entities using this Terraform version, with optional filtering. |

---

### ExplorerWorkspaceRow

A denormalized row from the HCP Terraform Explorer API representing a workspace with inline metadata about its current run, drift status, checks, providers, and modules.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `allChecksSucceeded` | `Boolean` | True if all health checks have succeeded for the workspace. |
| `currentRumCount` | `Int` | Count of managed resources (Resources Under Management) in the workspace. |
| `checksErrored` | `Int` | Number of health checks that errored without completing. |
| `checksFailed` | `Int` | Number of health checks that completed but did not pass. |
| `checksPassed` | `Int` | Number of health checks that passed. |
| `checksUnknown` | `Int` | Number of health checks that could not be assessed. |
| `currentRunAppliedAt` | `DateTime` | Timestamp when the workspace's current run was applied. |
| `currentRunExternalId` | `String` | The external identifier of the workspace's current run. |
| `currentRunStatus` | `String` | The execution status of the workspace's current run. |
| `drifted` | `Boolean` | True if infrastructure drift has been detected for the workspace. |
| `externalId` | `String` | The workspace's external identifier. |
| `moduleCount` | `Int` | Number of distinct Terraform modules used in the workspace. |
| `modules` | `String` | Comma-separated list of modules used by this workspace. |
| `organizationName` | `String` | The name of the workspace's parent organization. |
| `projectExternalId` | `String` | The external identifier of the workspace's project. |
| `projectName` | `String` | The display name of the workspace's project. |
| `providerCount` | `Int` | Number of distinct Terraform providers used in the workspace. |
| `providers` | `String` | Comma-separated list of providers used in this workspace. |
| `resourcesDrifted` | `Int` | Number of resources with detected drift. |
| `resourcesUndrifted` | `Int` | Number of resources without drift. |
| `stateVersionTerraformVersion` | `String` | The Terraform version used to create the current state. |
| `tags` | `String` | Comma-separated list of tags applied to the workspace. |
| `vcsRepoIdentifier` | `String` | The VCS repository identifier, if the workspace is VCS-connected. |
| `workspaceCreatedAt` | `DateTime` | Timestamp when the workspace was created. |
| `workspaceName` | `String` | The workspace's display name. |
| `workspaceTerraformVersion` | `String` | The Terraform version configured for the workspace. |
| `workspaceUpdatedAt` | `DateTime` | Timestamp when the workspace was last modified. |
| `workspace` | `Workspace` | The resolved Workspace entity for this row. |
| `project` | `Project` | The resolved Project entity for this row. |
| `currentRun` | `Run` | The resolved Run entity for the current run. |
| `organization` | `Organization` | The resolved Organization entity for this row. |

---

### IngressAttributes

Commit metadata for VCS-based configuration versions.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` | The ingress attributes' unique identifier. |
| `branch` | `String` | The VCS branch the configuration was sourced from. |
| `cloneUrl` | `String` | The URL used to clone the VCS repository. |
| `commitMessage` | `String` | The commit message from the VCS commit. |
| `commitSha` | `String` | The SHA hash of the VCS commit. |
| `commitUrl` | `String` | A URL linking to the VCS commit. |
| `compareUrl` | `String` | A URL linking to the VCS comparison/diff view. |
| `identifier` | `String` | The VCS repository identifier in :org/:repo format. |
| `isPullRequest` | `Boolean` | Whether this configuration was triggered by a pull request. |
| `onDefaultBranch` | `Boolean` | Whether the commit is on the repository's default branch. |
| `pullRequestNumber` | `Int` | The pull request number, if triggered by a PR. |
| `pullRequestUrl` | `String` | A URL linking to the pull request, if triggered by a PR. |
| `pullRequestTitle` | `String` | The title of the pull request, if triggered by a PR. |
| `pullRequestBody` | `String` | The body/description of the pull request, if triggered by a PR. |
| `tag` | `String` | The VCS tag that triggered this configuration, if applicable. |
| `senderUsername` | `String` | The VCS username of the person who triggered the configuration. |
| `senderAvatarUrl` | `String` | The avatar URL of the person who triggered the configuration. |
| `senderHtmlUrl` | `String` | The profile URL of the person who triggered the configuration. |
| `createdBy` | `String` | The username or system that created this configuration version. |

---

### Organization

A shared space for teams to collaborate on workspaces in HCP Terraform. Organizations manage access, settings, and billing.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` | The organization's unique identifier. |
| `name` | `String!` | The organization name. |
| `externalId` | `String!` | External identifier for the organization. |
| `email` | `String!` | Admin notification email address for the organization. |
| `createdAt` | `DateTime!` | Timestamp when the organization was created. |
| `sessionTimeout` | `Int` | Session timeout after inactivity, in minutes. |
| `sessionRemember` | `Int` | Session expiration duration, in minutes. |
| `collaboratorAuthPolicy` | `String!` | Authentication policy for the organization. Either 'password' or 'two_factor_mandatory'. |
| `planExpired` | `Boolean!` | Whether the current subscription plan has expired. |
| `planExpiresAt` | `DateTime` | Timestamp when the subscription plan expires. |
| `planIsTrial` | `Boolean` | Whether the organization is on a trial plan. |
| `planIsEnterprise` | `Boolean` | Whether the organization is on an enterprise plan. |
| `planIdentifier` | `String` | The identifier of the current subscription plan tier. |
| `costEstimationEnabled` | `Boolean!` | Whether cost estimation is available for the organization. |
| `sendPassingStatusesForUntriggeredSpeculativePlans` | `Boolean!` | Whether VCS status updates are sent for untriggered speculative plans. |
| `aggregatedCommitStatusEnabled` | `Boolean!` | Whether to aggregate VCS commit statuses for triggered workspaces. |
| `speculativePlanManagementEnabled` | `Boolean!` | Whether automatic cancellation of plan-only runs is enabled. |
| `allowForceDeleteWorkspaces` | `Boolean!` | Whether workspace admins can delete workspaces that still have managed resources. |
| `fairRunQueuingEnabled` | `Boolean!` | Whether fair run queue scheduling is enabled. |
| `samlEnabled` | `Boolean!` | Whether SAML single sign-on is enabled for the organization. |
| `ownersTeamSamlRoleId` | `String` | The SAML role ID mapped to the owners team. |
| `twoFactorConformant` | `Boolean!` | Whether the organization complies with two-factor authentication requirements. |
| `assessmentsEnforced` | `Boolean!` | Whether health assessments are enforced for all eligible workspaces. |
| `defaultExecutionMode` | `String!` | Default execution mode for new workspaces: 'remote', 'local', or 'agent'. |
| `permissions` | `OrganizationPermissions!` | Permissions the current user has on this organization. |
| `workspaces(filter: WorkspaceFilter)` | `[Workspace!]` | Workspaces belonging to this organization, with optional filtering. |
| `teams(filter: TeamFilter)` | `[Team!]` | Teams within this organization, with optional filtering. |
| `users(filter: UserFilter)` | `[User!]` | Users who are members of this organization, with optional filtering. |
| `variableSets(filter: VariableSetFilter)` | `[VariableSet!]` | Variable sets defined in this organization, with optional filtering. |
| `memberships(filter: OrganizationMembershipFilter)` | `[OrganizationMembership!]!` | Organization memberships (user invitations and active members). |
| `tags(filter: OrganizationTagFilter)` | `[OrganizationTag!]!` | Tags defined in this organization for classifying workspaces. |
| `policySets(filter: PolicySetFilter)` | `[PolicySet!]` | Policy sets configured in this organization. |
| `usersFromAdmin(filter: UserFilter)` | `[AdminUser!]` | Users retrieved via the Terraform Enterprise admin API. Only available on TFE. |
| `projects(filter: ProjectFilter)` | `[Project!]` | Projects within this organization, with optional filtering. |

---

### OrganizationMembership

Represents a user's membership in an organization. Users are added by invitation and become members once accepted.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` | The membership's unique identifier. |
| `status` | `String!` | The membership status: 'invited' or 'active'. |
| `organizationId` | `ID!` | The ID of the organization. |
| `userId` | `ID!` | The ID of the member user. |
| `teamIds` | `[ID!]!` | IDs of teams the member belongs to within the organization. |

---

### OrganizationPermissions

Permissions the current API token has on an organization, controlling which management operations are allowed.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `canUpdate` | `Boolean!` | Whether the current user can modify organization settings. |
| `canDestroy` | `Boolean!` | Whether the current user can delete the organization. |
| `canAccessViaTeams` | `Boolean!` | Whether the current user accesses the organization through team membership. |
| `canCreateModule` | `Boolean!` | Whether the current user can publish private registry modules. |
| `canCreateTeam` | `Boolean!` | Whether the current user can create new teams. |
| `canCreateWorkspace` | `Boolean!` | Whether the current user can create new workspaces. |
| `canManageUsers` | `Boolean!` | Whether the current user can manage organization user memberships. |
| `canManageSubscription` | `Boolean!` | Whether the current user can manage the organization subscription. |
| `canManageSso` | `Boolean!` | Whether the current user can configure single sign-on settings. |
| `canUpdateOauth` | `Boolean!` | Whether the current user can manage OAuth client connections. |
| `canUpdateSentinel` | `Boolean!` | Whether the current user can manage Sentinel policy configuration. |
| `canUpdateSshKeys` | `Boolean!` | Whether the current user can manage SSH keys. |
| `canUpdateApiToken` | `Boolean!` | Whether the current user can manage the organization API token. |
| `canTraverse` | `Boolean!` | Whether the current user can traverse (list) the organization. |
| `canStartTrial` | `Boolean!` | Whether the current user can start a trial plan. |
| `canUpdateAgentPools` | `Boolean!` | Whether the current user can manage agent pools. |
| `canManageTags` | `Boolean!` | Whether the current user can manage organization tags. |
| `canManageVarsets` | `Boolean!` | Whether the current user can manage variable sets. |
| `canReadVarsets` | `Boolean!` | Whether the current user can view variable sets. |
| `canManagePublicProviders` | `Boolean!` | Whether the current user can manage public provider listings. |
| `canCreateProvider` | `Boolean!` | Whether the current user can create private providers. |
| `canManagePublicModules` | `Boolean!` | Whether the current user can manage public module listings. |
| `canManageCustomProviders` | `Boolean!` | Whether the current user can manage custom provider configurations. |
| `canManageRunTasks` | `Boolean!` | Whether the current user can manage run task configurations. |
| `canReadRunTasks` | `Boolean!` | Whether the current user can view run task configurations. |
| `canCreateProject` | `Boolean!` | Whether the current user can create new projects. |

---

### OrganizationTag

A tag used to classify and organize workspaces within an organization. Tags can be applied to multiple workspaces and used for filtering.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` | The tag's unique identifier. |
| `name` | `String!` | The tag name. Can include letters, numbers, colons, hyphens, and underscores (max 255 characters). |
| `createdAt` | `DateTime!` | Timestamp when the tag was created. |
| `instanceCount` | `Int!` | Number of workspaces this tag is applied to. |

---

### Plan

Represents the execution plan of a run in a Terraform workspace. Contains resource change counts, status, and optional structured JSON output.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` | The plan's unique identifier. |
| `mode` | `String!` | Execution mode: 'remote' or 'agent'. |
| `agentId` | `ID` | Identifier of the agent executing this plan, when using agent execution mode. |
| `agentName` | `String` | Human-readable name of the agent executing this plan. |
| `agentPoolId` | `ID` | Identifier of the agent pool used for this plan. |
| `agentPoolName` | `String` | Name of the agent pool used for this plan. |
| `generatedConfiguration` | `Boolean!` | Whether Terraform auto-generated configuration during import. |
| `hasChanges` | `Boolean!` | Whether the plan detected any infrastructure changes. |
| `resourceAdditions` | `Int!` | Count of resources to be created. |
| `resourceChanges` | `Int!` | Count of resources to be modified. |
| `resourceDestructions` | `Int!` | Count of resources to be removed. |
| `resourceImports` | `Int!` | Count of resources to be imported. |
| `status` | `String!` | Current state of the plan (e.g., pending, queued, running, finished, errored, canceled). |
| `logReadUrl` | `String!` | Temporary authenticated URL for streaming plan log output. |
| `planLog(minimumLevel: LogLevel)` | `[JSON!]` | Structured plan log output, filtered by minimum log level. |
| `planExportDownloadUrl` | `String` | URL to download the exported plan file. |
| `structuredRunOutputEnabled` | `Boolean!` | Whether structured (JSON) run output is enabled. |
| `jsonOutputUrl` | `String` | URL to download the plan's JSON output, if structured output is enabled. |
| `jsonOutputRedacted` | `String` | Redacted JSON plan output with sensitive values removed. |
| `jsonSchema` | `String` | JSON provider schema associated with this plan. |
| `agentQueuedAt` | `DateTime` | Timestamp when the plan was queued on an agent. |
| `pendingAt` | `DateTime` | Timestamp when the plan entered pending state. |
| `startedAt` | `DateTime` | Timestamp when plan execution began. |
| `finishedAt` | `DateTime` | Timestamp when plan execution completed. |

---

### Policy

A Sentinel or OPA policy that enforces rules during Terraform runs. Policies are organized into policy sets and have configurable enforcement levels.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` | The policy's unique identifier. |
| `name` | `String!` | The policy name. Contains letters, numbers, hyphens, and underscores. Immutable after creation. |
| `description` | `String` | A text description of the policy's purpose. |
| `kind` | `String!` | The policy framework type: 'sentinel' or 'opa'. |
| `query` | `String` | The OPA query to execute. Only applicable to OPA policies. |
| `enforcementLevel` | `String!` | The enforcement level. Sentinel: 'hard-mandatory', 'soft-mandatory', or 'advisory'. OPA: 'mandatory' or 'advisory'. |
| `policySetCount` | `Int!` | Number of policy sets this policy belongs to. |
| `updatedAt` | `DateTime` | Timestamp when the policy was last modified. |

---

### PolicyCheck

The result of a Sentinel policy check performed during a run. Contains the overall status, scope, and detailed result data including pass/fail outcomes.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` | The policy check's unique identifier. |
| `status` | `String!` | Current state of the policy check (e.g., 'passed', 'soft_failed', 'hard_failed', 'overridden'). |
| `scope` | `String!` | The scope of the policy check (e.g., 'organization'). |
| `result` | `JSON!` | Detailed result object containing pass/fail counts and policy outcomes. |
| `sentinel` | `JSON` | Low-level Sentinel engine details generated during policy evaluation. |
| `statusTimestamps` | `PolicyCheckStatusTimestamps!` | Timestamps for each policy check status transition. |
| `permissions` | `PolicyCheckPermissions!` | Permissions the current user has on this policy check. |
| `actions` | `PolicyCheckActions!` | Available actions for this policy check based on its current state. |
| `createdAt` | `DateTime` | Timestamp when the policy check was created. |
| `finishedAt` | `DateTime` | Timestamp when the policy check completed. |
| `outputUrl` | `String` | URL to retrieve detailed policy check output. |
| `run` | `Run!` | The run this policy check was performed on. |

---

### PolicyCheckActions

Available actions for a policy check based on its current state.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `isOverridable` | `Boolean!` | Whether this policy check can be overridden. |

---

### PolicyCheckPermissions

Permissions the current user has on a policy check.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `canOverride` | `Boolean!` | Whether the current user can override this policy check. |

---

### PolicyCheckStatusTimestamps

Timestamps for each policy check status transition.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `queuedAt` | `DateTime` | Timestamp when the policy check was queued. |
| `passedAt` | `DateTime` | Timestamp when the policy check passed. |
| `hardFailedAt` | `DateTime` | Timestamp when a hard-mandatory policy failure occurred. |
| `softFailedAt` | `DateTime` | Timestamp when a soft-mandatory policy failure occurred. |
| `advisoryFailedAt` | `DateTime` | Timestamp when an advisory policy failure occurred. |
| `overriddenAt` | `DateTime` | Timestamp when the policy check was overridden. |

---

### PolicyEvaluation

An OPA or Sentinel policy evaluation performed during a run's task stage. Contains aggregated result counts and individual policy set outcomes.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` | The policy evaluation's unique identifier. |
| `status` | `String!` | Current state of the evaluation (e.g., 'passed', 'failed', 'errored'). |
| `policyKind` | `String!` | The policy engine type: 'sentinel' or 'opa'. |
| `resultCount` | `PolicyEvaluationResultCount!` | Aggregated pass/fail/error counts across all policies in this evaluation. |
| `statusTimestamps` | `PolicyEvaluationStatusTimestamps!` | Timestamps for each evaluation status transition. |
| `createdAt` | `DateTime!` | Timestamp when the evaluation was created. |
| `updatedAt` | `DateTime!` | Timestamp when the evaluation was last modified. |
| `policyAttachableId` | `ID` | The ID of the task stage this evaluation is attached to. |
| `policySetOutcomes` | `[PolicySetOutcome!]!` | Individual policy set outcomes from this evaluation. |

---

### PolicyEvaluationResultCount

Counts of policy evaluation results, grouped by outcome.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `advisoryFailed` | `Int!` | Count of policies that failed at the advisory level. |
| `errored` | `Int!` | Count of policies that encountered errors during evaluation. |
| `mandatoryFailed` | `Int!` | Count of policies that failed at the mandatory level. |
| `passed` | `Int!` | Count of policies that passed evaluation. |

---

### PolicyEvaluationStatusTimestamps

Timestamps for each policy evaluation status transition.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `queuedAt` | `DateTime` | Timestamp when the evaluation was queued. |
| `runningAt` | `DateTime` | Timestamp when evaluation execution began. |
| `passedAt` | `DateTime` | Timestamp when the evaluation completed successfully. |
| `erroredAt` | `DateTime` | Timestamp when the evaluation encountered an error. |

---

### PolicySet

A collection of policies that can be applied to Terraform Cloud workspaces.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` | The policy set's unique identifier. |
| `name` | `String!` | The name of the policy set. Can include letters, numbers, hyphens, and underscores. |
| `description` | `String` | A text description of the policy set's purpose. |
| `kind` | `String!` | The policy framework type: 'sentinel' or 'opa'. |
| `global` | `Boolean!` | When true, the policy set is automatically applied to all workspaces in the organization. |
| `agentEnabled` | `Boolean!` | Whether agent-based policy evaluation is enabled (Sentinel only). |
| `policyToolVersion` | `String!` | The version of the policy evaluation tool (Sentinel or OPA). |
| `overridable` | `Boolean!` | Whether users can override failed policies in this set. |
| `workspaceCount` | `Int!` | Number of workspaces this policy set is applied to. |
| `projectCount` | `Int!` | Number of projects this policy set is applied to. |
| `policyCount` | `Int` | Number of policies in this policy set. |
| `policiesPath` | `String` | Subdirectory path within the VCS repository containing the policies. |
| `versioned` | `Boolean!` | Whether the policy set is versioned through VCS. |
| `vcsRepo` | `PolicySetVcsRepo` | VCS repository configuration for sourcing policies. |
| `createdAt` | `DateTime!` | Timestamp when the policy set was created. |
| `updatedAt` | `DateTime!` | Timestamp when the policy set was last modified. |
| `organization` | `Organization!` | The organization this policy set belongs to. |
| `policies(filter: PolicyFilter)` | `[Policy!]!` | Individual policies contained in this policy set. |
| `projects(filter: ProjectFilter)` | `[Project!]!` | Projects this policy set is applied to. |
| `workspaces(filter: WorkspaceFilter)` | `[Workspace!]!` | Workspaces this policy set is applied to. |
| `workspaceExclusions(filter: WorkspaceFilter)` | `[Workspace!]!` | Workspaces explicitly excluded from this policy set. |
| `parameters(filter: PolicySetParameterFilter)` | `[PolicySetParameter!]!` | Parameters passed to the policy runtime during evaluation. |

---

### PolicySetOutcome

The evaluation result of a single policy set, including individual policy outcomes and override status.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` | The policy set outcome's unique identifier. |
| `outcomes` | `JSON` | Detailed individual policy outcomes as a JSON object. |
| `error` | `String` | Error message if the policy set evaluation failed. |
| `warnings` | `[JSON!]!` | Warning messages generated during policy set evaluation. |
| `overridable` | `Boolean!` | Whether the failed policies in this set can be overridden. |
| `policySetName` | `String!` | The name of the policy set that was evaluated. |
| `policySetDescription` | `String` | The description of the policy set that was evaluated. |
| `resultCount` | `PolicySetOutcomeResultCount!` | Aggregated pass/fail/error counts for policies in this set. |

---

### PolicySetOutcomeResultCount

Counts of policy outcomes within a single policy set evaluation.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `advisoryFailed` | `Int!` | Count of policies that failed at the advisory level within this policy set. |
| `mandatoryFailed` | `Int!` | Count of policies that failed at the mandatory level within this policy set. |
| `passed` | `Int!` | Count of policies that passed within this policy set. |
| `errored` | `Int!` | Count of policies that errored within this policy set. |

---

### PolicySetParameter

A key/value pair sent to the Sentinel runtime during policy checks. Parameters help avoid hardcoding sensitive values into policies.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` | The parameter's unique identifier. |
| `key` | `String!` | The parameter name. |
| `value` | `String` | The parameter value. Returns null for sensitive parameters. |
| `sensitive` | `Boolean!` | Whether the parameter value is sensitive and write-only. |
| `category` | `String!` | The parameter category: 'policy-set'. |

---

### PolicySetVcsRepo

VCS repository configuration for a policy set.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `branch` | `String` | The VCS branch to source policies from. Uses the default branch if empty. |
| `identifier` | `String!` | The VCS repository path in :org/:repo format. |
| `ingressSubmodules` | `Boolean!` | Whether to clone repository submodules. |
| `oauthTokenId` | `String` | The OAuth token identifier used for VCS authentication. |
| `githubAppInstallationId` | `String` | The GitHub App installation ID, as an alternative to OAuth. |

---

### Project

A container for organizing workspaces within an organization. Projects group related workspaces and control team access at a higher level.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` | The project's unique identifier. |
| `name` | `String!` | The project name. Can contain letters, numbers, spaces, hyphens, and underscores. |
| `description` | `String` | A text description of the project's purpose (max 256 characters). |
| `createdAt` | `DateTime` | Timestamp when the project was created. |
| `workspaceCount` | `Int` | Number of workspaces within this project. |
| `teamCount` | `Int` | Number of teams with access to this project. |
| `stackCount` | `Int` | Number of stacks within this project. |
| `autoDestroyActivityDuration` | `String` | Inactivity duration (e.g., '14d', '2h') before workspaces are scheduled for auto-destroy. |
| `defaultExecutionMode` | `String` | Default execution mode for workspaces in this project: 'remote', 'local', or 'agent'. |
| `settingOverwrites` | `SettingOverwrites` | Indicates which settings are overridden at the project level rather than inherited from the organization. |
| `permissions` | `ProjectPermissions` | Permissions the current user has on this project. |
| `organization` | `Organization` | The parent organization containing this project. |
| `workspaces(filter: WorkspaceFilter)` | `[Workspace!]!` | Workspaces belonging to this project, with optional filtering. |
| `teams(filter: TeamFilter)` | `[Team!]!` | Teams with access to this project, with optional filtering. |
| `variableSets(filter: VariableSetFilter)` | `[VariableSet!]!` | Variable sets applied to this project, with optional filtering. |
| `teamAccess(filter: ProjectTeamAccessFilter)` | `[ProjectTeamAccess!]!` | Team access grants for this project. |

---

### ProjectAccess

Project-level permission settings for a team.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `settings` | `String!` | Permission level for project settings: 'read', 'update', or 'delete'. |
| `teams` | `String!` | Permission level for managing project teams: 'none', 'read', or 'manage'. |

---

### ProjectPermissions

Permissions the current API token has on a project, controlling which operations are allowed.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `canRead` | `Boolean` | Whether the current user can view this project. |
| `canUpdate` | `Boolean` | Whether the current user can modify this project. |
| `canDestroy` | `Boolean` | Whether the current user can delete this project. |
| `canCreateWorkspace` | `Boolean` | Whether the current user can create workspaces within this project. |
| `canMoveWorkspace` | `Boolean` | Whether the current user can move workspaces into or out of this project. |
| `canMoveStack` | `Boolean` | Whether the current user can move Stacks between projects. |
| `canDeployNoCodeModules` | `Boolean` | Whether the current user can deploy no-code modules in this project. |
| `canReadTeams` | `Boolean` | Whether the current user can view teams with access to this project. |
| `canManageTags` | `Boolean` | Whether the current user can manage tags on this project. |
| `canManageTeams` | `Boolean` | Whether the current user can manage team access on this project. |
| `canManageInHcp` | `Boolean` | Whether the current user can manage this project in HCP. |
| `canManageEphemeralWorkspaceForProjects` | `Boolean` | Whether the current user can manage ephemeral workspaces for this project. |
| `canManageVarsets` | `Boolean` | Whether the current user can manage variable sets on this project. |

---

### ProjectTeamAccess

Associates a team with a project and defines the team's permission level for project settings, teams, and workspace operations within the project.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` | The project team access grant's unique identifier. |
| `access` | `String!` | The permission level: 'read', 'write', 'maintain', 'admin', or 'custom'. |
| `projectAccess` | `ProjectAccess!` | Project-level permission settings for this team. |
| `workspaceAccess` | `WorkspaceAccess!` | Workspace-level permission settings granted through this project access. |
| `project` | `Project!` | The project this access grant applies to. |
| `team` | `Team!` | The team this access grant is for. |

---

### PrometheusMetricSample

A single metric data point with its name, label set, and numeric value.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `name` | `String!` |  |
| `labels` | `JSON!` |  |
| `value` | `Float` |  |

---

### PrometheusResult

The result of a Prometheus metrics query, containing both raw exposition text and structured samples.

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
| `id` | `ID!` | The run's unique identifier. |
| `status` | `String!` | Current state of the run (e.g., pending, planning, planned, applying, applied, errored, canceled). |
| `message` | `String` | A custom message associated with the run, typically describing its purpose. |
| `isDestroy` | `Boolean!` | Whether this run is a destroy plan that removes all provisioned resources. |
| `createdAt` | `DateTime!` | Timestamp when the run was created. |
| `canceledAt` | `DateTime` | Timestamp when the run was canceled, if applicable. |
| `hasChanges` | `Boolean!` | Whether the plan detected any infrastructure changes. |
| `autoApply` | `Boolean!` | Whether the run will automatically apply on a successful plan. |
| `allowEmptyApply` | `Boolean!` | Whether Terraform can apply the run even when the plan contains no changes. |
| `allowConfigGeneration` | `Boolean!` | Whether Terraform can generate resource configuration during import operations. |
| `planOnly` | `Boolean!` | Whether this is a speculative plan-only run that cannot be applied. |
| `source` | `String!` | The origin of the run (e.g., tfe-ui, tfe-api, tfe-configuration-version). |
| `statusTimestamps` | `RunStatusTimestamps` | Timestamps for run status transitions. |
| `triggerReason` | `String!` | The reason the run was initiated (e.g., manual, VCS push, run trigger). |
| `targetAddrs` | `[String!]` | Optional list of resource addresses targeted with the -target flag. |
| `replaceAddrs` | `[String!]` | Optional list of resource addresses targeted with the -replace flag. |
| `permissions` | `RunPermissions!` | Permissions the current user has on this run. |
| `actions` | `RunActions!` | Available actions for this run based on its current state. |
| `refresh` | `Boolean!` | Whether the run refreshes state before planning. |
| `refreshOnly` | `Boolean!` | When true, the run refreshes state without modifying resources. |
| `savePlan` | `Boolean!` | Whether this is a saved plan run for later confirmation. |
| `variables` | `[String!]!` | Run-specific variable values passed to this execution. |
| `workspace` | `Workspace` | The workspace this run belongs to. |
| `configurationVersion` | `ConfigurationVersion` | The configuration version used for this run. |
| `apply` | `Apply` | The apply phase of this run, if one exists. |
| `comments(filter: CommentFilter)` | `[Comment!]!` | Comments left on this run. |
| `runEvents` | `[RunEvent!]!` | Events recorded during this run's lifecycle. |
| `runTriggers(filter: RunTriggerFilter)` | `[RunTrigger!]!` | Run triggers associated with this run. |
| `plan` | `Plan` | The plan phase of this run. |
| `policyEvaluations(filter: PolicyEvaluationFilter)` | `[PolicyEvaluation!]!` | OPA/Sentinel policy evaluations performed during this run. |
| `policyChecks(filter: PolicyCheckFilter)` | `[PolicyCheck!]!` | Sentinel policy checks performed during this run. |

---

### RunActions

Available actions for a run based on its current state.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `isCancelable` | `Boolean!` | Whether the run can be interrupted during planning or applying. |
| `isConfirmable` | `Boolean!` | Whether the run is awaiting user confirmation to proceed. |
| `isDiscardable` | `Boolean!` | Whether the run can be discarded to unlock the workspace. |
| `isForceCancelable` | `Boolean!` | Whether an admin can forcibly terminate the run. |

---

### RunEvent

An event recorded during a run's lifecycle, such as state transitions or user actions.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` | The run event's unique identifier. |
| `body` | `JSON!` | The event payload as a JSON object. |

---

### RunPermissions

Permissions the current API token has on a run, controlling which operations are allowed.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `canApply` | `Boolean!` | Whether the current user can apply this run. |
| `canCancel` | `Boolean!` | Whether the current user can cancel this run. |
| `canComment` | `Boolean!` | Whether the current user can add comments to this run. |
| `canDiscard` | `Boolean!` | Whether the current user can discard this run. |
| `canForceExecute` | `Boolean!` | Whether the current user can bypass workflow to execute immediately. |
| `canForceCancel` | `Boolean!` | Whether the current user can forcefully terminate this run. |
| `canOverridePolicyCheck` | `Boolean!` | Whether the current user can override failed policy checks. |

---

### RunStatusTimestamps

Timestamps recording when a run transitioned between statuses.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `planQueueableAt` | `DateTime` | Timestamp when the plan becomes ready to be queued. |

---

### RunTrigger

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` | The run trigger's unique identifier. |
| `workspaceName` | `String!` | The name of the destination workspace where triggered runs are created. |
| `sourceableName` | `String!` | The name of the source workspace whose successful applies trigger runs. |
| `createdAt` | `DateTime!` | Timestamp when the run trigger was created. |
| `workspace` | `Workspace!` | The destination workspace where triggered runs are created. |
| `sourceable` | `Workspace!` | The source workspace whose successful applies initiate runs in the destination. |

---

### SettingOverwrites

Indicates which project settings are overridden locally rather than inherited from the organization.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `defaultExecutionMode` | `Boolean` | Whether the project overrides the organization's default execution mode. |
| `defaultAgentPool` | `Boolean` | Whether the project overrides the organization's default agent pool. |

---

### StateVersion

An instance of Terraform state data for a workspace. State versions contain metadata about the state, its properties, and download URLs. They do not directly contain the stored state itself.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` | The state version's unique identifier. |
| `createdAt` | `DateTime!` | Timestamp when this state version was created. |
| `size` | `Int` | The size of the state data in bytes. |
| `hostedJsonStateDownloadUrl` | `String` | URL to download state data in a stable JSON format for external integrations. Only available for Terraform 1.3+. |
| `hostedStateDownloadUrl` | `String` | URL to download the raw state data in Terraform's internal format. |
| `hostedJsonStateUploadUrl` | `String` | URL to upload JSON-formatted state data. Can only be used once per state version. |
| `hostedStateUploadUrl` | `String` | URL to upload raw state data in Terraform's internal format. Can only be used once per state version. |
| `status` | `String` | Upload status of the state version content: 'pending', 'finalized', or 'discarded'. |
| `intermediate` | `Boolean` | Whether this is an intermediate state snapshot not yet set as the workspace's current state. |
| `modules` | `JSON` | Extracted information about Terraform modules in this state. Populated asynchronously. |
| `providers` | `JSON` | Extracted information about Terraform providers used by resources in this state. Populated asynchronously. |
| `resources` | `JSON` | Extracted information about resources in this state. Populated asynchronously. |
| `resourcesProcessed` | `Boolean` | Whether HCP Terraform has finished asynchronously extracting outputs, resources, and other information from this state. |
| `serial` | `Int` | The serial number of this state, which increments every time Terraform creates new state. |
| `stateVersion` | `Int` | The internal state format version number. |
| `terraformVersion` | `String` | The Terraform version that created this state. Populated asynchronously. |
| `vcsCommitSha` | `String` | The SHA of the VCS commit used in the run that produced this state. |
| `vcsCommitUrl` | `String` | A link to the VCS commit used in the run that produced this state. |
| `billableRumCount` | `Int` | Count of billable Resources Under Management (RUM). |
| `run` | `Run` | The run that created this state version, if applicable. |
| `createdBy` | `User` | The user who created this state version. |
| `workspace` | `Workspace` | The workspace this state version belongs to. |
| `outputs` | `[StateVersionOutput!]!` | Parsed output values from this state version. |

---

### StateVersionOutput

An output value from a Terraform state version. Contains the output name, type, value, and sensitivity flag.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` | The state version output's unique identifier. |
| `name` | `String!` | The output variable name as defined in the Terraform configuration. |
| `sensitive` | `Boolean!` | Whether the output value is marked as sensitive and should be hidden in UI displays. |
| `type` | `String!` | The data type of the output value (e.g., 'string', 'number', 'list'). |
| `value` | `JSON!` | The output value. May be a string, number, boolean, array, or object depending on type. |
| `detailedType` | `JSON!` | A more granular type specification providing structural details about complex output types. |
| `stateVersion` | `StateVersion` | The state version this output belongs to. |

---

### Team

A group of HCP Terraform users with shared permissions. Teams can be granted access to workspaces and projects within an organization.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` | The team's unique identifier. |
| `name` | `String!` | The team name. Supports letters, numbers, hyphens, and underscores. |
| `ssoTeamId` | `String` | The unique identifier from the SAML MemberOf attribute, used for SSO team mapping. |
| `usersCount` | `Int!` | Number of users in this team. |
| `visibility` | `String!` | The team's visibility: 'secret' (only visible to members and org admins) or 'organization' (visible to all members). |
| `allowMemberTokenManagement` | `Boolean!` | Whether team members can manage the team's API tokens. |
| `permissions` | `TeamPermissions!` | Permissions the current user has on this team. |
| `organizationAccess` | `TeamOrganizationAccess!` | Organization-level permissions granted to this team. |
| `organization` | `Organization!` | The organization this team belongs to. |
| `users(filter: UserFilter)` | `[User!]!` | Users who are members of this team. |
| `usersFromAdmin(filter: UserFilter)` | `[AdminUser!]` | Users retrieved via the Terraform Enterprise admin API. Only available on TFE. |
| `tokens(filter: TeamTokenFilter)` | `[TeamToken!]!` | API tokens associated with this team. |
| `workspaceAccess(filter: WorkspaceTeamAccessFilter)` | `[WorkspaceTeamAccess!]!` | Workspace-level access grants for this team. |
| `projectAccess(filter: ProjectTeamAccessFilter)` | `[ProjectTeamAccess!]!` | Project-level access grants for this team. |

---

### TeamOrganizationAccess

Organization-level permissions granted to a team, controlling what the team can manage across the organization.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `managePolicies` | `Boolean` | Whether this team can manage Sentinel and OPA policies. |
| `manageWorkspaces` | `Boolean` | Whether this team can create and manage workspaces. |
| `manageVcsSettings` | `Boolean` | Whether this team can manage VCS provider connections. |
| `managePolicyOverrides` | `Boolean` | Whether this team can override failed policy checks. |
| `manageModules` | `Boolean` | Whether this team can manage private registry modules. |
| `manageProviders` | `Boolean` | Whether this team can manage private registry providers. |
| `manageRunTasks` | `Boolean` | Whether this team can manage run task configurations. |
| `manageProjects` | `Boolean` | Whether this team can create and manage projects. |
| `manageMembership` | `Boolean` | Whether this team can manage organization user memberships. |
| `manageTeams` | `Boolean` | Whether this team can administer other teams. |
| `manageOrganizationAccess` | `Boolean` | Whether this team can assign organization-level permissions to other teams. |
| `accessSecretTeams` | `Boolean` | Whether this team can view secret (hidden) teams. |
| `readProjects` | `Boolean` | Whether this team can view projects. |
| `readWorkspaces` | `Boolean` | Whether this team can view workspaces. |
| `manageAgentPools` | `Boolean` | Whether this team can manage agent pools. |

---

### TeamPermissions

Permissions the current API token has on a team, controlling which management operations are allowed.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `canUpdateMembership` | `Boolean` | Whether the current user can modify team members. |
| `canDestroy` | `Boolean` | Whether the current user can delete this team. |
| `canUpdateOrganizationAccess` | `Boolean` | Whether the current user can adjust this team's organization-level permissions. |
| `canUpdateApiToken` | `Boolean` | Whether the current user can manage this team's API tokens. |
| `canUpdateVisibility` | `Boolean` | Whether the current user can change this team's visibility setting. |
| `canUpdateName` | `Boolean` | Whether the current user can rename this team. |
| `canUpdateSsoTeamId` | `Boolean` | Whether the current user can update this team's SSO team ID mapping. |
| `canUpdateMemberTokenManagement` | `Boolean` | Whether the current user can change the member token management setting. |
| `canViewApiToken` | `Boolean` | Whether the current user can view this team's API token metadata. |

---

### TeamToken

An API token associated with a team. Team tokens can be used to authenticate API requests on behalf of the team.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` | The team token's unique identifier. |
| `teamId` | `ID!` | The ID of the team this token belongs to. |
| `createdAt` | `DateTime!` | Timestamp when the token was created. |
| `lastUsedAt` | `DateTime` | Timestamp when the token was last used, or null if never used. |
| `description` | `String` | A text label for the token. Must be unique within the team. |
| `token` | `String` | The secret authentication string. Only visible upon creation and cannot be recovered. |
| `expiredAt` | `DateTime` | The expiration timestamp. Null if the token never expires. |
| `createdById` | `ID!` | The ID of the user who created this token. |

---

### User

An HCP Terraform user account. User objects contain username, avatar, and permission information but not other personal identifying details.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` | The user's unique identifier. |
| `username` | `String!` | The user's login name. |
| `email` | `String` | The user's email address. |
| `avatarUrl` | `String` | URL to the user's Gravatar profile image. |
| `isServiceAccount` | `Boolean!` | Whether this is a synthetic service account rather than a human user. |
| `authMethod` | `String!` | The authentication method used (e.g., 'tfc', 'hcp_username_password', 'hcp_github'). |
| `v2Only` | `Boolean!` | Whether the user only has access to the v2 API. |
| `permissions` | `UserPermissions!` | Permissions the current user has on this user account. |
| `teams(includeOrgs: [String!], excludeOrgs: [String!], filter: TeamFilter)` | `[Team!]!` | Teams the user belongs to across organizations. |

---

### UserPermissions

Permissions on a user account, controlling which account management operations are allowed.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `canCreateOrganizations` | `Boolean!` | Whether the user can create new organizations. |
| `canViewSettings` | `Boolean!` | Whether the user can view their account settings. |
| `canViewProfile` | `Boolean!` | Whether the user can view their profile. |
| `canChangeEmail` | `Boolean!` | Whether the user can modify their email address. |
| `canChangeUsername` | `Boolean!` | Whether the user can modify their username. |
| `canChangePassword` | `Boolean!` | Whether the user can change their password. |
| `canManageSessions` | `Boolean!` | Whether the user can manage their active sessions. |
| `canManageSsoIdentities` | `Boolean!` | Whether the user can manage their SSO identity links. |
| `canManageUserTokens` | `Boolean!` | Whether the user can manage their personal API tokens. |
| `canUpdateUser` | `Boolean!` | Whether the user can update their account details. |
| `canReenable2faByUnlinking` | `Boolean!` | Whether the user can re-enable two-factor authentication by unlinking an identity. |
| `canManageHcpAccount` | `Boolean!` | Whether the user can manage their linked HCP account. |

---

### Variable

A key/value pair used to parameterize Terraform runs. Variables can be Terraform input variables or environment variables, and may be marked as sensitive.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` | The variable's unique identifier. |
| `key` | `String!` | The variable name. |
| `value` | `String` | The variable value. Returns null for sensitive variables. |
| `sensitive` | `Boolean!` | Whether the variable value is sensitive and write-only. |
| `category` | `String!` | The variable category: 'terraform' for Terraform input variables or 'env' for environment variables. |
| `hcl` | `Boolean!` | When true, the value is evaluated as HCL code rather than a literal string. |
| `createdAt` | `DateTime!` | Timestamp when the variable was created. |
| `description` | `String` | A text description of the variable's purpose. |
| `versionId` | `String` | The version identifier for this variable, used for optimistic locking. |
| `workspace` | `Workspace` | The workspace this variable belongs to. |

---

### VariableSet

A reusable collection of variables that can be applied to multiple workspaces and projects across an organization. Global variable sets apply to all workspaces automatically.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` | The variable set's unique identifier. |
| `name` | `String!` | The name of the variable set. |
| `description` | `String` | A text description of the variable set's purpose. |
| `global` | `Boolean!` | When true, the variable set is automatically applied to all current and future workspaces in the organization. |
| `updatedAt` | `DateTime!` | Timestamp when the variable set was last modified. |
| `varCount` | `Int!` | Number of variables in this variable set. |
| `workspaceCount` | `Int!` | Number of workspaces this variable set is applied to. |
| `projectCount` | `Int!` | Number of projects this variable set is applied to. |
| `priority` | `Boolean!` | When true, variables in this set override any other variable values with a more specific scope, including command-line values. |
| `permissions` | `VariableSetPermissions!` | Permissions the current user has on this variable set. |
| `organization` | `Organization` | The organization this variable set belongs to. |
| `vars(filter: VariableFilter)` | `[Variable!]` | Variables contained in this variable set. |
| `workspaces(filter: WorkspaceFilter)` | `[Workspace!]` | Workspaces this variable set is applied to. |
| `projects(filter: ProjectFilter)` | `[Project!]` | Projects this variable set is applied to. |

---

### VariableSetPermissions

Permissions the current API token has on a variable set.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `canUpdate` | `Boolean!` | Whether the current user can modify this variable set. |

---

### Workspace

Represents running infrastructure managed by Terraform. Each workspace is associated with a Terraform configuration and maintains state, variables, and run history.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` | The workspace's unique identifier. |
| `name` | `String!` | The workspace name. Must contain only letters, numbers, hyphens, and underscores. |
| `description` | `String` | A text description of the workspace's purpose. |
| `locked` | `Boolean!` | Whether the workspace is currently locked, preventing new runs. |
| `lockedReason` | `String` | The reason the workspace was locked, if provided. |
| `autoApply` | `Boolean!` | When true, automatically applies successful plans triggered by VCS pushes. |
| `createdAt` | `DateTime!` | Timestamp when the workspace was created. |
| `updatedAt` | `DateTime!` | Timestamp when the workspace was last modified. |
| `applyDurationAverage` | `Int` | Mean apply phase duration in milliseconds. |
| `planDurationAverage` | `Int` | Mean plan phase duration in milliseconds. |
| `policyCheckFailures` | `Int` | Count of runs that failed due to policy check violations. |
| `queueAllRuns` | `Boolean` | When true, runs are queued immediately when the workspace is created, rather than waiting for configuration. |
| `resourceCount` | `Int` | Number of infrastructure resources managed by the workspace. |
| `runFailures` | `Int` | Total count of unsuccessful runs. |
| `source` | `String` | The application or system that created the workspace. |
| `sourceName` | `String` | A friendly display name for the creating application. |
| `sourceUrl` | `String` | A URL referencing the application that created the workspace. |
| `speculativeEnabled` | `Boolean` | When true, allows automatic speculative plans on pull requests. |
| `structuredRunOutputEnabled` | `Boolean` | When true, enables structured (JSON) run output. |
| `tagNames` | `[String!]!` | List of tag names applied to the workspace. |
| `terraformVersion` | `String` | The Terraform version or version constraint configured for the workspace. |
| `triggerPrefixes` | `[String!]!` | List of directory paths that trigger runs when files change within them. |
| `vcsRepo` | `JSON` | VCS repository settings object, including branch, OAuth token, and repository identifier. |
| `vcsRepoIdentifier` | `String` | The VCS repository reference string in :org/:repo format. |
| `workingDirectory` | `String` | The relative path within the repo where Terraform commands are executed. |
| `workspaceKpisRunsCount` | `Int` | Number of runs included in workspace KPI metrics. |
| `executionMode` | `String` | How Terraform runs execute: 'remote', 'local', or 'agent'. |
| `environment` | `String` | Deployment environment classification for the workspace. |
| `operations` | `Boolean` | Deprecated: use executionMode instead. |
| `fileTriggersEnabled` | `Boolean` | When true, only VCS pushes that change files matching trigger patterns or prefixes start runs. |
| `globalRemoteState` | `Boolean` | When true, all workspaces in the organization can access this workspace's state. |
| `latestChangeAt` | `DateTime` | Timestamp of the most recent state version change or workspace modification. |
| `lastAssessmentResultAt` | `DateTime` | Timestamp of the most recent health assessment completion. |
| `autoDestroyAt` | `DateTime` | Scheduled timestamp for automatic destroy operation. |
| `autoDestroyStatus` | `String` | Current status of the scheduled auto-destroy. |
| `autoDestroyActivityDuration` | `Int` | Inactivity period (in milliseconds) before the workspace is scheduled for auto-destroy. |
| `inheritsProjectAutoDestroy` | `Boolean` | Whether the workspace inherits its auto-destroy settings from its parent project. |
| `assessmentsEnabled` | `Boolean` | When true, health assessments (drift detection) are enabled for this workspace. |
| `allowDestroyPlan` | `Boolean` | Whether destroy plans can be queued on this workspace. |
| `autoApplyRunTrigger` | `Boolean` | When true, automatically applies successful plans initiated by run triggers. |
| `oauthClientName` | `String` | The name of the OAuth client used for VCS connection. |
| `actions` | `WorkspaceActions` | Available actions for the workspace based on its current state. |
| `permissions` | `WorkspacePermissions` | Permissions the current user has on this workspace. |
| `settingOverwrites` | `WorkspaceSettingOverwrites` | Indicates which settings are overridden at the workspace level rather than inherited from the project. |
| `organization` | `Organization` | The parent organization containing this workspace. |
| `runs(filter: RunFilter)` | `[Run!]!` | Runs executed in this workspace, with optional filtering. |
| `configurationVersions(filter: ConfigurationVersionFilter)` | `[ConfigurationVersion!]!` | Configuration versions uploaded to this workspace, with optional filtering. |
| `variables(filter: VariableFilter)` | `[Variable!]!` | Terraform and environment variables configured on this workspace. |
| `stateVersions(filter: StateVersionFilter)` | `[StateVersion!]!` | State version history for this workspace. |
| `currentStateVersion` | `StateVersion` | The active (most recent) infrastructure state for this workspace. |
| `providers` | `[WorkspaceProvider!]!` | Terraform providers used by resources in this workspace. |
| `modules` | `[WorkspaceModule!]!` | Terraform modules used in this workspace's configuration. |
| `project` | `Project` | The project this workspace belongs to. |
| `appliedPolicySets(filter: PolicySetFilter)` | `[PolicySet!]!` | Policy sets currently enforced on this workspace. |
| `currentRun` | `Run` | The active or most recent run for this workspace. |
| `teamAccess(filter: WorkspaceTeamAccessFilter)` | `[WorkspaceTeamAccess!]!` | Team access grants for this workspace. |
| `workspaceResources(filter: WorkspaceResourceFilter)` | `[WorkspaceResource!]!` |  |

---

### WorkspaceAccess

Workspace-level permission settings granted through project team access.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `create` | `Boolean!` | Whether the team can create workspaces within the project. |
| `move` | `Boolean!` | Whether the team can move workspaces between projects. |
| `locking` | `Boolean!` | Whether the team can manually lock and unlock workspaces. |
| `delete` | `Boolean!` | Whether the team can delete workspaces. |
| `runs` | `String!` | Permission level for workspace runs: 'read', 'plan', or 'apply'. |
| `variables` | `String!` | Permission level for workspace variables: 'none', 'read', or 'write'. |
| `stateVersions` | `String!` | Permission level for state versions: 'none', 'read-outputs', 'read', or 'write'. |
| `sentinelMocks` | `String!` | Permission level for Sentinel policy mocks: 'none' or 'read'. |
| `runTasks` | `Boolean!` | Whether the team can manage run tasks within workspaces. |

---

### WorkspaceActions

Available actions for a workspace based on its current state.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `isDestroyable` | `Boolean!` | Whether the workspace's infrastructure can be safely destroyed. |

---

### WorkspaceModule

A Terraform module used in a workspace's configuration, extracted from state data.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `name` | `String` | The module's display name. |
| `version` | `String` | The module version in use. |
| `source` | `String` | The module's source location. |

---

### WorkspacePermissions

Permissions the current API token has on a workspace, controlling which operations are allowed.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `canUpdate` | `Boolean!` | Whether the current user can modify workspace settings. |
| `canDestroy` | `Boolean!` | Whether the current user can queue destroy operations. |
| `canQueueRun` | `Boolean!` | Whether the current user can initiate new Terraform runs. |
| `canReadRun` | `Boolean!` | Whether the current user can view run details and status. |
| `canReadVariable` | `Boolean!` | Whether the current user can access workspace variables. |
| `canUpdateVariable` | `Boolean!` | Whether the current user can modify variable values. |
| `canReadStateVersions` | `Boolean!` | Whether the current user can access state file history. |
| `canReadStateOutputs` | `Boolean!` | Whether the current user can view computed output values. |
| `canCreateStateVersions` | `Boolean!` | Whether the current user can upload state files directly. |
| `canQueueApply` | `Boolean!` | Whether the current user can execute approved Terraform plans. |
| `canLock` | `Boolean!` | Whether the current user can lock the workspace to prevent concurrent modifications. |
| `canUnlock` | `Boolean!` | Whether the current user can remove the workspace lock. |
| `canForceUnlock` | `Boolean!` | Whether the current user can override a stuck workspace lock. |
| `canReadSettings` | `Boolean!` | Whether the current user can view workspace configuration settings. |
| `canManageTags` | `Boolean!` | Whether the current user can add or remove workspace tags. |
| `canManageRunTasks` | `Boolean!` | Whether the current user can configure run task enforcement. |
| `canForceDelete` | `Boolean!` | Whether the current user can remove the workspace without safeguards. |
| `canManageAssessments` | `Boolean!` | Whether the current user can control health assessment settings. |
| `canManageEphemeralWorkspaces` | `Boolean!` | Whether the current user can create temporary workspaces. |
| `canReadAssessmentResults` | `Boolean!` | Whether the current user can view health assessment outcomes. |
| `canQueueDestroy` | `Boolean!` | Whether the current user can schedule infrastructure destruction. |

---

### WorkspaceProvider

A Terraform provider used by resources in a workspace, extracted from state data.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `name` | `String` | The provider's display name. |
| `version` | `String` | The provider version in use. |
| `source` | `String` | The provider's source address (e.g., hashicorp/aws). |

---

### WorkspaceResource

A Terraform-managed resource tracked in a workspace's state. Includes the resource address, provider, module path, and the state version that last modified it.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` | The resource's unique identifier. |
| `address` | `String!` | The full resource address in Terraform configuration (e.g., 'aws_instance.web'). |
| `name` | `String!` | The local name of the resource within its module. |
| `createdAt` | `DateTime!` | Timestamp when the resource was first tracked. |
| `updatedAt` | `DateTime!` | Timestamp of the most recent resource modification. |
| `module` | `String!` | The module path containing this resource. 'root' indicates the root module. |
| `provider` | `String!` | The provider namespace and type (e.g., 'hashicorp/aws'). |
| `providerType` | `String!` | The specific resource type from the provider (e.g., 'aws_instance'). |
| `modifiedByStateVersion` | `StateVersion!` | The state version that last modified this resource. |
| `nameIndex` | `String` | Index suffix for resources declared with for_each or count. |
| `workspace` | `Workspace!` | The workspace this resource belongs to. |

---

### WorkspaceRunTrigger

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` | The run trigger's unique identifier. |
| `workspaceName` | `String!` | The name of the destination workspace where triggered runs are created. |
| `sourceableName` | `String!` | The name of the source workspace whose successful applies trigger runs. |
| `createdAt` | `DateTime!` | Timestamp when the run trigger was created. |
| `workspace` | `Workspace!` | The destination workspace where triggered runs are created. |
| `sourceable` | `Workspace!` | The source workspace whose successful applies initiate runs in the destination. |
| `inbound` | `Boolean!` | True if runs are triggered in this workspace (inbound), false if this workspace triggers runs elsewhere (outbound). |

---

### WorkspaceSettingOverwrites

Indicates which workspace settings are overridden locally rather than inherited from the parent project.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `executionMode` | `Boolean` | Whether the workspace overrides the project's default execution mode. |
| `agentPool` | `Boolean` | Whether the workspace overrides the project's default agent pool. |

---

### WorkspaceTeamAccess

Associates a team with a workspace and defines the team's permission level for runs, variables, state, and other workspace operations.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` | The workspace team access grant's unique identifier. |
| `access` | `String!` | The permission level: 'read', 'plan', 'write', 'admin', or 'custom'. |
| `runs` | `String!` | Permission level for workspace runs: 'read', 'plan', or 'apply'. Only applies when access is 'custom'. |
| `variables` | `String!` | Permission level for workspace variables: 'none', 'read', or 'write'. Only applies when access is 'custom'. |
| `stateVersions` | `String!` | Permission level for state versions: 'none', 'read-outputs', 'read', or 'write'. Only applies when access is 'custom'. |
| `sentinelMocks` | `String!` | Permission level for Sentinel policy mocks: 'none' or 'read'. Only applies when access is 'custom'. |
| `workspaceLocking` | `Boolean!` | Whether the team can manually lock and unlock the workspace. |
| `runTasks` | `Boolean!` | Whether the team can manage run tasks within the workspace. |
| `team` | `Team!` | The team this access grant is for. |
| `workspace` | `Workspace!` | The workspace this access grant applies to. |

---

### AbstractRunTrigger

Inbound or outbound run-trigger connections between workspaces.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` | The run trigger's unique identifier. |
| `workspaceName` | `String!` | The name of the destination workspace where triggered runs are created. |
| `sourceableName` | `String!` | The name of the source workspace whose successful applies trigger runs. |
| `createdAt` | `DateTime!` | Timestamp when the run trigger was created. |
| `workspace` | `Workspace!` | The destination workspace where triggered runs are created. |
| `sourceable` | `Workspace!` | The source workspace whose successful applies initiate runs in the destination. |

---

### UserAccount

Common fields shared by regular users and admin-managed users.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` | The user's unique identifier. |
| `username` | `String!` | The user's login name. |
| `email` | `String` | The user's email address. |
| `avatarUrl` | `String` | URL to the user's Gravatar profile image. |
| `isServiceAccount` | `Boolean!` | Whether this is a synthetic service account rather than a human user. |
| `teams(includeOrgs: [String!], excludeOrgs: [String!], filter: TeamFilter)` | `[Team!]!` | Teams the user belongs to across organizations. |

---

### ExplorerFilterOperator

Comparison operators available for Explorer API server-side filters.

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

Available fields for filtering and sorting in Explorer module queries.

| Value |
| ----- |
| `name` |
| `source` |
| `version` |
| `workspace_count` |
| `workspaces` |

---

### ExplorerProviderField

Available fields for filtering and sorting in Explorer provider queries.

| Value |
| ----- |
| `name` |
| `source` |
| `version` |
| `workspace_count` |
| `workspaces` |

---

### ExplorerTerraformVersionField

Available fields for filtering and sorting in Explorer Terraform version queries.

| Value |
| ----- |
| `version` |
| `workspace_count` |
| `workspaces` |

---

### ExplorerWorkspaceField

Available fields for filtering and sorting in Explorer workspace queries.

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

Log level filter for structured Terraform run output. Controls the minimum severity of log entries returned.

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

The output format for rendered metrics.

| Value |
| ----- |
| `PROMETHEUS` |
| `OPENMETRICS` |

---

### TF_LOG_CATEGORY

Terraform log verbosity levels. Used to identify workspaces with TF_LOG environment variables set.

| Value |
| ----- |
| `JSON` |
| `TRACE` |
| `DEBUG` |
| `INFO` |
| `WARN` |
| `ERROR` |

---

