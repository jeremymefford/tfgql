import { DomainMapper } from "../common/middleware/domainMapper";
import { Workspace, WorkspaceResource } from "./types";

export const workspaceMapper: DomainMapper<WorkspaceResource, Workspace> = {
  map(ws: WorkspaceResource): Workspace {
    return {
      id: ws.id,
      name: ws.attributes.name,
      description: ws.attributes.description,
      locked: ws.attributes.locked,
      lockedReason: ws.attributes["locked-reason"],
      autoApply: ws.attributes["auto-apply"],
      createdAt: new Date(ws.attributes["created-at"]),
      updatedAt: new Date(ws.attributes["updated-at"]),
      applyDurationAverage: ws.attributes["apply-duration-average"],
      planDurationAverage: ws.attributes["plan-duration-average"],
      policyCheckFailures: ws.attributes["policy-check-failures"],
      queueAllRuns: ws.attributes["queue-all-runs"],
      resourceCount: ws.attributes["resource-count"],
      runFailures: ws.attributes["run-failures"],
      source: ws.attributes.source,
      sourceName: ws.attributes["source-name"],
      sourceUrl: ws.attributes["source-url"],
      speculativeEnabled: ws.attributes["speculative-enabled"],
      structuredRunOutputEnabled:
        ws.attributes["structured-run-output-enabled"],
      tagNames: ws.attributes["tag-names"],
      terraformVersion: ws.attributes["terraform-version"],
      triggerPrefixes: ws.attributes["trigger-prefixes"],
      vcsRepo: ws.attributes["vcs-repo"],
      vcsRepoIdentifier: ws.attributes["vcs-repo-identifier"],
      workingDirectory: ws.attributes["working-directory"],
      workspaceKpisRunsCount: ws.attributes["workspace-kpis-runs-count"],
      executionMode: ws.attributes["execution-mode"],
      environment: ws.attributes.environment,
      operations: ws.attributes.operations,
      fileTriggersEnabled: ws.attributes["file-triggers-enabled"],
      globalRemoteState: ws.attributes["global-remote-state"],
      latestChangeAt: ws.attributes["latest-change-at"],
      lastAssessmentResultAt: ws.attributes["last-assessment-result-at"],
      autoDestroyAt: ws.attributes["auto-destroy-at"],
      autoDestroyStatus: ws.attributes["auto-destroy-status"],
      autoDestroyActivityDuration:
        ws.attributes["auto-destroy-activity-duration"],
      inheritsProjectAutoDestroy:
        ws.attributes["inherits-project-auto-destroy"],
      assessmentsEnabled: ws.attributes["assessments-enabled"],
      allowDestroyPlan: ws.attributes["allow-destroy-plan"],
      autoApplyRunTrigger: ws.attributes["auto-apply-run-trigger"],
      oauthClientName: ws.attributes["oauth-client-name"],
      actions: {
        isDestroyable: ws.attributes.actions?.["is-destroyable"] ?? false,
      },
      permissions: {
        canUpdate: ws.attributes.permissions?.["can-update"] ?? false,
        canDestroy: ws.attributes.permissions?.["can-destroy"] ?? false,
        canQueueRun: ws.attributes.permissions?.["can-queue-run"] ?? false,
        canReadRun: ws.attributes.permissions?.["can-read-run"] ?? false,
        canReadVariable:
          ws.attributes.permissions?.["can-read-variable"] ?? false,
        canUpdateVariable:
          ws.attributes.permissions?.["can-update-variable"] ?? false,
        canReadStateVersions:
          ws.attributes.permissions?.["can-read-state-versions"] ?? false,
        canReadStateOutputs:
          ws.attributes.permissions?.["can-read-state-outputs"] ?? false,
        canCreateStateVersions:
          ws.attributes.permissions?.["can-create-state-versions"] ?? false,
        canQueueApply: ws.attributes.permissions?.["can-queue-apply"] ?? false,
        canLock: ws.attributes.permissions?.["can-lock"] ?? false,
        canUnlock: ws.attributes.permissions?.["can-unlock"] ?? false,
        canForceUnlock:
          ws.attributes.permissions?.["can-force-unlock"] ?? false,
        canReadSettings:
          ws.attributes.permissions?.["can-read-settings"] ?? false,
        canManageTags: ws.attributes.permissions?.["can-manage-tags"] ?? false,
        canManageRunTasks:
          ws.attributes.permissions?.["can-manage-run-tasks"] ?? false,
        canForceDelete:
          ws.attributes.permissions?.["can-force-delete"] ?? false,
        canManageAssessments:
          ws.attributes.permissions?.["can-manage-assessments"] ?? false,
        canManageEphemeralWorkspaces:
          ws.attributes.permissions?.["can-manage-ephemeral-workspaces"] ??
          false,
        canReadAssessmentResults:
          ws.attributes.permissions?.["can-read-assessment-results"] ?? false,
        canQueueDestroy:
          ws.attributes.permissions?.["can-queue-destroy"] ?? false,
      },
      settingOverwrites: {
        executionMode: ws.attributes["setting-overwrites"]?.["execution-mode"],
        agentPool: ws.attributes["setting-overwrites"]?.["agent-pool"],
      },
      organizationName: ws.relationships.organization.data.id,
      projectId: ws.relationships.project.data.id,
      currentRunId: ws.relationships["current-run"]?.data?.id,
    };
  },
};
