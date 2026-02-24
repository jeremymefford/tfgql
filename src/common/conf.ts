import { readFileSync } from "fs";

const MIN_METRICS_CACHE_TTL_SECONDS_TFC = 600;
const MIN_METRICS_CACHE_TTL_SECONDS_TFE = 120;

export interface ServerTlsConfig {
  cert: string;
  key: string;
  ca?: string;
  passphrase?: string;
}

export class Config {
  readonly tfeBaseUrl: string;
  readonly deploymentTarget: "tfc" | "tfe";
  readonly graphqlBatchSize: number;
  readonly tfcPageSize: number;
  readonly rateLimitMaxRetries: number = 20;
  readonly requestCacheMaxSize: number;
  readonly serverErrorMaxRetries: number = 20;
  readonly serverErrorRetryDelay: number = 60000;
  readonly serverTlsConfig?: ServerTlsConfig;
  readonly authTokenTtlSeconds: number;
  readonly jwtEncryptionKeyMaterial?: string;
  readonly corsOrigin: string | (string | RegExp)[] | boolean;
  readonly authRateLimitMax: number;
  readonly authRateLimitWindowMs: number;
  readonly metricsEnabled: boolean;
  readonly metricsConfigPath?: string;
  readonly metricsCacheTtlSeconds: number;

  constructor(env = process.env) {
    let baseUrl = env.TFE_BASE_URL || "https://app.terraform.io/api/v2";
    baseUrl = baseUrl.toLowerCase();
    if (!baseUrl.endsWith("/api/v2")) {
      baseUrl = `${baseUrl.replace(/\/?$/, "")}/api/v2`;
    }
    this.tfeBaseUrl = baseUrl;
    this.deploymentTarget = this.determineDeploymentTarget(this.tfeBaseUrl);

    this.graphqlBatchSize = this.parsePositiveNumber(env.TFGQL_BATCH_SIZE, 10);
    const userGivenPageSize = this.parsePositiveNumber(
      env.TFGQL_PAGE_SIZE,
      100,
    );
    this.tfcPageSize =
      userGivenPageSize > 100 || userGivenPageSize === 0
        ? 100
        : userGivenPageSize;
    this.rateLimitMaxRetries = this.parsePositiveNumber(
      env.TFGQL_RATE_LIMIT_MAX_RETRIES,
      50,
    );
    this.serverErrorMaxRetries = this.parsePositiveNumber(
      env.TFGQL_SERVER_ERROR_MAX_RETRIES,
      20,
    );
    this.serverErrorRetryDelay = this.parsePositiveNumber(
      env.TFGQL_SERVER_ERROR_RETRY_DELAY,
      60000,
    );
    this.requestCacheMaxSize = this.parsePositiveNumber(
      env.TFGQL_REQUEST_CACHE_MAX_SIZE,
      5000,
    );
    this.authTokenTtlSeconds = this.parsePositiveNumber(
      env.TFGQL_AUTH_TOKEN_TTL,
      2600000,
    ); // default 30 days
    this.jwtEncryptionKeyMaterial = env.TFGQL_JWT_ENCRYPTION_KEY;

    this.authRateLimitMax = this.parsePositiveNumber(
      env.TFGQL_AUTH_RATE_LIMIT_MAX,
      10,
    );
    this.authRateLimitWindowMs = this.parsePositiveNumber(
      env.TFGQL_AUTH_RATE_LIMIT_WINDOW,
      60000,
    );

    const localhostOrigins: RegExp[] = [
      /^http?:\/\/localhost(:\d+)?$/,
      /^http?:\/\/127\.0\.0\.1(:\d+)?$/,
    ];
    const domainEnv = env.TFGQL_DOMAIN?.trim();
    if (!domainEnv) {
      this.corsOrigin = localhostOrigins;
    } else if (domainEnv === "*") {
      this.corsOrigin = "*";
    } else {
      const extra: (string | RegExp)[] = domainEnv
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => {
          if (s.startsWith("http://") || s.startsWith("https://")) {
            return s;
          }
          const escaped = s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          return new RegExp(`^https?:\\/\\/${escaped}(:\\d+)?$`);
        });
      this.corsOrigin = [...localhostOrigins, ...extra];
    }

    this.metricsEnabled =
      (env.TFGQL_METRICS_ENABLED ?? "true").toLowerCase() !== "false";
    const metricsPath = env.TFGQL_METRICS_CONFIG?.trim();
    this.metricsConfigPath = metricsPath || undefined;
    const rawMetricsCacheTtlSeconds = env.TFGQL_METRICS_CACHE_TTL;
    const configuredMetricsCacheTtlSeconds = this.parsePositiveNumber(
      rawMetricsCacheTtlSeconds,
      60,
    );
    const minimumMetricsCacheTtlSeconds =
      this.deploymentTarget === "tfc"
        ? MIN_METRICS_CACHE_TTL_SECONDS_TFC
        : MIN_METRICS_CACHE_TTL_SECONDS_TFE;
    this.metricsCacheTtlSeconds = Math.max(
      configuredMetricsCacheTtlSeconds,
      minimumMetricsCacheTtlSeconds,
    );
    this.warnIfMetricsCacheTtlBelowMinimum(
      rawMetricsCacheTtlSeconds,
      minimumMetricsCacheTtlSeconds,
      this.metricsCacheTtlSeconds,
    );

    const tlsCertPath = this.normalizePath(env.TFGQL_SERVER_TLS_CERT_FILE);
    const tlsKeyPath = this.normalizePath(env.TFGQL_SERVER_TLS_KEY_FILE);

    if ((tlsCertPath && !tlsKeyPath) || (!tlsCertPath && tlsKeyPath)) {
      throw new Error(
        "Both TFGQL_SERVER_TLS_CERT_FILE and TFGQL_SERVER_TLS_KEY_FILE must be set to enable HTTPS",
      );
    }

    if (tlsCertPath && tlsKeyPath) {
      const tlsConfig: ServerTlsConfig = {
        cert: this.readFileOrThrow(tlsCertPath, "TFGQL_SERVER_TLS_CERT_FILE"),
        key: this.readFileOrThrow(tlsKeyPath, "TFGQL_SERVER_TLS_KEY_FILE"),
      };

      const tlsCaPath = this.normalizePath(env.TFGQL_SERVER_TLS_CA_FILE);
      if (tlsCaPath) {
        tlsConfig.ca = this.readFileOrThrow(
          tlsCaPath,
          "TFGQL_SERVER_TLS_CA_FILE",
        );
      }

      const tlsKeyPassphrase = env.TFGQL_SERVER_TLS_KEY_PASSPHRASE;
      if (tlsKeyPassphrase) {
        tlsConfig.passphrase = tlsKeyPassphrase;
      }

      this.serverTlsConfig = tlsConfig;
    }
  }

  private parsePositiveNumber(
    value: string | undefined,
    defaultValue: number,
  ): number {
    const num = Number(value);
    return Number.isFinite(num) && num >= 0 ? num : defaultValue;
  }

  private normalizePath(pathValue: string | undefined): string | undefined {
    const trimmed = pathValue?.trim();
    return trimmed ? trimmed : undefined;
  }

  private warnIfMetricsCacheTtlBelowMinimum(
    rawValue: string | undefined,
    minimumValue: number,
    effectiveValue: number,
  ): void {
    if (rawValue === undefined) return;
    const configured = Number(rawValue);
    if (!Number.isFinite(configured) || configured < 0) return;
    if (configured >= minimumValue) return;

    console.warn(
      `TFGQL_METRICS_CACHE_TTL is set to ${configured}s, below the enforced minimum of ${minimumValue}s for ${this.deploymentTarget.toUpperCase()}. Using ${effectiveValue}s.`,
    );
  }

  private readFileOrThrow(path: string, envVar: string): string {
    try {
      return readFileSync(path, "utf-8");
    } catch (error) {
      throw new Error(
        `Failed to read file for ${envVar} at path ${path}: ${(error as Error).message}`,
      );
    }
  }

  private determineDeploymentTarget(baseUrl: string): "tfc" | "tfe" {
    try {
      const hostname = new URL(baseUrl).hostname;
      return hostname.endsWith("terraform.io") ? "tfc" : "tfe";
    } catch {
      return "tfe";
    }
  }
}

export const applicationConfiguration = new Config();
