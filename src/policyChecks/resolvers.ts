import { Context } from "../server/context";
import { PolicyCheck } from "./types";
import { Run } from "../runs/types";

export const resolvers = {
  PolicyCheck: {
    run: async (
      check: PolicyCheck,
      _: unknown,
      ctx: Context,
    ): Promise<Run | null> => {
      if (!check.runId) {
        return null;
      }
      return ctx.dataSources.runsAPI.getRun(check.runId);
    },
  },
};
