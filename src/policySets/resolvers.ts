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
      { dataSources }: Context
    ): Promise<Promise<PolicySet>[]> =>
      gatherAsyncGeneratorPromises(dataSources.policySetsAPI.listPolicySets(organization, filter)),
    policySet: async (
      _: unknown,
      { id }: { id: string },
      { dataSources }: Context
    ): Promise<PolicySet | null> => dataSources.policySetsAPI.getPolicySet(id)
  },
  PolicySet: {
    organization: (set: PolicySet, _: unknown, { dataSources }: Context) =>
      dataSources.organizationsAPI.getOrganization(set.organizationId),
    policies: (
      set: PolicySet,
      { filter }: { filter?: PolicyFilter },
      { dataSources }: Context
    ) => fetchResources<string, Policy, PolicyFilter>(
      set.policyIds,
      id => dataSources.policiesAPI.getPolicy(id),
      filter
    ),
    projects: (
      set: PolicySet,
      { filter }: { filter?: ProjectFilter },
      { dataSources }: Context
    ) => fetchResources<string, Project, ProjectFilter>(
      set.projectIds,
      id => dataSources.projectsAPI.getProject(id),
      filter
    ),
    workspaces: (
      set: PolicySet,
      { filter }: { filter?: WorkspaceFilter },
      { dataSources }: Context
    ) => fetchResources<string, Workspace, WorkspaceFilter>(
      set.workspaceIds,
      id => dataSources.workspacesAPI.getWorkspace(id),
      filter
    ),
    workspaceExclusions: (
      set: PolicySet,
      { filter }: { filter?: WorkspaceFilter },
      { dataSources }: Context
    ) =>
      fetchResources<string, Workspace, WorkspaceFilter>(
        set.workspaceExclusionIds,
        id => dataSources.workspacesAPI.getWorkspace(id),
        filter
      ),
    parameters: (
      set: PolicySet,
      { filter }: { filter?: PolicySetParameterFilter },
      { dataSources }: Context
    ) =>
      gatherAsyncGeneratorPromises(
        dataSources.policySetParametersAPI.listPolicySetParameters(
          filter
            ? { _and: [filter, { policySetId: { _eq: set.id } }] }
            : { policySetId: { _eq: set.id } }
        )
      )
  }
};