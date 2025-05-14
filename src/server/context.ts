import { OrganizationsAPI } from '../organizations/dataSource';
import { WorkspacesAPI } from '../workspaces/dataSource';
import { UsersAPI } from '../users/dataSource';
import { RunsAPI } from '../runs/dataSource';
import { TeamsAPI } from '../teams/dataSource';
import { ConfigurationVersionsAPI } from '../configuration-versions/dataSource';
import { VariableSetsAPI } from '../variable-sets/dataSource';
import { ProjectsAPI } from '../projects/dataSource';
import { VariablesAPI } from '../variables/dataSource';
import { RequestCache } from '../common/requestCache';
import { WorkspaceResourcesAPI } from '../workspace-resources/dataSource';

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
      configurationVersionsAPI: new ConfigurationVersionsAPI(),
      variableSetsAPI: new VariableSetsAPI(),
      projectsAPI: new ProjectsAPI(),
      variablesAPI: new VariablesAPI(),
      workspaceResourcesAPI: new WorkspaceResourcesAPI()
    },
    requestCache
  };
}