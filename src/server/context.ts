import { OrganizationsAPI } from "../organizations/dataSource";
import { WorkspacesAPI } from "../workspaces/dataSource";
import { UsersAPI } from "../users/dataSource";
import { RunsAPI } from "../runs/dataSource";
import { TeamsAPI } from "../teams/dataSource";
import { ConfigurationVersionsAPI } from "../configurationVersions/dataSource";
import { VariableSetsAPI } from "../variableSets/dataSource";
import { ProjectsAPI } from "../projects/dataSource";
import { VariablesAPI } from "../variables/dataSource";
import type { AxiosInstance } from "axios";
import { RequestCache } from "../common/requestCache";
import type { Logger } from "pino";
import { WorkspaceResourcesAPI } from "../workspaceResources/dataSource";
import { AgentPoolsAPI } from "../agentPools/dataSource";
import { AgentTokensAPI } from "../agentTokens/dataSource";
import { AgentsAPI } from "../agents/dataSource";
import { AppliesAPI } from "../applies/dataSource";
import { AssessmentResultsAPI } from "../assessmentResults/dataSource";
import { CommentsAPI } from "../comments/dataSource";
import { OrganizationMembershipsAPI } from "../organizationMemberships/dataSource";
import { OrganizationTagsAPI } from "../organizationTags/dataSource";
import { PlansAPI } from "../plans/dataSource";
import { PoliciesAPI } from "../policies/dataSource";
import { PolicySetsAPI } from "../policySets/dataSource";
import { PolicyEvaluationsAPI } from "../policyEvaluations/dataSource";
import { PolicySetParametersAPI } from "../policySetParameters/dataSource";
import { ProjectTeamAccessAPI } from "../projectTeamAccess/dataSource";
import { StateVersionOutputsAPI } from "../stateVersionOutputs/dataSource";
import { StateVersionsAPI } from "../stateVersions/dataSource";
import { TeamTokensAPI } from "../teamTokens/dataSource";
import { TeamAccessAPI } from "../workspaceTeamAccess/dataSource";
import { RunTriggersAPI } from "../runTriggers/dataSource";
import { ExplorerAPI } from "../explorer/dataSource";
import { createHttpClient } from "../common/httpClient";
import { applicationConfiguration } from "../common/conf";
import { AdminAPI } from "../admin/dataSource";

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
    stateVersionsAPI: StateVersionsAPI;
    teamTokensAPI: TeamTokensAPI;
    teamAccessAPI: TeamAccessAPI;
    runTriggersAPI: RunTriggersAPI;
    explorerAPI: ExplorerAPI;
    adminAPI: AdminAPI;
  };
  requestCache: RequestCache;
  logger: Logger;
  httpClient: AxiosInstance;
  deploymentTarget: "tfc" | "tfe";
}

/**
 * Build the context for each GraphQL request, including data source instances.
 */
export async function buildContext(
  baseLogger: Logger,
  token: string,
): Promise<Context> {
  const requestCache = new RequestCache();
  const httpClient = createHttpClient(token);

  return {
    dataSources: {
      usersAPI: new UsersAPI(httpClient, requestCache),
      organizationsAPI: new OrganizationsAPI(httpClient, requestCache),
      workspacesAPI: new WorkspacesAPI(httpClient, requestCache),
      runsAPI: new RunsAPI(httpClient, requestCache),
      teamsAPI: new TeamsAPI(httpClient),
      configurationVersionsAPI: new ConfigurationVersionsAPI(
        httpClient,
        requestCache,
      ),
      variableSetsAPI: new VariableSetsAPI(httpClient, requestCache),
      projectsAPI: new ProjectsAPI(httpClient, requestCache),
      variablesAPI: new VariablesAPI(httpClient),
      workspaceResourcesAPI: new WorkspaceResourcesAPI(httpClient),
      agentPoolsAPI: new AgentPoolsAPI(httpClient),
      agentTokensAPI: new AgentTokensAPI(httpClient),
      agentsAPI: new AgentsAPI(httpClient),
      appliesAPI: new AppliesAPI(httpClient),
      assessmentResultsAPI: new AssessmentResultsAPI(httpClient),
      commentsAPI: new CommentsAPI(httpClient),
      organizationMembershipsAPI: new OrganizationMembershipsAPI(httpClient),
      organizationTagsAPI: new OrganizationTagsAPI(httpClient),
      plansAPI: new PlansAPI(httpClient, requestCache),
      policiesAPI: new PoliciesAPI(httpClient),
      policySetsAPI: new PolicySetsAPI(httpClient),
      policyEvaluationsAPI: new PolicyEvaluationsAPI(httpClient),
      policySetParametersAPI: new PolicySetParametersAPI(httpClient),
      projectTeamAccessAPI: new ProjectTeamAccessAPI(httpClient),
      stateVersionOutputsAPI: new StateVersionOutputsAPI(httpClient),
      stateVersionsAPI: new StateVersionsAPI(httpClient, requestCache),
      teamTokensAPI: new TeamTokensAPI(httpClient),
      teamAccessAPI: new TeamAccessAPI(httpClient),
      runTriggersAPI: new RunTriggersAPI(httpClient),
      explorerAPI: new ExplorerAPI(httpClient),
      adminAPI: new AdminAPI(httpClient),
    },
    requestCache,
    logger: baseLogger,
    httpClient,
    deploymentTarget: applicationConfiguration.deploymentTarget,
  };
}
