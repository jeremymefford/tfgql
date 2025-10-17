import { Run, RunResource, RunEvent, RunEventResource } from "./types";
import { DomainMapper } from "../common/middleware/domainMapper";

export const runMapper: DomainMapper<RunResource, Run> = {
  map(run: any): Run {
    return {
      id: run.id,
      status: run.attributes.status,
      message: run.attributes.message,
      isDestroy: run.attributes["is-destroy"],
      createdAt: run.attributes["created-at"],
      canceledAt: run.attributes["canceled-at"],
      hasChanges: run.attributes["has-changes"],
      autoApply: run.attributes["auto-apply"],
      allowEmptyApply: run.attributes["allow-empty-apply"],
      allowConfigGeneration: run.attributes["allow-config-generation"],
      planOnly: run.attributes["plan-only"],
      source: run.attributes.source,
      statusTimestamps: {
        planQueueableAt:
          run.attributes["status-timestamps"]?.["plan-queueable-at"],
      },
      triggerReason: run.attributes["trigger-reason"],
      targetAddrs: run.attributes["target-addrs"],
      replaceAddrs: run.attributes["replace-addrs"],
      permissions: {
        canApply: run.attributes.permissions?.["can-apply"] ?? false,
        canCancel: run.attributes.permissions?.["can-cancel"] ?? false,
        canComment: run.attributes.permissions?.["can-comment"] ?? false,
        canDiscard: run.attributes.permissions?.["can-discard"] ?? false,
        canForceExecute:
          run.attributes.permissions?.["can-force-execute"] ?? false,
        canForceCancel:
          run.attributes.permissions?.["can-force-cancel"] ?? false,
        canOverridePolicyCheck:
          run.attributes.permissions?.["can-override-policy-check"] ?? false,
      },
      actions: {
        isCancelable: run.attributes.actions?.["is-cancelable"] ?? false,
        isConfirmable: run.attributes.actions?.["is-confirmable"] ?? false,
        isDiscardable: run.attributes.actions?.["is-discardable"] ?? false,
        isForceCancelable:
          run.attributes.actions?.["is-force-cancelable"] ?? false,
      },
      refresh: run.attributes.refresh,
      refreshOnly: run.attributes["refresh-only"],
      savePlan: run.attributes["save-plan"],
      variables: run.attributes.variables,
      workspace: run.relationships?.workspace?.data,
      configurationVersion: run.relationships?.["configuration-version"]?.data,
      taskStageIds:
        run.relationships?.["task-stages"]?.data?.map(
          (stage: { id: string }): string => stage.id,
        ) ?? undefined,
    };
  },
};

/**
 * Mapper for low-level run events emitted by a run.
 */
export const runEventMapper: DomainMapper<RunEventResource, RunEvent> = {
  map(evt: RunEventResource): RunEvent {
    return { id: evt.id, body: evt.attributes };
  },
};
