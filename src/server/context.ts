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
import { PolicyChecksAPI } from "../policyChecks/dataSource";
import { PolicySetParametersAPI } from "../policySetParameters/dataSource";
import { ProjectTeamAccessAPI } from "../projectTeamAccess/dataSource";
import { StateVersionOutputsAPI } from "../stateVersionOutputs/dataSource";
import { StateVersionsAPI } from "../stateVersions/dataSource";
import { TeamTokensAPI } from "../teamTokens/dataSource";
import { WorkspaceTeamAccessAPI } from "../workspaceTeamAccess/dataSource";
import { RunTriggersAPI } from "../runTriggers/dataSource";
import { ExplorerAPI } from "../explorer/dataSource";
import { createHttpClient } from "../common/httpClient";
import { applicationConfiguration } from "../common/conf";
import { AdminAPI } from "../admin/dataSource";
import { TaskStagesAPI } from "../taskStages/dataSource";
import { PolicySetOutcomesAPI } from "../policySetOutcomes/dataSource";
import { LogsAPI } from "../logs/dataSource";
import { RegistryModulesAPI } from "../registryModules/dataSource";
import { RegistryProvidersAPI } from "../registryProviders/dataSource";
import { RegistryProviderVersionsAPI } from "../registryProviderVersions/dataSource";
import { RegistryProviderPlatformsAPI } from "../registryProviderPlatforms/dataSource";
import { RegistryGpgKeysAPI } from "../registryGpgKeys/dataSource";
import { RegistryTestsAPI } from "../registryTests/dataSource";

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
    workspaceTeamAccessAPI: WorkspaceTeamAccessAPI;
    runTriggersAPI: RunTriggersAPI;
    explorerAPI: ExplorerAPI;
    adminAPI: AdminAPI;
    taskStagesAPI: TaskStagesAPI;
    policySetOutcomesAPI: PolicySetOutcomesAPI;
    policyChecksAPI: PolicyChecksAPI;
    logsAPI: LogsAPI;
    registryModulesAPI: RegistryModulesAPI;
    registryProvidersAPI: RegistryProvidersAPI;
    registryProviderVersionsAPI: RegistryProviderVersionsAPI;
    registryProviderPlatformsAPI: RegistryProviderPlatformsAPI;
    registryGpgKeysAPI: RegistryGpgKeysAPI;
    registryTestsAPI: RegistryTestsAPI;
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
      teamsAPI: new TeamsAPI(httpClient, requestCache),
      configurationVersionsAPI: new ConfigurationVersionsAPI(
        httpClient,
        requestCache,
      ),
      variableSetsAPI: new VariableSetsAPI(httpClient, requestCache),
      projectsAPI: new ProjectsAPI(httpClient, requestCache),
      variablesAPI: new VariablesAPI(httpClient),
      workspaceResourcesAPI: new WorkspaceResourcesAPI(httpClient),
      agentPoolsAPI: new AgentPoolsAPI(httpClient, requestCache),
      agentTokensAPI: new AgentTokensAPI(httpClient, requestCache),
      agentsAPI: new AgentsAPI(httpClient, requestCache),
      appliesAPI: new AppliesAPI(httpClient, requestCache),
      assessmentResultsAPI: new AssessmentResultsAPI(httpClient, requestCache),
      commentsAPI: new CommentsAPI(httpClient, requestCache),
      organizationMembershipsAPI: new OrganizationMembershipsAPI(httpClient, requestCache),
      organizationTagsAPI: new OrganizationTagsAPI(httpClient),
      plansAPI: new PlansAPI(httpClient, requestCache),
      policiesAPI: new PoliciesAPI(httpClient, requestCache),
      policySetsAPI: new PolicySetsAPI(httpClient, requestCache),
      policyEvaluationsAPI: new PolicyEvaluationsAPI(httpClient, requestCache),
      policySetParametersAPI: new PolicySetParametersAPI(httpClient),
      projectTeamAccessAPI: new ProjectTeamAccessAPI(httpClient, requestCache),
      stateVersionOutputsAPI: new StateVersionOutputsAPI(httpClient, requestCache),
      stateVersionsAPI: new StateVersionsAPI(httpClient, requestCache),
      teamTokensAPI: new TeamTokensAPI(httpClient, requestCache),
      workspaceTeamAccessAPI: new WorkspaceTeamAccessAPI(
        httpClient,
        requestCache,
      ),
      runTriggersAPI: new RunTriggersAPI(httpClient, requestCache),
      explorerAPI: new ExplorerAPI(httpClient),
      adminAPI: new AdminAPI(httpClient),
      taskStagesAPI: new TaskStagesAPI(httpClient, requestCache),
      policySetOutcomesAPI: new PolicySetOutcomesAPI(httpClient),
      policyChecksAPI: new PolicyChecksAPI(httpClient, requestCache),
      logsAPI: new LogsAPI(httpClient, requestCache),
      registryModulesAPI: new RegistryModulesAPI(httpClient, requestCache),
      registryProvidersAPI: new RegistryProvidersAPI(httpClient, requestCache),
      registryProviderVersionsAPI: new RegistryProviderVersionsAPI(httpClient, requestCache),
      registryProviderPlatformsAPI: new RegistryProviderPlatformsAPI(httpClient, requestCache),
      registryGpgKeysAPI: new RegistryGpgKeysAPI(httpClient, requestCache),
      registryTestsAPI: new RegistryTestsAPI(httpClient, requestCache),
    },
    requestCache,
    logger: baseLogger,
    httpClient,
    deploymentTarget: applicationConfiguration.deploymentTarget,
  };
}
