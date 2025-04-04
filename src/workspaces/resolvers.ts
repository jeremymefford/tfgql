import { Context } from '../server/context';
import { Workspace } from './types';
import { Organization } from '../organizations/types';
import { Run } from '../runs/types';
import { mapRunResourceToDomain } from '../runs/resolvers';

export function mapWorkspaceResourceToDomain(ws: any): Workspace {
  return {
    id: ws.id,
    name: ws.attributes.name,
    description: ws.attributes.description,
    locked: ws.attributes.locked,
    lockedReason: ws.attributes['locked-reason'],
    autoApply: ws.attributes['auto-apply'],
    createdAt: ws.attributes['created-at'],
    updatedAt: ws.attributes['updated-at'],
    applyDurationAverage: ws.attributes['apply-duration-average'],
    planDurationAverage: ws.attributes['plan-duration-average'],
    policyCheckFailures: ws.attributes['policy-check-failures'],
    queueAllRuns: ws.attributes['queue-all-runs'],
    resourceCount: ws.attributes['resource-count'],
    runFailures: ws.attributes['run-failures'],
    source: ws.attributes.source,
    sourceName: ws.attributes['source-name'],
    sourceUrl: ws.attributes['source-url'],
    speculativeEnabled: ws.attributes['speculative-enabled'],
    structuredRunOutputEnabled: ws.attributes['structured-run-output-enabled'],
    tagNames: ws.attributes['tag-names'],
    terraformVersion: ws.attributes['terraform-version'],
    triggerPrefixes: ws.attributes['trigger-prefixes'],
    vcsRepo: ws.attributes['vcs-repo'],
    vcsRepoIdentifier: ws.attributes['vcs-repo-identifier'],
    workingDirectory: ws.attributes['working-directory'],
    workspaceKpisRunsCount: ws.attributes['workspace-kpis-runs-count'],
    executionMode: ws.attributes['execution-mode'],
    environment: ws.attributes.environment,
    operations: ws.attributes.operations,
    fileTriggersEnabled: ws.attributes['file-triggers-enabled'],
    globalRemoteState: ws.attributes['global-remote-state'],
    latestChangeAt: ws.attributes['latest-change-at'],
    lastAssessmentResultAt: ws.attributes['last-assessment-result-at'],
    autoDestroyAt: ws.attributes['auto-destroy-at'],
    autoDestroyStatus: ws.attributes['auto-destroy-status'],
    autoDestroyActivityDuration: ws.attributes['auto-destroy-activity-duration'],
    inheritsProjectAutoDestroy: ws.attributes['inherits-project-auto-destroy'],
    assessmentsEnabled: ws.attributes['assessments-enabled'],
    allowDestroyPlan: ws.attributes['allow-destroy-plan'],
    autoApplyRunTrigger: ws.attributes['auto-apply-run-trigger'],
    oauthClientName: ws.attributes['oauth-client-name'],
    actions: {
      isDestroyable: ws.attributes.actions?.['is-destroyable'] ?? false
    },
    permissions: {
      canUpdate: ws.attributes.permissions?.['can-update'] ?? false,
      canDestroy: ws.attributes.permissions?.['can-destroy'] ?? false,
      canQueueRun: ws.attributes.permissions?.['can-queue-run'] ?? false,
      canReadRun: ws.attributes.permissions?.['can-read-run'] ?? false,
      canReadVariable: ws.attributes.permissions?.['can-read-variable'] ?? false,
      canUpdateVariable: ws.attributes.permissions?.['can-update-variable'] ?? false,
      canReadStateVersions: ws.attributes.permissions?.['can-read-state-versions'] ?? false,
      canReadStateOutputs: ws.attributes.permissions?.['can-read-state-outputs'] ?? false,
      canCreateStateVersions: ws.attributes.permissions?.['can-create-state-versions'] ?? false,
      canQueueApply: ws.attributes.permissions?.['can-queue-apply'] ?? false,
      canLock: ws.attributes.permissions?.['can-lock'] ?? false,
      canUnlock: ws.attributes.permissions?.['can-unlock'] ?? false,
      canForceUnlock: ws.attributes.permissions?.['can-force-unlock'] ?? false,
      canReadSettings: ws.attributes.permissions?.['can-read-settings'] ?? false,
      canManageTags: ws.attributes.permissions?.['can-manage-tags'] ?? false,
      canManageRunTasks: ws.attributes.permissions?.['can-manage-run-tasks'] ?? false,
      canForceDelete: ws.attributes.permissions?.['can-force-delete'] ?? false,
      canManageAssessments: ws.attributes.permissions?.['can-manage-assessments'] ?? false,
      canManageEphemeralWorkspaces: ws.attributes.permissions?.['can-manage-ephemeral-workspaces'] ?? false,
      canReadAssessmentResults: ws.attributes.permissions?.['can-read-assessment-results'] ?? false,
      canQueueDestroy: ws.attributes.permissions?.['can-queue-destroy'] ?? false
    },
    settingOverwrites: {
      executionMode: ws.attributes['setting-overwrites']?.['execution-mode'],
      agentPool: ws.attributes['setting-overwrites']?.['agent-pool']
    },
    organizationName: ws.relationships?.organization?.data?.id
  };
}

export const resolvers = {
  Query: {
    workspaces: async (_: unknown, { orgName }: { orgName: string }, { dataSources }: Context): Promise<Workspace[]> => {
      const wsResources = await dataSources.workspacesAPI.listWorkspaces(orgName);
      return wsResources.map(mapWorkspaceResourceToDomain);
    },
    workspace: async (_: unknown, { id }: { id: string }, { dataSources }: Context): Promise<Workspace | null> => {
      const wsResource = await dataSources.workspacesAPI.getWorkspace(id);
      if (!wsResource) return null;
      return mapWorkspaceResourceToDomain(wsResource);
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
      return runResources.map(mapRunResourceToDomain);
    }
  }
};