import { Context } from '../server/context';
import { Run } from './types';
import { Workspace } from '../workspaces/types';

export const resolvers = {
  Query: {
    runs: async (_: unknown, { workspaceId }: { workspaceId: string }, { dataSources }: Context): Promise<Run[]> => {
      const runResources = await dataSources.runsAPI.listRuns(workspaceId);
      return runResources.map(run => ({
        id: run.id,
        status: run.attributes.status,
        message: run.attributes.message,
        isDestroy: run.attributes['is-destroy'],
        createdAt: run.attributes['created-at'],
        canceledAt: run.attributes['canceled-at'],
        hasChanges: run.attributes['has-changes'],
        autoApply: run.attributes['auto-apply'],
        allowEmptyApply: run.attributes['allow-empty-apply'],
        allowConfigGeneration: run.attributes['allow-config-generation'],
        planOnly: run.attributes['plan-only'],
        source: run.attributes.source,
        statusTimestamps: {
          planQueueableAt: run.attributes['status-timestamps']?.['plan-queueable-at']
        },
        triggerReason: run.attributes['trigger-reason'],
        targetAddrs: run.attributes['target-addrs'],
        replaceAddrs: run.attributes['replace-addrs'],
        permissions: {
          canApply: run.attributes.permissions?.['can-apply'] ?? false,
          canCancel: run.attributes.permissions?.['can-cancel'] ?? false,
          canComment: run.attributes.permissions?.['can-comment'] ?? false,
          canDiscard: run.attributes.permissions?.['can-discard'] ?? false,
          canForceExecute: run.attributes.permissions?.['can-force-execute'] ?? false,
          canForceCancel: run.attributes.permissions?.['can-force-cancel'] ?? false,
          canOverridePolicyCheck: run.attributes.permissions?.['can-override-policy-check'] ?? false
        },
        actions: {
          isCancelable: run.attributes.actions?.['is-cancelable'] ?? false,
          isConfirmable: run.attributes.actions?.['is-confirmable'] ?? false,
          isDiscardable: run.attributes.actions?.['is-discardable'] ?? false,
          isForceCancelable: run.attributes.actions?.['is-force-cancelable'] ?? false
        },
        refresh: run.attributes.refresh,
        refreshOnly: run.attributes['refresh-only'],
        savePlan: run.attributes['save-plan'],
        variables: run.attributes.variables,
        workspaceId: run.relationships?.workspace?.data?.id
      }));
    },
    run: async (_: unknown, { id }: { id: string }, { dataSources }: Context): Promise<Run | null> => {
      const runResource = await dataSources.runsAPI.getRun(id);
      if (!runResource) return null;
      return {
        id: runResource.id,
        status: runResource.attributes.status,
        message: runResource.attributes.message,
        isDestroy: runResource.attributes['is-destroy'],
        createdAt: runResource.attributes['created-at'],
        canceledAt: runResource.attributes['canceled-at'],
        hasChanges: runResource.attributes['has-changes'],
        autoApply: runResource.attributes['auto-apply'],
        allowEmptyApply: runResource.attributes['allow-empty-apply'],
        allowConfigGeneration: runResource.attributes['allow-config-generation'],
        planOnly: runResource.attributes['plan-only'],
        source: runResource.attributes.source,
        statusTimestamps: {
          planQueueableAt: runResource.attributes['status-timestamps']?.['plan-queueable-at']
        },
        triggerReason: runResource.attributes['trigger-reason'],
        targetAddrs: runResource.attributes['target-addrs'],
        replaceAddrs: runResource.attributes['replace-addrs'],
        permissions: {
          canApply: runResource.attributes.permissions?.['can-apply'] ?? false,
          canCancel: runResource.attributes.permissions?.['can-cancel'] ?? false,
          canComment: runResource.attributes.permissions?.['can-comment'] ?? false,
          canDiscard: runResource.attributes.permissions?.['can-discard'] ?? false,
          canForceExecute: runResource.attributes.permissions?.['can-force-execute'] ?? false,
          canForceCancel: runResource.attributes.permissions?.['can-force-cancel'] ?? false,
          canOverridePolicyCheck: runResource.attributes.permissions?.['can-override-policy-check'] ?? false
        },
        actions: {
          isCancelable: runResource.attributes.actions?.['is-cancelable'] ?? false,
          isConfirmable: runResource.attributes.actions?.['is-confirmable'] ?? false,
          isDiscardable: runResource.attributes.actions?.['is-discardable'] ?? false,
          isForceCancelable: runResource.attributes.actions?.['is-force-cancelable'] ?? false
        },
        refresh: runResource.attributes.refresh,
        refreshOnly: runResource.attributes['refresh-only'],
        savePlan: runResource.attributes['save-plan'],
        variables: runResource.attributes.variables,
        workspaceId: runResource.relationships?.workspace?.data?.id
      };
    }
  },
  Mutation: {
    createRun: async (_: unknown, { workspaceId, message, isDestroy, configVersionId }: { workspaceId: string; message?: string; isDestroy?: boolean; configVersionId?: string }, { dataSources }: Context): Promise<Run> => {
      const runResource = await dataSources.runsAPI.createRun(workspaceId, message, isDestroy, configVersionId);
      return {
        id: runResource.id,
        status: runResource.attributes.status,
        message: runResource.attributes.message,
        isDestroy: runResource.attributes['is-destroy'],
        createdAt: runResource.attributes['created-at'],
        canceledAt: runResource.attributes['canceled-at'],
        hasChanges: runResource.attributes['has-changes'],
        autoApply: runResource.attributes['auto-apply'],
        allowEmptyApply: runResource.attributes['allow-empty-apply'],
        allowConfigGeneration: runResource.attributes['allow-config-generation'],
        planOnly: runResource.attributes['plan-only'],
        source: runResource.attributes.source,
        statusTimestamps: {
          planQueueableAt: runResource.attributes['status-timestamps']?.['plan-queueable-at']
        },
        triggerReason: runResource.attributes['trigger-reason'],
        targetAddrs: runResource.attributes['target-addrs'],
        replaceAddrs: runResource.attributes['replace-addrs'],
        permissions: {
          canApply: runResource.attributes.permissions?.['can-apply'] ?? false,
          canCancel: runResource.attributes.permissions?.['can-cancel'] ?? false,
          canComment: runResource.attributes.permissions?.['can-comment'] ?? false,
          canDiscard: runResource.attributes.permissions?.['can-discard'] ?? false,
          canForceExecute: runResource.attributes.permissions?.['can-force-execute'] ?? false,
          canForceCancel: runResource.attributes.permissions?.['can-force-cancel'] ?? false,
          canOverridePolicyCheck: runResource.attributes.permissions?.['can-override-policy-check'] ?? false
        },
        actions: {
          isCancelable: runResource.attributes.actions?.['is-cancelable'] ?? false,
          isConfirmable: runResource.attributes.actions?.['is-confirmable'] ?? false,
          isDiscardable: runResource.attributes.actions?.['is-discardable'] ?? false,
          isForceCancelable: runResource.attributes.actions?.['is-force-cancelable'] ?? false
        },
        refresh: runResource.attributes.refresh,
        refreshOnly: runResource.attributes['refresh-only'],
        savePlan: runResource.attributes['save-plan'],
        variables: runResource.attributes.variables,
        workspaceId: runResource.relationships?.workspace?.data?.id
      };
    }
  },
  Run: {
    workspace: async (run: Run, _: unknown, { dataSources }: Context): Promise<Workspace | null> => {
      const workspaceId = run.workspaceId;
      if (!workspaceId) return null;
      const wsResource = await dataSources.workspacesAPI.getWorkspace(workspaceId);
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
  }
};