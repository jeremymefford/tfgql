---
title: Inputs & Filters
description: All input types and filter expressions
---

# Inputs & Filters

All input types used for filtering and query parameters.

## Comparison Operators

These are the base comparison types used by all entity filters. See the [Filtering](../Concepts/filtering) page for usage examples.

### BooleanComparisonExp

| Operator | Type |
| -------- | ---- |
| `_eq` | `Boolean` |
| `_neq` | `Boolean` |
| `_is_null` | `Boolean` |

---

### DateTimeComparisonExp

| Operator | Type |
| -------- | ---- |
| `_eq` | `DateTime` |
| `_neq` | `DateTime` |
| `_in` | `[DateTime!]` |
| `_nin` | `[DateTime!]` |
| `_is_null` | `Boolean` |
| `_gt` | `DateTime` |
| `_gte` | `DateTime` |
| `_lt` | `DateTime` |
| `_lte` | `DateTime` |

---

### IntComparisonExp

| Operator | Type |
| -------- | ---- |
| `_eq` | `Int` |
| `_neq` | `Int` |
| `_in` | `[Int!]` |
| `_nin` | `[Int!]` |
| `_is_null` | `Boolean` |
| `_gt` | `Int` |
| `_gte` | `Int` |
| `_lt` | `Int` |
| `_lte` | `Int` |

---

### StringComparisonExp

| Operator | Type |
| -------- | ---- |
| `_eq` | `String` |
| `_neq` | `String` |
| `_in` | `[String!]` |
| `_nin` | `[String!]` |
| `_like` | `String` |
| `_nlike` | `String` |
| `_ilike` | `String` |
| `_nilike` | `String` |
| `_is_null` | `Boolean` |

---

### TerraformVersionComparisonExp

| Operator | Type |
| -------- | ---- |
| `_eq` | `String` |
| `_neq` | `String` |
| `_in` | `[String!]` |
| `_nin` | `[String!]` |
| `_like` | `String` |
| `_nlike` | `String` |
| `_ilike` | `String` |
| `_nilike` | `String` |
| `_is_null` | `Boolean` |
| `_gt` | `String` |
| `_gte` | `String` |
| `_lt` | `String` |
| `_lte` | `String` |

---

## Entity Filters

Each entity has a corresponding filter input type. Filters support `_and`, `_or`, and `_not` for boolean composition.

### AgentFilter

| Field | Type |
| ----- | ---- |
| `id` | `StringComparisonExp` |
| `name` | `StringComparisonExp` |
| `status` | `StringComparisonExp` |
| `ipAddress` | `StringComparisonExp` |
| `lastPingAt` | `DateTimeComparisonExp` |

---

### AgentPoolFilter

| Field | Type |
| ----- | ---- |
| `id` | `StringComparisonExp` |
| `type` | `StringComparisonExp` |
| `name` | `StringComparisonExp` |
| `createdAt` | `DateTimeComparisonExp` |
| `organizationScoped` | `BooleanComparisonExp` |
| `agentCount` | `IntComparisonExp` |

---

### AgentTokenFilter

| Field | Type |
| ----- | ---- |
| `id` | `StringComparisonExp` |
| `poolId` | `StringComparisonExp` |
| `createdAt` | `DateTimeComparisonExp` |
| `lastUsedAt` | `DateTimeComparisonExp` |
| `description` | `StringComparisonExp` |
| `createdById` | `StringComparisonExp` |

---

### ApplyFilter

| Field | Type |
| ----- | ---- |
| `id` | `StringComparisonExp` |
| `mode` | `StringComparisonExp` |
| `status` | `StringComparisonExp` |
| `queuedAt` | `DateTimeComparisonExp` |
| `startedAt` | `DateTimeComparisonExp` |
| `finishedAt` | `DateTimeComparisonExp` |
| `logReadUrl` | `StringComparisonExp` |
| `resourceAdditions` | `IntComparisonExp` |
| `resourceChanges` | `IntComparisonExp` |
| `resourceDestructions` | `IntComparisonExp` |
| `resourceImports` | `IntComparisonExp` |
| `stateVersionIds` | `StringComparisonExp` |

---

### AssessmentResultFilter

| Field | Type |
| ----- | ---- |
| `id` | `StringComparisonExp` |
| `drifted` | `BooleanComparisonExp` |
| `succeeded` | `BooleanComparisonExp` |
| `errorMessage` | `StringComparisonExp` |
| `createdAt` | `DateTimeComparisonExp` |

---

### CommentFilter

| Field | Type |
| ----- | ---- |
| `body` | `StringComparisonExp` |

---

### ConfigurationVersionFilter

| Field | Type |
| ----- | ---- |
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

---

### ConfigurationVersionStatusTimestampsFilter

| Field | Type |
| ----- | ---- |
| `archivedAt` | `DateTimeComparisonExp` |
| `fetchingAt` | `DateTimeComparisonExp` |
| `uploadedAt` | `DateTimeComparisonExp` |

---

### OrganizationFilter

| Field | Type |
| ----- | ---- |
| `id` | `StringComparisonExp` |
| `name` | `StringComparisonExp` |
| `externalId` | `StringComparisonExp` |
| `email` | `StringComparisonExp` |
| `createdAt` | `DateTimeComparisonExp` |
| `sessionTimeout` | `IntComparisonExp` |
| `sessionRemember` | `IntComparisonExp` |
| `collaboratorAuthPolicy` | `StringComparisonExp` |
| `planExpired` | `BooleanComparisonExp` |
| `planExpiresAt` | `DateTimeComparisonExp` |
| `planIsTrial` | `BooleanComparisonExp` |
| `planIsEnterprise` | `BooleanComparisonExp` |
| `planIdentifier` | `StringComparisonExp` |
| `costEstimationEnabled` | `BooleanComparisonExp` |
| `sendPassingStatusesForUntriggeredSpeculativePlans` | `BooleanComparisonExp` |
| `aggregatedCommitStatusEnabled` | `BooleanComparisonExp` |
| `speculativePlanManagementEnabled` | `BooleanComparisonExp` |
| `allowForceDeleteWorkspaces` | `BooleanComparisonExp` |
| `fairRunQueuingEnabled` | `BooleanComparisonExp` |
| `samlEnabled` | `BooleanComparisonExp` |
| `ownersTeamSamlRoleId` | `StringComparisonExp` |
| `twoFactorConformant` | `BooleanComparisonExp` |
| `assessmentsEnforced` | `BooleanComparisonExp` |
| `defaultExecutionMode` | `StringComparisonExp` |
| `permissions` | `OrganizationPermissionsFilter` |

---

### OrganizationMembershipFilter

| Field | Type |
| ----- | ---- |
| `id` | `StringComparisonExp` |
| `status` | `StringComparisonExp` |
| `organizationId` | `StringComparisonExp` |
| `userId` | `StringComparisonExp` |
| `teamIds` | `StringComparisonExp` |

---

### OrganizationPermissionsFilter

| Field | Type |
| ----- | ---- |
| `canUpdate` | `BooleanComparisonExp` |
| `canDestroy` | `BooleanComparisonExp` |
| `canAccessViaTeams` | `BooleanComparisonExp` |
| `canCreateModule` | `BooleanComparisonExp` |
| `canCreateTeam` | `BooleanComparisonExp` |
| `canCreateWorkspace` | `BooleanComparisonExp` |
| `canManageUsers` | `BooleanComparisonExp` |
| `canManageSubscription` | `BooleanComparisonExp` |
| `canManageSso` | `BooleanComparisonExp` |
| `canUpdateOauth` | `BooleanComparisonExp` |
| `canUpdateSentinel` | `BooleanComparisonExp` |
| `canUpdateSshKeys` | `BooleanComparisonExp` |
| `canUpdateApiToken` | `BooleanComparisonExp` |
| `canTraverse` | `BooleanComparisonExp` |
| `canStartTrial` | `BooleanComparisonExp` |
| `canUpdateAgentPools` | `BooleanComparisonExp` |
| `canManageTags` | `BooleanComparisonExp` |
| `canManageVarsets` | `BooleanComparisonExp` |
| `canReadVarsets` | `BooleanComparisonExp` |
| `canManagePublicProviders` | `BooleanComparisonExp` |
| `canCreateProvider` | `BooleanComparisonExp` |
| `canManagePublicModules` | `BooleanComparisonExp` |
| `canManageCustomProviders` | `BooleanComparisonExp` |
| `canManageRunTasks` | `BooleanComparisonExp` |
| `canReadRunTasks` | `BooleanComparisonExp` |
| `canCreateProject` | `BooleanComparisonExp` |

---

### OrganizationTagFilter

| Field | Type |
| ----- | ---- |
| `id` | `StringComparisonExp` |
| `name` | `StringComparisonExp` |
| `createdAt` | `DateTimeComparisonExp` |
| `instanceCount` | `IntComparisonExp` |
| `organizationId` | `StringComparisonExp` |

---

### PlanFilter

| Field | Type |
| ----- | ---- |
| `id` | `StringComparisonExp` |
| `status` | `StringComparisonExp` |
| `generatedConfiguration` | `BooleanComparisonExp` |
| `hasChanges` | `BooleanComparisonExp` |
| `resourceAdditions` | `IntComparisonExp` |
| `resourceChanges` | `IntComparisonExp` |
| `resourceDestructions` | `IntComparisonExp` |
| `resourceImports` | `IntComparisonExp` |
| `queuedAt` | `DateTimeComparisonExp` |
| `pendingAt` | `DateTimeComparisonExp` |
| `startedAt` | `DateTimeComparisonExp` |
| `finishedAt` | `DateTimeComparisonExp` |
| `mode` | `StringComparisonExp` |
| `agentId` | `StringComparisonExp` |
| `agentName` | `StringComparisonExp` |
| `agentPoolId` | `StringComparisonExp` |
| `agentPoolName` | `StringComparisonExp` |

---

### PolicyCheckFilter

| Field | Type |
| ----- | ---- |
| `id` | `StringComparisonExp` |
| `status` | `StringComparisonExp` |
| `scope` | `StringComparisonExp` |
| `runId` | `StringComparisonExp` |

---

### PolicyEvaluationFilter

| Field | Type |
| ----- | ---- |
| `id` | `StringComparisonExp` |
| `status` | `StringComparisonExp` |
| `policyKind` | `StringComparisonExp` |
| `createdAt` | `DateTimeComparisonExp` |
| `updatedAt` | `DateTimeComparisonExp` |
| `policyAttachableId` | `StringComparisonExp` |

---

### PolicyFilter

| Field | Type |
| ----- | ---- |
| `id` | `StringComparisonExp` |
| `name` | `StringComparisonExp` |
| `description` | `StringComparisonExp` |
| `kind` | `StringComparisonExp` |
| `query` | `StringComparisonExp` |
| `enforcementLevel` | `StringComparisonExp` |
| `policySetCount` | `IntComparisonExp` |
| `updatedAt` | `DateTimeComparisonExp` |
| `organizationId` | `StringComparisonExp` |
| `policySetIds` | `StringComparisonExp` |

---

### PolicySetFilter

| Field | Type |
| ----- | ---- |
| `id` | `StringComparisonExp` |
| `name` | `StringComparisonExp` |
| `description` | `StringComparisonExp` |
| `kind` | `StringComparisonExp` |
| `global` | `BooleanComparisonExp` |
| `agentEnabled` | `BooleanComparisonExp` |
| `projectCount` | `IntComparisonExp` |
| `policyToolVersion` | `StringComparisonExp` |
| `overridable` | `BooleanComparisonExp` |
| `workspaceCount` | `IntComparisonExp` |
| `policyCount` | `IntComparisonExp` |
| `policiesPath` | `StringComparisonExp` |
| `versioned` | `BooleanComparisonExp` |
| `createdAt` | `DateTimeComparisonExp` |
| `updatedAt` | `DateTimeComparisonExp` |

---

### PolicySetParameterFilter

| Field | Type |
| ----- | ---- |
| `id` | `StringComparisonExp` |
| `key` | `StringComparisonExp` |
| `value` | `StringComparisonExp` |
| `sensitive` | `BooleanComparisonExp` |
| `category` | `StringComparisonExp` |
| `policySetId` | `StringComparisonExp` |

---

### ProjectFilter

| Field | Type |
| ----- | ---- |
| `id` | `StringComparisonExp` |
| `name` | `StringComparisonExp` |
| `description` | `StringComparisonExp` |
| `createdAt` | `DateTimeComparisonExp` |
| `workspaceCount` | `IntComparisonExp` |
| `defaultExecutionMode` | `StringComparisonExp` |
| `teamCount` | `IntComparisonExp` |
| `stackCount` | `IntComparisonExp` |
| `autoDestroyActivityDuration` | `StringComparisonExp` |
| `permissions` | `ProjectPermissionsFilter` |

---

### ProjectPermissionsFilter

| Field | Type |
| ----- | ---- |
| `canRead` | `BooleanComparisonExp` |
| `canUpdate` | `BooleanComparisonExp` |
| `canDestroy` | `BooleanComparisonExp` |
| `canCreateWorkspace` | `BooleanComparisonExp` |
| `canMoveWorkspace` | `BooleanComparisonExp` |
| `canMoveStack` | `BooleanComparisonExp` |
| `canDeployNoCodeModules` | `BooleanComparisonExp` |
| `canReadTeams` | `BooleanComparisonExp` |
| `canManageTags` | `BooleanComparisonExp` |
| `canManageTeams` | `BooleanComparisonExp` |
| `canManageInHcp` | `BooleanComparisonExp` |
| `canManageEphemeralWorkspaceForProjects` | `BooleanComparisonExp` |
| `canManageVarsets` | `BooleanComparisonExp` |

---

### ProjectTeamAccessFilter

| Field | Type |
| ----- | ---- |
| `id` | `StringComparisonExp` |
| `access` | `StringComparisonExp` |
| `projectId` | `StringComparisonExp` |
| `teamId` | `StringComparisonExp` |

---

### RunActionsFilter

| Field | Type |
| ----- | ---- |
| `isCancelable` | `BooleanComparisonExp` |
| `isConfirmable` | `BooleanComparisonExp` |
| `isDiscardable` | `BooleanComparisonExp` |
| `isForceCancelable` | `BooleanComparisonExp` |

---

### RunFilter

| Field | Type |
| ----- | ---- |
| `id` | `StringComparisonExp` |
| `status` | `StringComparisonExp` |
| `message` | `StringComparisonExp` |
| `source` | `StringComparisonExp` |
| `triggerReason` | `StringComparisonExp` |
| `isDestroy` | `BooleanComparisonExp` |
| `hasChanges` | `BooleanComparisonExp` |
| `autoApply` | `BooleanComparisonExp` |
| `allowEmptyApply` | `BooleanComparisonExp` |
| `allowConfigGeneration` | `BooleanComparisonExp` |
| `planOnly` | `BooleanComparisonExp` |
| `refresh` | `BooleanComparisonExp` |
| `refreshOnly` | `BooleanComparisonExp` |
| `savePlan` | `BooleanComparisonExp` |
| `createdAt` | `DateTimeComparisonExp` |
| `canceledAt` | `DateTimeComparisonExp` |
| `permissions` | `RunPermissionsFilter` |
| `actions` | `RunActionsFilter` |
| `statusTimestamps` | `RunStatusTimestampsFilter` |

---

### RunPermissionsFilter

| Field | Type |
| ----- | ---- |
| `canApply` | `BooleanComparisonExp` |
| `canCancel` | `BooleanComparisonExp` |
| `canComment` | `BooleanComparisonExp` |
| `canDiscard` | `BooleanComparisonExp` |
| `canForceExecute` | `BooleanComparisonExp` |
| `canForceCancel` | `BooleanComparisonExp` |
| `canOverridePolicyCheck` | `BooleanComparisonExp` |

---

### RunStatusTimestampsFilter

| Field | Type |
| ----- | ---- |
| `planQueueableAt` | `DateTimeComparisonExp` |

---

### RunTriggerFilter

| Field | Type |
| ----- | ---- |
| `id` | `StringComparisonExp` |
| `workspaceName` | `StringComparisonExp` |
| `sourceableName` | `StringComparisonExp` |
| `createdAt` | `DateTimeComparisonExp` |

---

### StateVersionFilter

| Field | Type |
| ----- | ---- |
| `id` | `StringComparisonExp` |
| `status` | `StringComparisonExp` |
| `intermediate` | `BooleanComparisonExp` |
| `serial` | `IntComparisonExp` |
| `billableRumCount` | `IntComparisonExp` |
| `createdAt` | `DateTimeComparisonExp` |
| `size` | `IntComparisonExp` |
| `resourcesProcessed` | `BooleanComparisonExp` |
| `stateVersion` | `IntComparisonExp` |
| `terraformVersion` | `TerraformVersionComparisonExp` |

---

### StateVersionOutputFilter

| Field | Type |
| ----- | ---- |
| `id` | `StringComparisonExp` |
| `name` | `StringComparisonExp` |
| `sensitive` | `BooleanComparisonExp` |
| `type` | `StringComparisonExp` |

---

### TeamFilter

| Field | Type |
| ----- | ---- |
| `id` | `StringComparisonExp` |
| `name` | `StringComparisonExp` |
| `ssoTeamId` | `StringComparisonExp` |
| `usersCount` | `IntComparisonExp` |
| `visibility` | `StringComparisonExp` |
| `allowMemberTokenManagement` | `BooleanComparisonExp` |
| `permissions` | `TeamPermissionsFilter` |
| `organizationAccess` | `TeamOrganizationAccessFilter` |

---

### TeamOrganizationAccessFilter

| Field | Type |
| ----- | ---- |
| `managePolicies` | `BooleanComparisonExp` |
| `manageWorkspaces` | `BooleanComparisonExp` |
| `manageVcsSettings` | `BooleanComparisonExp` |
| `managePolicyOverrides` | `BooleanComparisonExp` |
| `manageModules` | `BooleanComparisonExp` |
| `manageProviders` | `BooleanComparisonExp` |
| `manageRunTasks` | `BooleanComparisonExp` |
| `manageProjects` | `BooleanComparisonExp` |
| `manageMembership` | `BooleanComparisonExp` |
| `manageTeams` | `BooleanComparisonExp` |
| `manageOrganizationAccess` | `BooleanComparisonExp` |
| `accessSecretTeams` | `BooleanComparisonExp` |
| `readProjects` | `BooleanComparisonExp` |
| `readWorkspaces` | `BooleanComparisonExp` |
| `manageAgentPools` | `BooleanComparisonExp` |

---

### TeamPermissionsFilter

| Field | Type |
| ----- | ---- |
| `canUpdateMembership` | `BooleanComparisonExp` |
| `canDestroy` | `BooleanComparisonExp` |
| `canUpdateOrganizationAccess` | `BooleanComparisonExp` |
| `canUpdateApiToken` | `BooleanComparisonExp` |
| `canUpdateVisibility` | `BooleanComparisonExp` |
| `canUpdateName` | `BooleanComparisonExp` |
| `canUpdateSsoTeamId` | `BooleanComparisonExp` |
| `canUpdateMemberTokenManagement` | `BooleanComparisonExp` |
| `canViewApiToken` | `BooleanComparisonExp` |

---

### TeamTokenFilter

| Field | Type |
| ----- | ---- |
| `id` | `StringComparisonExp` |
| `teamId` | `StringComparisonExp` |
| `createdAt` | `DateTimeComparisonExp` |
| `lastUsedAt` | `DateTimeComparisonExp` |
| `description` | `StringComparisonExp` |
| `token` | `StringComparisonExp` |
| `expiredAt` | `DateTimeComparisonExp` |
| `createdById` | `StringComparisonExp` |

---

### UserFilter

| Field | Type |
| ----- | ---- |
| `id` | `StringComparisonExp` |
| `username` | `StringComparisonExp` |
| `email` | `StringComparisonExp` |
| `avatarUrl` | `StringComparisonExp` |
| `isServiceAccount` | `BooleanComparisonExp` |
| `authMethod` | `StringComparisonExp` |
| `v2Only` | `BooleanComparisonExp` |
| `permissions` | `UserPermissionsFilter` |

---

### UserPermissionsFilter

| Field | Type |
| ----- | ---- |
| `canCreateOrganizations` | `BooleanComparisonExp` |
| `canViewSettings` | `BooleanComparisonExp` |
| `canViewProfile` | `BooleanComparisonExp` |
| `canChangeEmail` | `BooleanComparisonExp` |
| `canChangeUsername` | `BooleanComparisonExp` |
| `canChangePassword` | `BooleanComparisonExp` |
| `canManageSessions` | `BooleanComparisonExp` |
| `canManageSsoIdentities` | `BooleanComparisonExp` |
| `canManageUserTokens` | `BooleanComparisonExp` |
| `canUpdateUser` | `BooleanComparisonExp` |
| `canReenable2faByUnlinking` | `BooleanComparisonExp` |
| `canManageHcpAccount` | `BooleanComparisonExp` |

---

### VariableFilter

| Field | Type |
| ----- | ---- |
| `id` | `StringComparisonExp` |
| `key` | `StringComparisonExp` |
| `value` | `StringComparisonExp` |
| `category` | `StringComparisonExp` |
| `hcl` | `BooleanComparisonExp` |
| `sensitive` | `BooleanComparisonExp` |
| `description` | `StringComparisonExp` |
| `versionId` | `StringComparisonExp` |

---

### VariableSetFilter

| Field | Type |
| ----- | ---- |
| `id` | `StringComparisonExp` |
| `name` | `StringComparisonExp` |
| `description` | `StringComparisonExp` |
| `global` | `BooleanComparisonExp` |
| `updatedAt` | `DateTimeComparisonExp` |
| `varCount` | `IntComparisonExp` |
| `workspaceCount` | `IntComparisonExp` |
| `projectCount` | `IntComparisonExp` |
| `priority` | `BooleanComparisonExp` |
| `permissions` | `VariableSetPermissionsFilter` |

---

### VariableSetPermissionsFilter

| Field | Type |
| ----- | ---- |
| `canUpdate` | `BooleanComparisonExp` |

---

### WorkspaceFilter

| Field | Type |
| ----- | ---- |
| `id` | `StringComparisonExp` |
| `name` | `StringComparisonExp` |
| `description` | `StringComparisonExp` |
| `locked` | `BooleanComparisonExp` |
| `lockedReason` | `StringComparisonExp` |
| `autoApply` | `BooleanComparisonExp` |
| `createdAt` | `DateTimeComparisonExp` |
| `updatedAt` | `DateTimeComparisonExp` |
| `applyDurationAverage` | `IntComparisonExp` |
| `planDurationAverage` | `IntComparisonExp` |
| `policyCheckFailures` | `IntComparisonExp` |
| `queueAllRuns` | `BooleanComparisonExp` |
| `resourceCount` | `IntComparisonExp` |
| `runFailures` | `IntComparisonExp` |
| `source` | `StringComparisonExp` |
| `sourceName` | `StringComparisonExp` |
| `sourceUrl` | `StringComparisonExp` |
| `speculativeEnabled` | `BooleanComparisonExp` |
| `structuredRunOutputEnabled` | `BooleanComparisonExp` |
| `tagNames` | `StringComparisonExp` |
| `terraformVersion` | `TerraformVersionComparisonExp` |
| `triggerPrefixes` | `StringComparisonExp` |
| `vcsRepoIdentifier` | `StringComparisonExp` |
| `workingDirectory` | `StringComparisonExp` |
| `workspaceKpisRunsCount` | `IntComparisonExp` |
| `executionMode` | `StringComparisonExp` |
| `environment` | `StringComparisonExp` |
| `operations` | `BooleanComparisonExp` |
| `fileTriggersEnabled` | `BooleanComparisonExp` |
| `globalRemoteState` | `BooleanComparisonExp` |
| `latestChangeAt` | `DateTimeComparisonExp` |
| `lastAssessmentResultAt` | `DateTimeComparisonExp` |
| `autoDestroyAt` | `DateTimeComparisonExp` |
| `autoDestroyStatus` | `StringComparisonExp` |
| `autoDestroyActivityDuration` | `IntComparisonExp` |
| `inheritsProjectAutoDestroy` | `BooleanComparisonExp` |
| `assessmentsEnabled` | `BooleanComparisonExp` |
| `allowDestroyPlan` | `BooleanComparisonExp` |
| `autoApplyRunTrigger` | `BooleanComparisonExp` |
| `oauthClientName` | `StringComparisonExp` |

---

### WorkspaceResourceFilter

| Field | Type |
| ----- | ---- |
| `id` | `StringComparisonExp` |
| `address` | `StringComparisonExp` |
| `name` | `StringComparisonExp` |
| `createdAt` | `DateTimeComparisonExp` |
| `updatedAt` | `DateTimeComparisonExp` |
| `module` | `StringComparisonExp` |
| `provider` | `StringComparisonExp` |
| `providerType` | `StringComparisonExp` |
| `nameIndex` | `IntComparisonExp` |

---

### WorkspaceTeamAccessFilter

| Field | Type |
| ----- | ---- |
| `id` | `StringComparisonExp` |
| `access` | `StringComparisonExp` |
| `runs` | `StringComparisonExp` |
| `variables` | `StringComparisonExp` |
| `stateVersions` | `StringComparisonExp` |
| `sentinelMocks` | `StringComparisonExp` |
| `workspaceLocking` | `BooleanComparisonExp` |
| `runTasks` | `BooleanComparisonExp` |
| `workspaceId` | `StringComparisonExp` |
| `teamId` | `StringComparisonExp` |

---

## Other Input Types

### ExplorerModuleFilterInput

| Field | Type |
| ----- | ---- |
| `field` | `ExplorerModuleField!` |
| `operator` | `ExplorerFilterOperator!` |
| `value` | `String!` |

---

### ExplorerModuleSortInput

| Field | Type |
| ----- | ---- |
| `field` | `ExplorerModuleField!` |
| `ascending` | `Boolean!` |

---

### ExplorerProviderFilterInput

| Field | Type |
| ----- | ---- |
| `field` | `ExplorerProviderField!` |
| `operator` | `ExplorerFilterOperator!` |
| `value` | `String!` |

---

### ExplorerProviderSortInput

| Field | Type |
| ----- | ---- |
| `field` | `ExplorerProviderField!` |
| `ascending` | `Boolean!` |

---

### ExplorerTerraformVersionFilterInput

| Field | Type |
| ----- | ---- |
| `field` | `ExplorerTerraformVersionField!` |
| `operator` | `ExplorerFilterOperator!` |
| `value` | `String!` |

---

### ExplorerTerraformVersionSortInput

| Field | Type |
| ----- | ---- |
| `field` | `ExplorerTerraformVersionField!` |
| `ascending` | `Boolean!` |

---

### ExplorerWorkspaceFilterInput

| Field | Type |
| ----- | ---- |
| `field` | `ExplorerWorkspaceField!` |
| `operator` | `ExplorerFilterOperator!` |
| `value` | `String!` |

---

### ExplorerWorkspaceSortInput

| Field | Type |
| ----- | ---- |
| `field` | `ExplorerWorkspaceField!` |
| `ascending` | `Boolean!` |

---

