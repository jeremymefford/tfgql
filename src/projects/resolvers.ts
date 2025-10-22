import { gatherAsyncGeneratorPromises } from "../common/streamPages";
import { Context } from "../server/context";
import { Project, ProjectFilter } from "./types";
import {
  ProjectTeamAccess,
  ProjectTeamAccessFilter,
} from "../projectTeamAccess/types";
import { Workspace, WorkspaceFilter } from "../workspaces/types";
import { Team, TeamFilter } from "../teams/types";
import { VariableSet, VariableSetFilter } from "../variableSets/types";
import { parallelizeBounded } from "../common/concurrency/parallelizeBounded";
import { evaluateWhereClause } from "../common/filtering/filtering";
import { coalesceOrgs } from "../common/orgHelper";

export const resolvers = {
  Query: {
    projects: async (
      _: unknown,
      {
        includeOrgs,
        excludeOrgs,
        filter,
      }: {
        includeOrgs?: string[];
        excludeOrgs?: string[];
        filter?: ProjectFilter;
      },
      ctx: Context,
    ): Promise<Project[]> => {
      const orgs = await coalesceOrgs(ctx, includeOrgs, excludeOrgs);
      if (orgs.length === 0) {
        return [];
      }

      const results: Project[] = [];
      await parallelizeBounded(orgs, async (orgId) => {
        const projects = await gatherAsyncGeneratorPromises(
          ctx.dataSources.projectsAPI.listProjects(orgId, filter),
        );
        results.push(...projects);
      });
      return results;
    },
    project: async (
      _: unknown,
      { id }: { id: string },
      { dataSources }: Context,
    ): Promise<Project | null> => dataSources.projectsAPI.getProject(id),
  },
  Project: {
    teamAccess: (
      project: Project,
      { filter }: { filter?: ProjectTeamAccessFilter },
      { dataSources }: Context,
    ): Promise<ProjectTeamAccess[]> =>
      gatherAsyncGeneratorPromises(
        dataSources.projectTeamAccessAPI.listProjectTeamAccess(
          project.id,
          filter,
        ),
      ),
    workspaces: (
      project: Project,
      { filter }: { filter?: WorkspaceFilter },
      { dataSources }: Context,
    ): Promise<Workspace[]> =>
      gatherAsyncGeneratorPromises(
        dataSources.workspacesAPI.getWorkspacesByProjectId(project.id, filter),
      ),
    teams: async (
      project: Project,
      { filter }: { filter?: TeamFilter },
      { dataSources }: Context,
    ): Promise<Team[]> => {
      const teams: Team[] = [];
      for await (const teamAccessPage of dataSources.projectTeamAccessAPI.listProjectTeamAccess(
        project.id,
      )) {
        await parallelizeBounded(teamAccessPage, async (teamAccess) => {
          const team = await dataSources.teamsAPI.getTeam(teamAccess.teamId);
          if (team && evaluateWhereClause(filter, team)) {
            teams.push(team);
          }
        });
      }
      return teams;
    },
    variableSets: (
      project: Project,
      { filter }: { filter?: VariableSetFilter },
      { dataSources }: Context,
    ): Promise<VariableSet[]> =>
      gatherAsyncGeneratorPromises(
        dataSources.variableSetsAPI.listVariableSetsForProject(
          project.id,
          filter,
        ),
      ),
  },
};
