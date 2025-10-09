import { DomainMapper } from "../common/middleware/domainMapper";
import { Organization, OrganizationResource } from "./types";

export const organizationMapper: DomainMapper<
  OrganizationResource,
  Organization
> = {
  map(org: OrganizationResource): Organization {
    const attrs = org.attributes;
    const permissions = attrs.permissions;

    return {
      id: org.id,
      name: attrs.name,
      externalId: attrs["external-id"],
      email: attrs.email,
      createdAt: attrs["created-at"],
      sessionTimeout: attrs["session-timeout"],
      sessionRemember: attrs["session-remember"],
      collaboratorAuthPolicy: attrs["collaborator-auth-policy"],
      planExpired: attrs["plan-expired"],
      planExpiresAt: attrs["plan-expires-at"],
      planIsTrial: attrs["plan-is-trial"] ?? false,
      planIsEnterprise: attrs["plan-is-enterprise"] ?? false,
      planIdentifier: attrs["plan-identifier"],
      costEstimationEnabled: attrs["cost-estimation-enabled"],
      sendPassingStatusesForUntriggeredSpeculativePlans:
        attrs["send-passing-statuses-for-untriggered-speculative-plans"],
      aggregatedCommitStatusEnabled: attrs["aggregated-commit-status-enabled"],
      speculativePlanManagementEnabled:
        attrs["speculative-plan-management-enabled"],
      allowForceDeleteWorkspaces: attrs["allow-force-delete-workspaces"],
      fairRunQueuingEnabled: attrs["fair-run-queuing-enabled"],
      samlEnabled: attrs["saml-enabled"],
      ownersTeamSamlRoleId: attrs["owners-team-saml-role-id"],
      twoFactorConformant: attrs["two-factor-conformant"],
      assessmentsEnforced: attrs["assessments-enforced"],
      defaultExecutionMode: attrs["default-execution-mode"],
      permissions: {
        canUpdate: permissions["can-update"] ?? false,
        canDestroy: permissions["can-destroy"] ?? false,
        canAccessViaTeams: permissions["can-access-via-teams"] ?? false,
        canCreateModule: permissions["can-create-module"] ?? false,
        canCreateTeam: permissions["can-create-team"] ?? false,
        canCreateWorkspace: permissions["can-create-workspace"] ?? false,
        canManageUsers: permissions["can-manage-users"] ?? false,
        canManageSubscription: permissions["can-manage-subscription"] ?? false,
        canManageSso: permissions["can-manage-sso"] ?? false,
        canUpdateOauth: permissions["can-update-oauth"] ?? false,
        canUpdateSentinel: permissions["can-update-sentinel"] ?? false,
        canUpdateSshKeys: permissions["can-update-ssh-keys"] ?? false,
        canUpdateApiToken: permissions["can-update-api-token"] ?? false,
        canTraverse: permissions["can-traverse"] ?? false,
        canStartTrial: permissions["can-start-trial"] ?? false,
        canUpdateAgentPools: permissions["can-update-agent-pools"] ?? false,
        canManageTags: permissions["can-manage-tags"] ?? false,
        canManageVarsets: permissions["can-manage-varsets"] ?? false,
        canReadVarsets: permissions["can-read-varsets"] ?? false,
        canManagePublicProviders:
          permissions["can-manage-public-providers"] ?? false,
        canCreateProvider: permissions["can-create-provider"] ?? false,
        canManagePublicModules:
          permissions["can-manage-public-modules"] ?? false,
        canManageCustomProviders:
          permissions["can-manage-custom-providers"] ?? false,
        canManageRunTasks: permissions["can-manage-run-tasks"] ?? false,
        canReadRunTasks: permissions["can-read-run-tasks"] ?? false,
        canCreateProject: permissions["can-create-project"] ?? false,
      },
    };
  },
};
