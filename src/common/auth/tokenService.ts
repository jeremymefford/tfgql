import { randomBytes, createHash, createSecretKey } from "node:crypto";
import { EncryptJWT, jwtDecrypt, type JWTPayload } from "jose";
import { isAxiosError } from "axios";
import { applicationConfiguration } from "../conf";
import { logger } from "../logger";
import { createHttpClient } from "../httpClient";

const AES_KEY_LENGTH = 32;

const encryptionKey = initializeEncryptionKey(
  applicationConfiguration.jwtEncryptionKeyMaterial,
);

function initializeEncryptionKey(keyMaterial?: string) {
  if (!keyMaterial || keyMaterial.trim().length === 0) {
    logger.warn(
      "TFGQL_JWT_ENCRYPTION_KEY not provided; generating ephemeral in-memory key. JWTs will be invalid after process restart.",
    );
    return createSecretKey(randomBytes(AES_KEY_LENGTH));
  }

  const normalized = keyMaterial.trim();

  // Attempt base64url/base64 decode
  const base64Key = (() => {
    try {
      const padded = padBase64(
        normalized.replace(/-/g, "+").replace(/_/g, "/"),
      );
      return Buffer.from(padded, "base64");
    } catch {
      return null;
    }
  })();

  if (base64Key?.length === AES_KEY_LENGTH) {
    return createSecretKey(base64Key);
  }

  // Attempt hex decode
  if (
    /^[0-9a-fA-F]+$/.test(normalized) &&
    normalized.length === AES_KEY_LENGTH * 2
  ) {
    return createSecretKey(Buffer.from(normalized, "hex"));
  }

  // Fall back to SHA-256 hash of provided material
  logger.warn(
    "TFGQL_JWT_ENCRYPTION_KEY provided but not 32 bytes; deriving AES key via SHA-256 hash.",
  );
  return createSecretKey(createHash("sha256").update(normalized).digest());
}

function padBase64(value: string): string {
  const remainder = value.length % 4;
  if (remainder === 0) return value;
  return value + "=".repeat(4 - remainder);
}

export interface MintedToken {
  token: string;
  expiresAt: Date;
}

export interface VerifiedTokenClaims {
  tfcToken: string;
  exp: number;
  iat: number;
  tokenHash: string;
}

export class TokenValidationError extends Error {
  constructor(
    readonly statusCode: number,
    readonly payload?: unknown,
    message = "Terraform token validation failed",
  ) {
    super(message);
    this.name = "TokenValidationError";
  }
}

export async function validateTfcToken(tfcToken: string): Promise<void> {
  const client = createHttpClient(tfcToken);

  try {
    await client.get("/account/details");
  } catch (error: unknown) {
    if (isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      if (status >= 400 && status < 500) {
        const message =
          status === 401
            ? "Terraform token was rejected"
            : "Terraform token validation failed";
        throw new TokenValidationError(status, data, message);
      }
    }

    logger.error({ err: error }, "Terraform API error during token validation");
    throw error;
  }
}

export async function mintJwt(tfcToken: string): Promise<MintedToken> {
  if (!tfcToken || typeof tfcToken !== "string") {
    throw new Error("Cannot mint JWT without TFC token");
  }

  const ttlSeconds = Math.max(1, applicationConfiguration.authTokenTtlSeconds);
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000);

  const token = await new EncryptJWT({ tfcToken })
    .setProtectedHeader({ alg: "dir", enc: "A256GCM", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime(`+${ttlSeconds}s`)
    .encrypt(encryptionKey);

  return {
    token,
    expiresAt,
  };
}

export async function verifyJwt(token: string): Promise<VerifiedTokenClaims> {
  if (!token) {
    throw new Error("Missing JWT");
  }

  const { payload } = await jwtDecrypt(token, encryptionKey, {
    clockTolerance: "0s",
  });

  const typedPayload = payload as JWTPayload & { tfcToken?: unknown };

  if (
    typeof typedPayload.tfcToken !== "string" ||
    typedPayload.tfcToken.length === 0
  ) {
    throw new Error("Token missing TFC token claim");
  }

  if (typeof typedPayload.iat !== "number") {
    throw new Error("Token missing issued-at claim");
  }

  if (typeof typedPayload.exp !== "number") {
    throw new Error("Token missing expiration claim");
  }

  const tfcToken = typedPayload.tfcToken;
  const tokenHash = createHash("sha256")
    .update(tfcToken, "utf8")
    .digest("base64url");

  return {
    tfcToken: typedPayload.tfcToken,
    exp: typedPayload.exp,
    iat: typedPayload.iat,
    tokenHash,
  };
}
