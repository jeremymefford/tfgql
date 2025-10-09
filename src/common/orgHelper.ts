import { Context } from "../server/context";
import { isNotFound } from "./http";

export async function coalesceOrgs(ctx: Context, includeOrgs: string[] | undefined | null, excludeOrgs: string[] | undefined | null): Promise<string[]> {
    const includeSet = includeOrgs ? new Set(includeOrgs) : new Set<string>();
    const excludeSet = excludeOrgs ? new Set(excludeOrgs) : new Set<string>();
    return ctx.dataSources.organizationMembershipsAPI.myOrganizationMemberships()
        .catch(err => {
            if (isNotFound(err)) {
                return [];
            }
            throw err;
        })
        .then(memberships =>
            memberships.map(m => m.organizationId)
                .filter(orgId => includeSet.size === 0 || includeSet.has(orgId))
                .filter(orgId => !excludeSet.has(orgId)));
}
