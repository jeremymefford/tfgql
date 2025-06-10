import { OrganizationsAPI } from '../organizations/dataSource';
import { WorkspacesAPI } from '../workspaces/dataSource';
import { UsersAPI } from '../users/dataSource';
import { RunsAPI } from '../runs/dataSource';
import { TeamsAPI } from '../teams/dataSource';
import { ConfigurationVersionsAPI } from '../configurationVersions/dataSource';
import { VariableSetsAPI } from '../variableSets/dataSource';
import { ProjectsAPI } from '../projects/dataSource';
import { VariablesAPI } from '../variables/dataSource';
import { RequestCache } from '../common/requestCache';
import { WorkspaceResourcesAPI } from '../workspaceResources/dataSource';
import { AgentPoolsAPI } from '../agentPools/dataSource';
import { AgentTokensAPI } from '../agentTokens/dataSource';
import { AgentsAPI } from '../agents/dataSource';
import { AppliesAPI } from '../applies/dataSource';
import { AssessmentResultsAPI } from '../assessmentResults/dataSource';
import { CommentsAPI } from '../comments/dataSource';
import { OrganizationMembershipsAPI } from '../organizationMemberships/dataSource';
import { OrganizationTagsAPI } from '../organizationTags/dataSource';
import { PlansAPI } from '../plans/dataSource';
import { PoliciesAPI } from '../policies/dataSource';
import { PolicySetsAPI } from '../policySets/dataSource';
import { PolicyEvaluationsAPI } from '../policyEvaluations/dataSource';
import { PolicySetParametersAPI } from '../policySetParameters/dataSource';
import { ProjectTeamAccessAPI } from '../projectTeamAccess/dataSource';
import { StateVersionOutputsAPI } from '../stateVersionOutputs/dataSource';
import { TeamTokensAPI } from '../teamTokens/dataSource';
import { TeamAccessAPI } from '../teamAccess/dataSource';

/** GraphQL context type */
export interface Context {
  dataSources: {
    usersAPI: UsersAPI;
    organizationsAPI: OrganizationsAPI;
    workspacesAPI: WorkspacesAPI;
    runsAPI: RunsAPI;
    teamsAPI: TeamsAPI;
    configurationVersionsAPI: ConfigurationVersionsAPI;
    variableSetsAPI: VariableSetsAPI;
    projectsAPI: ProjectsAPI;
    variablesAPI: VariablesAPI;
    workspaceResourcesAPI: WorkspaceResourcesAPI;
    agentPoolsAPI: AgentPoolsAPI;
    agentTokensAPI: AgentTokensAPI;
    agentsAPI: AgentsAPI;
    appliesAPI: AppliesAPI;
    assessmentResultsAPI: AssessmentResultsAPI;
    commentsAPI: CommentsAPI;
    organizationMembershipsAPI: OrganizationMembershipsAPI;
    organizationTagsAPI: OrganizationTagsAPI;
    plansAPI: PlansAPI;
    policiesAPI: PoliciesAPI;
    policySetsAPI: PolicySetsAPI;
    policyEvaluationsAPI: PolicyEvaluationsAPI;
    policySetParametersAPI: PolicySetParametersAPI;
    projectTeamAccessAPI: ProjectTeamAccessAPI;
    stateVersionOutputsAPI: StateVersionOutputsAPI;
    teamTokensAPI: TeamTokensAPI;
    teamAccessAPI: TeamAccessAPI;
  };
  requestCache: RequestCache;
}

/**
 * Build the context for each GraphQL request, including data source instances.
 */
export async function buildContext(): Promise<Context> {
  const requestCache = new RequestCache();

  return {
    dataSources: {
      usersAPI: new UsersAPI(requestCache),
      organizationsAPI: new OrganizationsAPI(),
      workspacesAPI: new WorkspacesAPI(),
      runsAPI: new RunsAPI(),
      teamsAPI: new TeamsAPI(),
      configurationVersionsAPI: new ConfigurationVersionsAPI(requestCache),
      variableSetsAPI: new VariableSetsAPI(),
      projectsAPI: new ProjectsAPI(),
      variablesAPI: new VariablesAPI(),
      workspaceResourcesAPI: new WorkspaceResourcesAPI(),
      agentPoolsAPI: new AgentPoolsAPI(),
      agentTokensAPI: new AgentTokensAPI(),
      agentsAPI: new AgentsAPI(),
      appliesAPI: new AppliesAPI(),
      assessmentResultsAPI: new AssessmentResultsAPI(),
      commentsAPI: new CommentsAPI(),
      organizationMembershipsAPI: new OrganizationMembershipsAPI(),
      organizationTagsAPI: new OrganizationTagsAPI(),
      plansAPI: new PlansAPI(),
      policiesAPI: new PoliciesAPI(),
      policySetsAPI: new PolicySetsAPI(),
      policyEvaluationsAPI: new PolicyEvaluationsAPI(),
      policySetParametersAPI: new PolicySetParametersAPI(),
      projectTeamAccessAPI: new ProjectTeamAccessAPI(),
      stateVersionOutputsAPI: new StateVersionOutputsAPI(),
      teamTokensAPI: new TeamTokensAPI(),
      teamAccessAPI: new TeamAccessAPI()
    },
    requestCache
  };
}