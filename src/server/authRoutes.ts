import type { FastifyInstance } from "fastify";
import { isAxiosError } from "axios";
import { logger } from "../common/logger";
import {
  mintJwt,
  validateTfcToken,
  TokenValidationError,
} from "../common/auth/tokenService";

export function registerAuthRoutes(
  fastify: FastifyInstance<any, any, any, any, any>,
): void {
  fastify.post<{ Body: { tfcToken?: string } }>(
    "/auth/token",
    async (request, reply) => {
      const tfcToken = request.body?.tfcToken?.trim();
      if (!tfcToken) {
        reply.code(400);
        return { error: "tfcToken is required" };
      }

      try {
        await validateTfcToken(tfcToken);
        const minted = await mintJwt(tfcToken);
        reply.code(200);
        return {
          token: minted.token,
          expiresAt: minted.expiresAt.toISOString(),
        };
      } catch (error) {
        if (error instanceof TokenValidationError) {
          logger.warn(
            {
              statusCode: error.statusCode,
              tfcError: error.payload,
            },
            "Terraform token validation failed",
          );
          reply.code(error.statusCode);
          if (error.payload && typeof error.payload === "object") {
            return error.payload;
          }
          return { error: error.message };
        }
        if (isAxiosError(error)) {
          logger.error(
            { err: error },
            "Terraform API unavailable during token validation",
          );
          reply.code(502);
          return { error: "Terraform API is unavailable" };
        }
        logger.error({ err: error }, "Failed to mint JWT");
        reply.code(500);
        return { error: "Failed to mint token" };
      }
    },
  );
}
