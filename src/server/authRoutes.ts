import type { FastifyInstance } from "fastify";
import fastifyRateLimit from "@fastify/rate-limit";
import { isAxiosError } from "axios";
import { logger } from "../common/logger";
import { applicationConfiguration } from "../common/conf";
import {
  mintJwt,
  validateTfcToken,
  TokenValidationError,
} from "../common/auth/tokenService";

export async function registerAuthRoutes(
  fastify: FastifyInstance<any, any, any, any, any>,
): Promise<void> {
  await fastify.register(fastifyRateLimit, {
    max: applicationConfiguration.authRateLimitMax,
    timeWindow: applicationConfiguration.authRateLimitWindowMs,
    keyGenerator: (request) => request.ip,
  });

  type AuthTokenRequest = {
    tfcToken?: string;
    infinite?: boolean;
  };

  fastify.post<{ Body: AuthTokenRequest }>(
    "/auth/token",
    async (request, reply) => {
      const { tfcToken: rawTfcToken, infinite } = request.body;
      const tfcToken = rawTfcToken?.trim();
      if (!tfcToken) {
        reply.code(400);
        return { error: "tfcToken is required" };
      }

      try {
        await validateTfcToken(tfcToken);
        const minted = await mintJwt(tfcToken, {
          infinite: infinite === true,
        });
        reply.code(200);
        return {
          token: minted.token,
          expiresAt: minted.expiresAt?.toISOString() ?? null,
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
