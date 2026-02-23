---
title: Entities
description: Reference documentation for all TFGQL entity types
---

# Entities

TFGQL exposes the Terraform Cloud / Enterprise domain model as a rich entity graph. Each entity listed below can be queried at the root level or resolved through relationships on parent types.

For the full field-by-field schema reference, see the [API Reference](../API%20Reference/).

---

## Core

| Entity | Description |
| ------ | ----------- |
| [Agents](agents) | Individual agent processes registered to a pool |
| [Agent Pools](agent-pools) | Named groups of agents scoped to an organization |
| [Agent Tokens](agent-tokens) | Authentication tokens used by agents to connect |

## Governance

| Entity | Description |
| ------ | ----------- |
| [Policy Evaluations](policy-evaluations) | Sentinel / OPA evaluation results from agent-mode runs |
| [Policy Set Parameters](policy-set-parameters) | Key-value configuration for policy sets |

## Access Control

| Entity | Description |
| ------ | ----------- |
| [Organization Memberships](organization-memberships) | User membership records across organizations |
| [Organization Tags](organization-tags) | Tags applied to workspaces within an organization |
| [Project Team Access](project-team-access) | Team permission grants at the project level |
| [Workspace Team Access](workspace-team-access) | Team permission grants at the workspace level |
| [Team Tokens](team-tokens) | API tokens scoped to a team |

## Configuration & State

| Entity | Description |
| ------ | ----------- |
| [Configuration Versions](configuration-versions) | Terraform configuration uploads with VCS metadata |
| [State Version Outputs](state-version-outputs) | Output values from Terraform state |
| [Workspace Resources](workspace-resources) | Individual Terraform-managed resources |

## Collaboration

| Entity | Description |
| ------ | ----------- |
| [Assessment Results](assessment-results) | Drift detection and health check results |
| [Comments](comments) | User comments attached to runs |
