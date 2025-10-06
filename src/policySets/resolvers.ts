import { Context } from '../server/context';
import { PolicySet, PolicySetFilter } from './types';
import { gatherAsyncGeneratorPromises } from '../common/streamPages';
import { fetchResources } from '../common/fetchResources';
import { Policy, PolicyFilter } from '../policies/types';
import { Project, ProjectFilter } from '../projects/types';
import { Workspace, WorkspaceFilter } from '../workspaces/types';
import { PolicySetParameter, PolicySetParameterFilter } from '../policySetParameters/types';

export const resolvers = {
  Query: {
    policySets: async (
      _: unknown,
      { organization, filter }: { organization: string, filter?: PolicySetFilter },
      ctx: Context
    ): Promise<PolicySet[]> =>
      gatherAsyncGeneratorPromises(ctx.dataSources.policySetsAPI.listPolicySets(organization, filter)),
    policySet: async (
      _: unknown,
      { id }: { id: string },
      ctx: Context
    ): Promise<PolicySet | null> => ctx.dataSources.policySetsAPI.getPolicySet(id)
  },
  PolicySet: {
    organization: (set: PolicySet, _: unknown, ctx: Context) =>
      ctx.dataSources.organizationsAPI.getOrganization(set.organizationId),
    policies: (
      set: PolicySet,
      { filter }: { filter?: PolicyFilter },
      ctx: Context
    ) => fetchResources<string, Policy, PolicyFilter>(
      set.policyIds,
      id => ctx.dataSources.policiesAPI.getPolicy(id),
      filter
    ),
    projects: (
      set: PolicySet,
      { filter }: { filter?: ProjectFilter },
      ctx: Context
    ) => fetchResources<string, Project, ProjectFilter>(
      set.projectIds,
      id => ctx.dataSources.projectsAPI.getProject(id),
      filter
    ),
    workspaces: (
      set: PolicySet,
      { filter }: { filter?: WorkspaceFilter },
      ctx: Context
    ) => fetchResources<string, Workspace, WorkspaceFilter>(
      set.workspaceIds,
      id => ctx.dataSources.workspacesAPI.getWorkspace(id),
      filter
    ),
    workspaceExclusions: (
      set: PolicySet,
      { filter }: { filter?: WorkspaceFilter },
      ctx: Context
    ) =>
      fetchResources<string, Workspace, WorkspaceFilter>(
        set.workspaceExclusionIds,
        id => ctx.dataSources.workspacesAPI.getWorkspace(id),
        filter
      ),
    parameters: (
      set: PolicySet,
      { filter }: { filter?: PolicySetParameterFilter },
      ctx: Context
    ) =>
      gatherAsyncGeneratorPromises(
        ctx.dataSources.policySetParametersAPI.listPolicySetParameters(set.id, filter)
      )
  }
};
