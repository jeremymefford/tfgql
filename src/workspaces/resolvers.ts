import { Context } from '../server/context';
import { Workspace } from './types';
import { Organization } from '../organizations/types';
import { Run } from '../runs/types';

export const resolvers = {
  Query: {
    workspaces: async (_: unknown, { orgName }: { orgName: string }, { dataSources }: Context): Promise<Workspace[]> => {
      const wsResources = await dataSources.workspacesAPI.listWorkspaces(orgName);
      return wsResources.map(ws => ({
        id: ws.id,
        name: ws.attributes.name,
        description: ws.attributes.description,
        locked: ws.attributes.locked,
        autoApply: ws.attributes['auto-apply'],
        createdAt: ws.attributes['created-at'],
        organizationName: orgName
      }));
    },
    workspace: async (_: unknown, { id }: { id: string }, { dataSources }: Context): Promise<Workspace | null> => {
      const wsResource = await dataSources.workspacesAPI.getWorkspace(id);
      if (!wsResource) return null;
      return {
        id: wsResource.id,
        name: wsResource.attributes.name,
        description: wsResource.attributes.description,
        locked: wsResource.attributes.locked,
        autoApply: wsResource.attributes['auto-apply'],
        createdAt: wsResource.attributes['created-at'],
        organizationName: wsResource.relationships?.organization?.data?.id
      };
    }
  },
  Mutation: {
    createWorkspace: async (_: unknown, { orgName, name, description }: { orgName: string; name: string; description?: string }, { dataSources }: Context): Promise<Workspace> => {
      // Basic input validation
      if (!name || name.trim() === '') {
        throw new Error('Workspace name cannot be empty');
      }
      const wsResource = await dataSources.workspacesAPI.createWorkspace(orgName, name, description);
      return {
        id: wsResource.id,
        name: wsResource.attributes.name,
        description: wsResource.attributes.description,
        locked: wsResource.attributes.locked,
        autoApply: wsResource.attributes['auto-apply'],
        createdAt: wsResource.attributes['created-at'],
        organizationName: orgName
      };
    }
  },
  Workspace: {
    organization: async (workspace: Workspace, _: unknown, { dataSources }: Context): Promise<Organization | null> => {
      const orgName = workspace.organizationName;
      if (!orgName) return null;
      const orgResource = await dataSources.organizationsAPI.getOrganization(orgName);
      return {
        id: orgResource.id,
        name: orgResource.attributes.name,
        email: orgResource.attributes.email,
        createdAt: orgResource.attributes['created-at'],
        externalId: orgResource.attributes['external-id'],
        sessionTimeout: orgResource.attributes['session-timeout'],
        sessionRemember: orgResource.attributes['session-remember'],
        collaboratorAuthPolicy: orgResource.attributes['collaborator-auth-policy'],
        planExpired: orgResource.attributes['plan-expired'],
        planExpiresAt: orgResource.attributes['plan-expires-at'],
        planIsTrial: orgResource.attributes['plan-is-trial'],
        planIsEnterprise: orgResource.attributes['plan-is-enterprise'],
        planIdentifier: orgResource.attributes['plan-identifier'],
        costEstimationEnabled: orgResource.attributes['cost-estimation-enabled'],
        sendPassingStatusesForUntriggeredSpeculativePlans: orgResource.attributes['send-passing-statuses-for-untriggered-speculative-plans'],
        aggregatedCommitStatusEnabled: orgResource.attributes['aggregated-commit-status-enabled'],
        speculativePlanManagementEnabled: orgResource.attributes['speculative-plan-management-enabled'],
        allowForceDeleteWorkspaces: orgResource.attributes['allow-force-delete-workspaces'],
        fairRunQueuingEnabled: orgResource.attributes['fair-run-queuing-enabled'],
        samlEnabled: orgResource.attributes['saml-enabled'],
        ownersTeamSamlRoleId: orgResource.attributes['owners-team-saml-role-id'],
        twoFactorConformant: orgResource.attributes['two-factor-conformant'],
        assessmentsEnforced: orgResource.attributes['assessments-enforced'],
        defaultExecutionMode: orgResource.attributes['default-execution-mode'],
        permissions: {
          canUpdate: orgResource.attributes.permissions?.['can-update'] ?? false,
          canDestroy: orgResource.attributes.permissions?.['can-destroy'] ?? false,
          canAccessViaTeams: orgResource.attributes.permissions?.['can-access-via-teams'] ?? false,
          canCreateModule: orgResource.attributes.permissions?.['can-create-module'] ?? false,
          canCreateTeam: orgResource.attributes.permissions?.['can-create-team'] ?? false,
          canCreateWorkspace: orgResource.attributes.permissions?.['can-create-workspace'] ?? false,
          canManageUsers: orgResource.attributes.permissions?.['can-manage-users'] ?? false,
          canManageSubscription: orgResource.attributes.permissions?.['can-manage-subscription'] ?? false,
          canManageSso: orgResource.attributes.permissions?.['can-manage-sso'] ?? false,
          canUpdateOauth: orgResource.attributes.permissions?.['can-update-oauth'] ?? false,
          canUpdateSentinel: orgResource.attributes.permissions?.['can-update-sentinel'] ?? false,
          canUpdateSshKeys: orgResource.attributes.permissions?.['can-update-ssh-keys'] ?? false,
          canUpdateApiToken: orgResource.attributes.permissions?.['can-update-api-token'] ?? false,
          canTraverse: orgResource.attributes.permissions?.['can-traverse'] ?? false,
          canStartTrial: orgResource.attributes.permissions?.['can-start-trial'] ?? false,
          canUpdateAgentPools: orgResource.attributes.permissions?.['can-update-agent-pools'] ?? false,
          canManageTags: orgResource.attributes.permissions?.['can-manage-tags'] ?? false,
          canManageVarsets: orgResource.attributes.permissions?.['can-manage-varsets'] ?? false,
          canReadVarsets: orgResource.attributes.permissions?.['can-read-varsets'] ?? false,
          canManagePublicProviders: orgResource.attributes.permissions?.['can-manage-public-providers'] ?? false,
          canCreateProvider: orgResource.attributes.permissions?.['can-create-provider'] ?? false,
          canManagePublicModules: orgResource.attributes.permissions?.['can-manage-public-modules'] ?? false,
          canManageCustomProviders: orgResource.attributes.permissions?.['can-manage-custom-providers'] ?? false,
          canManageRunTasks: orgResource.attributes.permissions?.['can-manage-run-tasks'] ?? false,
          canReadRunTasks: orgResource.attributes.permissions?.['can-read-run-tasks'] ?? false,
          canCreateProject: orgResource.attributes.permissions?.['can-create-project'] ?? false
        }
      };
    },
    runs: async (workspace: Workspace, _: unknown, { dataSources }: Context): Promise<Run[]> => {
      const runResources = await dataSources.runsAPI.listRuns(workspace.id);
      return runResources.map(run => ({
        id: run.id,
        status: run.attributes.status,
        message: run.attributes.message,
        isDestroy: run.attributes['is-destroy'],
        createdAt: run.attributes['created-at'],
        workspaceId: workspace.id
      }));
    }
  }
};