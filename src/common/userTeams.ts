import { Context } from "../server/context";
import { gatherAsyncGeneratorPromises } from "./streamPages";
import { fetchResources } from "./fetchResources";
import type { Team, TeamFilter } from "../teams/types";
import type { OrganizationMembership } from "../organizationMemberships/types";
import type { OrganizationMembershipFilter } from "../organizationMemberships/types";
import type { WhereClause } from "./filtering/types";

function buildUserFilter(userId: string): OrganizationMembershipFilter {
  return {
    userId: {
      _eq: userId,
    },
  } as OrganizationMembershipFilter;
}

export async function loadTeamsForUser(
  ctx: Context,
  userId: string,
  filter?: TeamFilter,
  organizationIds?: string[],
): Promise<Team[]> {
  const memberships: OrganizationMembership[] = [];

  if (organizationIds && organizationIds.length > 0) {
    const userFilter = buildUserFilter(userId);
    await Promise.all(
      organizationIds.map(async (orgId) => {
        const orgMemberships = await gatherAsyncGeneratorPromises(
          ctx.dataSources.organizationMembershipsAPI.listOrganizationMemberships(
            orgId,
            userFilter,
          ),
        );
        memberships.push(...orgMemberships);
      }),
    );
  } else {
    const allMemberships = await gatherAsyncGeneratorPromises(
      ctx.dataSources.organizationMembershipsAPI.listOrganizationMembershipsForUser(
        userId,
      ),
    );
    memberships.push(...allMemberships);
  }

  if (memberships.length === 0) {
    return [];
  }

  const uniqueTeamIds = new Set<string>();
  for (const membership of memberships) {
    for (const teamId of membership.teamIds) {
      uniqueTeamIds.add(teamId);
    }
  }

  if (uniqueTeamIds.size === 0) {
    return [];
  }

  const whereFilter = filter as unknown as
    | WhereClause<Team, TeamFilter>
    | undefined;

  return fetchResources<string, Team, TeamFilter>(
    uniqueTeamIds,
    (teamId) => ctx.dataSources.teamsAPI.getTeam(teamId),
    whereFilter,
  );
}
