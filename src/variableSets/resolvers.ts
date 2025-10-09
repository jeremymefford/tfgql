import { Context } from "../server/context";
import { VariableSet, VariableSetFilter } from "./types";
import { Organization } from "../organizations/types";
import { gatherAsyncGeneratorPromises } from "../common/streamPages";
import { fetchResources } from "../common/fetchResources";
import { Workspace, WorkspaceFilter } from "../workspaces/types";
import { Variable, VariableFilter } from "../variables/types";
import { parallelizeBounded } from "../common/concurrency/parallelizeBounded";
import { evaluateWhereClause } from "../common/filtering/filtering";
import { Project, ProjectFilter } from "../projects/types";
import { coalesceOrgs } from "../common/orgHelper";

export const resolvers = {
  Query: {
    variableSet: async (
      _: unknown,
      { id }: { id: string },
      ctx: Context,
    ): Promise<VariableSet | null> => {
      return ctx.dataSources.variableSetsAPI.getVariableSet(id);
    },
    variableSets: async (
      _: unknown,
      {
        includeOrgs,
        excludeOrgs,
        filter,
      }: {
        includeOrgs?: string[];
        excludeOrgs?: string[];
        filter?: VariableSetFilter;
      },
      ctx: Context,
    ): Promise<VariableSet[]> => {
      const orgs = await coalesceOrgs(ctx, includeOrgs, excludeOrgs);
      if (orgs.length === 0) {
        return [];
      }

      const results: VariableSet[] = [];
      await parallelizeBounded(orgs, async (orgId) => {
        const sets = await gatherAsyncGeneratorPromises(
          ctx.dataSources.variableSetsAPI.listVariableSetsForOrg(orgId, filter),
        );
        results.push(...sets);
      });
      return results;
    },
  },
  VariableSet: {
    organization: async (
      varset: VariableSet,
      _: unknown,
      ctx: Context,
    ): Promise<Organization | null> => {
      if (!varset.organizationId) return null;
      return ctx.dataSources.organizationsAPI.getOrganization(
        varset.organizationId,
      );
    },
    workspaces: async (
      varset: VariableSet,
      { filter }: { filter?: WorkspaceFilter },
      ctx: Context,
    ): Promise<Workspace[]> => {
      return fetchResources<string, Workspace, WorkspaceFilter>(
        varset.workspaceIds,
        (id) => ctx.dataSources.workspacesAPI.getWorkspace(id),
        filter,
      );
    },
    projects: async (
      varset: VariableSet,
      { filter }: { filter?: ProjectFilter },
      ctx: Context,
    ): Promise<Project[]> => {
      const projectIds = await ctx.dataSources.variableSetsAPI.listProjectIDs(
        varset.id,
      );
      const projects: Project[] = [];
      await parallelizeBounded(projectIds, async (projectId) => {
        const project = await ctx.dataSources.projectsAPI.getProject(projectId);
        if (
          project &&
          evaluateWhereClause<Project, ProjectFilter>(filter, project)
        ) {
          projects.push(project);
        }
      });
      return projects;
    },
    vars: async (
      varset: VariableSet,
      { filter }: { filter?: VariableFilter },
      ctx: Context,
    ): Promise<Variable[]> => {
      return ctx.dataSources.variableSetsAPI.listVariables(varset.id, filter);
    },
  },
};
