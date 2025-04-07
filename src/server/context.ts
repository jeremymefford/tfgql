import { OrganizationsAPI } from '../organizations/dataSource';
import { WorkspacesAPI } from '../workspaces/dataSource';
import { UsersAPI } from '../users/dataSource';
import { RunsAPI } from '../runs/dataSource';
import { TeamsAPI } from '../teams/dataSource';

/** GraphQL context type */
export interface Context {
  dataSources: {
    organizationsAPI: OrganizationsAPI;
    workspacesAPI: WorkspacesAPI;
    usersAPI: UsersAPI;
    runsAPI: RunsAPI;
    teamsAPI: TeamsAPI;
  };
}

/**
 * Build the context for each GraphQL request, including data source instances.
 */
export async function buildContext(): Promise<Context> {
  return {
    dataSources: {
      organizationsAPI: new OrganizationsAPI(),
      workspacesAPI: new WorkspacesAPI(),
      usersAPI: new UsersAPI(),
      runsAPI: new RunsAPI(),
      teamsAPI: new TeamsAPI()
    }
  };
}