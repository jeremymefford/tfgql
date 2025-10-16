import { fetchArchivistJsonLines } from "../common/http";
import { Context } from "../server/context";
import { Plan } from "./types";

export const resolvers = {
  Query: {
    plan: async (
      _: unknown,
      { id }: { id: string },
      { dataSources }: Context,
    ): Promise<Plan | null> => dataSources.plansAPI.getPlan(id),
  },
  Plan: {
    async planExportDownloadUrl(
      plan: Plan,
      _: unknown,
      { dataSources }: Context,
    ): Promise<string | null> {
      return dataSources.plansAPI.getPlanExportDownloadUrl(plan.id);
    },
    planLog: async (
      plan: Plan,
      _: unknown,
      ctx: Context,
    ): Promise<Record<string, unknown>[] | null> => {
      const logReadUrl = plan.logReadUrl;
      if (!logReadUrl) {
        return null;
      }
      return fetchArchivistJsonLines(ctx.httpClient, logReadUrl);
    },
  },
};
