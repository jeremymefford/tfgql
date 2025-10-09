import {
  ResourceObject,
  ListResponse,
  SingleResponse,
} from "../common/types/jsonApi";
import {
  StringComparisonExp,
  IntComparisonExp,
  BooleanComparisonExp,
  DateTimeComparisonExp,
  WhereClause,
} from "../common/filtering/types";

export interface OrganizationAttributes {
  name: string;
  email: string;
  "external-id": string;
  "created-at": string;
  "session-timeout": number | null;
  "session-remember": number | null;
  "collaborator-auth-policy": string;
  "plan-expired": boolean;
  "plan-expires-at": string | null;
  "plan-is-trial": boolean;
  "plan-is-enterprise": boolean;
  "plan-identifier": string;
  "cost-estimation-enabled": boolean;
  "send-passing-statuses-for-untriggered-speculative-plans": boolean;
  "aggregated-commit-status-enabled": boolean;
  "speculative-plan-management-enabled": boolean;
  "allow-force-delete-workspaces": boolean;
  "fair-run-queuing-enabled": boolean;
  "saml-enabled": boolean;
  "owners-team-saml-role-id": string | null;
  "two-factor-conformant": boolean;
  "assessments-enforced": boolean;
  "default-execution-mode": string;
  permissions: OrganizationPermissions;
}

export interface OrganizationPermissions {
  "can-update": boolean;
  "can-destroy": boolean;
  "can-access-via-teams": boolean;
  "can-create-module": boolean;
  "can-create-team": boolean;
  "can-create-workspace": boolean;
  "can-manage-users": boolean;
  "can-manage-subscription": boolean;
  "can-manage-sso": boolean;
  "can-update-oauth": boolean;
  "can-update-sentinel": boolean;
  "can-update-ssh-keys": boolean;
  "can-update-api-token": boolean;
  "can-traverse": boolean;
  "can-start-trial": boolean;
  "can-update-agent-pools": boolean;
  "can-manage-tags": boolean;
  "can-manage-varsets": boolean;
  "can-read-varsets": boolean;
  "can-manage-public-providers": boolean;
  "can-create-provider": boolean;
  "can-manage-public-modules": boolean;
  "can-manage-custom-providers": boolean;
  "can-manage-run-tasks": boolean;
  "can-read-run-tasks": boolean;
  "can-create-project": boolean;
}

export type OrganizationResource = ResourceObject<OrganizationAttributes>;
export type OrganizationListResponse = ListResponse<OrganizationResource>;
export type OrganizationResponse = SingleResponse<OrganizationResource>;

export interface Organization {
  id: string;
  name: string;
  email: string;
  externalId: string;
  createdAt: string;
  sessionTimeout: number | null;
  sessionRemember: number | null;
  collaboratorAuthPolicy: string;
  planExpired: boolean;
  planExpiresAt: string | null;
  planIsTrial: boolean;
  planIsEnterprise: boolean;
  planIdentifier: string;
  costEstimationEnabled: boolean;
  sendPassingStatusesForUntriggeredSpeculativePlans: boolean;
  aggregatedCommitStatusEnabled: boolean;
  speculativePlanManagementEnabled: boolean;
  allowForceDeleteWorkspaces: boolean;
  fairRunQueuingEnabled: boolean;
  samlEnabled: boolean;
  ownersTeamSamlRoleId: string | null;
  twoFactorConformant: boolean;
  assessmentsEnforced: boolean;
  defaultExecutionMode: string;
  permissions: {
    canUpdate: boolean;
    canDestroy: boolean;
    canAccessViaTeams: boolean;
    canCreateModule: boolean;
    canCreateTeam: boolean;
    canCreateWorkspace: boolean;
    canManageUsers: boolean;
    canManageSubscription: boolean;
    canManageSso: boolean;
    canUpdateOauth: boolean;
    canUpdateSentinel: boolean;
    canUpdateSshKeys: boolean;
    canUpdateApiToken: boolean;
    canTraverse: boolean;
    canStartTrial: boolean;
    canUpdateAgentPools: boolean;
    canManageTags: boolean;
    canManageVarsets: boolean;
    canReadVarsets: boolean;
    canManagePublicProviders: boolean;
    canCreateProvider: boolean;
    canManagePublicModules: boolean;
    canManageCustomProviders: boolean;
    canManageRunTasks: boolean;
    canReadRunTasks: boolean;
    canCreateProject: boolean;
  };
}

export interface OrganizationPermissionsFilter
  extends WhereClause<Organization["permissions"]> {
  canUpdate?: BooleanComparisonExp;
  canDestroy?: BooleanComparisonExp;
  canAccessViaTeams?: BooleanComparisonExp;
  canCreateModule?: BooleanComparisonExp;
  canCreateTeam?: BooleanComparisonExp;
  canCreateWorkspace?: BooleanComparisonExp;
  canManageUsers?: BooleanComparisonExp;
  canManageSubscription?: BooleanComparisonExp;
  canManageSso?: BooleanComparisonExp;
  canUpdateOauth?: BooleanComparisonExp;
  canUpdateSentinel?: BooleanComparisonExp;
  canUpdateSshKeys?: BooleanComparisonExp;
  canUpdateApiToken?: BooleanComparisonExp;
  canTraverse?: BooleanComparisonExp;
  canStartTrial?: BooleanComparisonExp;
  canUpdateAgentPools?: BooleanComparisonExp;
  canManageTags?: BooleanComparisonExp;
  canManageVarsets?: BooleanComparisonExp;
  canReadVarsets?: BooleanComparisonExp;
  canManagePublicProviders?: BooleanComparisonExp;
  canCreateProvider?: BooleanComparisonExp;
  canManagePublicModules?: BooleanComparisonExp;
  canManageCustomProviders?: BooleanComparisonExp;
  canManageRunTasks?: BooleanComparisonExp;
  canReadRunTasks?: BooleanComparisonExp;
  canCreateProject?: BooleanComparisonExp;
}

export interface OrganizationFilter
  extends WhereClause<
    Organization,
    {
      permissions: OrganizationPermissionsFilter;
    }
  > {
  _and?: OrganizationFilter[];
  _or?: OrganizationFilter[];
  _not?: OrganizationFilter;

  id?: StringComparisonExp;
  name?: StringComparisonExp;
  externalId?: StringComparisonExp;
  email?: StringComparisonExp;
  createdAt?: DateTimeComparisonExp;
  sessionTimeout?: IntComparisonExp;
  sessionRemember?: IntComparisonExp;
  collaboratorAuthPolicy?: StringComparisonExp;
  planExpired?: BooleanComparisonExp;
  planExpiresAt?: DateTimeComparisonExp;
  planIsTrial?: BooleanComparisonExp;
  planIsEnterprise?: BooleanComparisonExp;
  planIdentifier?: StringComparisonExp;
  costEstimationEnabled?: BooleanComparisonExp;
  sendPassingStatusesForUntriggeredSpeculativePlans?: BooleanComparisonExp;
  aggregatedCommitStatusEnabled?: BooleanComparisonExp;
  speculativePlanManagementEnabled?: BooleanComparisonExp;
  allowForceDeleteWorkspaces?: BooleanComparisonExp;
  fairRunQueuingEnabled?: BooleanComparisonExp;
  samlEnabled?: BooleanComparisonExp;
  ownersTeamSamlRoleId?: StringComparisonExp;
  twoFactorConformant?: BooleanComparisonExp;
  assessmentsEnforced?: BooleanComparisonExp;
  defaultExecutionMode?: StringComparisonExp;

  permissions?: OrganizationPermissionsFilter;
}
