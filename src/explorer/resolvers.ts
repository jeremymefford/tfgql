import { coalesceOrgs } from '../common/orgHelper';
import { parallelizeBounded } from '../common/concurrency/parallelizeBounded';
import { evaluateWhereClause } from '../common/filtering/filtering';
import type { Context } from '../server/context';
import type {
  ExplorerModuleField,
  ExplorerModuleRow,
  ExplorerProviderField,
  ExplorerProviderRow,
  ExplorerTerraformVersionField,
  ExplorerTerraformVersionRow,
  ExplorerWorkspaceField,
  ExplorerWorkspaceRow,
  ExplorerQueryOptions,
  ExplorerFilterInput,
  ExplorerSortInput,
  ExplorerRowBase
} from './types';
import type { Workspace, WorkspaceFilter } from '../workspaces/types';
import type { Project } from '../projects/types';
import type { Run } from '../runs/types';
import type { Organization } from '../organizations/types';

const buildOptions = <Field extends string>({
  fields,
  sort,
  filters,
}: {
  fields?: Field[] | null;
  sort?: ExplorerSortInput<Field>[] | null;
  filters?: ExplorerFilterInput<Field>[] | null;
}): ExplorerQueryOptions<Field> => ({
  fields: fields ?? undefined,
  sort: sort ?? undefined,
  filters: filters ?? undefined,
});

async function executeExplorerQuery<Field extends string, R extends ExplorerRowBase>(
  ctx: Context,
  includeOrgs: string[] | undefined | null,
  excludeOrgs: string[] | undefined | null,
  options: ExplorerQueryOptions<Field>,
  queryFn: (org: string, opts: ExplorerQueryOptions<Field>) => Promise<{ data: R[] }>
): Promise<R[]> {
  const organizations = await coalesceOrgs(ctx, includeOrgs, excludeOrgs);
  if (organizations.length === 0) {
    return [];
  }

  const allRows: R[] = [];
  for (const org of organizations) {
    const { data } = await queryFn(org, options);
    data.forEach((row) => {
      row.__organizationName = org;
    });
    allRows.push(...data);
  }
  return allRows;
}

const parseWorkspaceNames = (value: string | null | undefined): string[] =>
  (value ?? '')
    .split(',')
    .map((name) => name.trim())
    .filter((name) => name.length > 0);

async function fetchWorkspacesByNames(
  ctx: Context,
  orgName: string,
  names: string | null,
  filter?: WorkspaceFilter
): Promise<Workspace[]> {
  const parsedNames = parseWorkspaceNames(names);
  const uniqueNames = Array.from(new Set(parsedNames));
  const resolved = await parallelizeBounded(uniqueNames, async (workspaceName) =>
    await ctx.dataSources.workspacesAPI.getWorkspaceByName(orgName, workspaceName)
  );

  return resolved.filter((workspace) => workspace != null)
    .filter((workspace) => !filter || evaluateWhereClause<Workspace, WorkspaceFilter>(filter, workspace));
}

export const resolvers = {
  Query: {
    explorerWorkspaces: async (
      _: unknown,
      args: {
        includeOrgs?: string[] | null;
        excludeOrgs?: string[] | null;
        fields?: ExplorerWorkspaceField[] | null;
        sort?: ExplorerSortInput<ExplorerWorkspaceField>[] | null;
        filters?: ExplorerFilterInput<ExplorerWorkspaceField>[] | null;
      },
      ctx: Context
    ): Promise<ExplorerWorkspaceRow[]> => {
      const options = buildOptions({ fields: args.fields, sort: args.sort, filters: args.filters });
      return executeExplorerQuery(ctx, args.includeOrgs, args.excludeOrgs, options, (org, opts) =>
        ctx.dataSources.explorerAPI.queryWorkspaces(org, opts)
      );
    },

    explorerTerraformVersions: async (
      _: unknown,
      args: {
        includeOrgs?: string[] | null;
        excludeOrgs?: string[] | null;
        fields?: ExplorerTerraformVersionField[] | null;
        sort?: ExplorerSortInput<ExplorerTerraformVersionField>[] | null;
        filters?: ExplorerFilterInput<ExplorerTerraformVersionField>[] | null;
      },
      ctx: Context
    ): Promise<ExplorerTerraformVersionRow[]> => {
      const options = buildOptions({ fields: args.fields, sort: args.sort, filters: args.filters });
      return executeExplorerQuery(ctx, args.includeOrgs, args.excludeOrgs, options, (org, opts) =>
        ctx.dataSources.explorerAPI.queryTerraformVersions(org, opts)
      );
    },

    explorerProviders: async (
      _: unknown,
      args: {
        includeOrgs?: string[] | null;
        excludeOrgs?: string[] | null;
        fields?: ExplorerProviderField[] | null;
        sort?: ExplorerSortInput<ExplorerProviderField>[] | null;
        filters?: ExplorerFilterInput<ExplorerProviderField>[] | null;
      },
      ctx: Context
    ): Promise<ExplorerProviderRow[]> => {
      const options = buildOptions({ fields: args.fields, sort: args.sort, filters: args.filters });
      return executeExplorerQuery(ctx, args.includeOrgs, args.excludeOrgs, options, (org, opts) =>
        ctx.dataSources.explorerAPI.queryProviders(org, opts)
      );
    },

    explorerModules: async (
      _: unknown,
      args: {
        includeOrgs?: string[] | null;
        excludeOrgs?: string[] | null;
        fields?: ExplorerModuleField[] | null;
        sort?: ExplorerSortInput<ExplorerModuleField>[] | null;
        filters?: ExplorerFilterInput<ExplorerModuleField>[] | null;
      },
      ctx: Context
    ): Promise<ExplorerModuleRow[]> => {
      const options = buildOptions({ fields: args.fields, sort: args.sort, filters: args.filters });
      return executeExplorerQuery(ctx, args.includeOrgs, args.excludeOrgs, options, (org, opts) =>
        ctx.dataSources.explorerAPI.queryModules(org, opts)
      );
    },
  },
  ExplorerWorkspaceRow: {
    workspace: async (row: ExplorerWorkspaceRow, _: unknown, ctx: Context): Promise<Workspace | null> => {
      if (!row.externalId) {
        return null;
      }
      return ctx.dataSources.workspacesAPI.getWorkspace(row.externalId);
    },
    project: async (row: ExplorerWorkspaceRow, _: unknown, ctx: Context): Promise<Project | null> => {
      if (!row.projectExternalId) {
        return null;
      }
      const orgName = row.organizationName ?? row.__organizationName;
      if (!orgName) {
        return null;
      }
      return ctx.dataSources.projectsAPI.getProject(row.projectExternalId);
    },
    currentRun: async (row: ExplorerWorkspaceRow, _: unknown, ctx: Context): Promise<Run | null> => {
      if (!row.currentRunExternalId) {
        return null;
      }
      return ctx.dataSources.runsAPI.getRun(row.currentRunExternalId);
    },
    organization: async (row: ExplorerWorkspaceRow, _: unknown, ctx: Context): Promise<Organization | null> => {
      if (!row.organizationName) {
        return null;
      }
      return ctx.dataSources.organizationsAPI.getOrganization(row.organizationName);
    },
  },
  ExplorerTerraformVersionRow: {
    workspaceEntities: async (
      row: ExplorerTerraformVersionRow,
      args: { filter?: WorkspaceFilter } = {},
      ctx: Context
    ): Promise<Workspace[]> => {
      const orgName = row.__organizationName;
      if (!orgName) {
        return [];
      }

      return fetchWorkspacesByNames(ctx, orgName, row.workspaces, args.filter);
    },
  },
  ExplorerProviderRow: {
    workspaceEntities: async (
      row: ExplorerProviderRow,
      args: { filter?: WorkspaceFilter } = {},
      ctx: Context
    ): Promise<Workspace[]> => {
      const orgName = row.__organizationName;
      if (!orgName) {
        return [];
      }

      return fetchWorkspacesByNames(ctx, orgName, row.workspaces, args.filter);
    },
  },
  ExplorerModuleRow: {
    workspaceEntities: async (
      row: ExplorerModuleRow,
      args: { filter?: WorkspaceFilter } = {},
      ctx: Context
    ): Promise<Workspace[]> => {
      const orgName = row.__organizationName;
      if (!orgName) {
        return [];
      }
      return fetchWorkspacesByNames(ctx, orgName, row.workspaces, args.filter);
    },
  },
};
