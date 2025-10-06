import { Context } from "../server/context";
import { isNotFound } from "./http";

export async function coalesceOrgs(ctx: Context, includeOrgs: string[] | undefined, excludeOrgs: string[] | undefined): Promise<string[]> {
    return ctx.dataSources.organizationMembershipsAPI.myOrganizationMemberships()
        .catch(err => {
            if (isNotFound(err)) {
                return [];
            }
            throw err;
        })
        .then(memberships => {
            return memberships.map(m => m.organizationId)
                .filter(orgId => includeOrgs ? includeOrgs.includes(orgId) : true)
                .filter(orgId => excludeOrgs ? !excludeOrgs.includes(orgId) : true
        )
        });
}