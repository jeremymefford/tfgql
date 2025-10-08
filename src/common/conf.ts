import { readFileSync } from 'fs';

export interface ServerTlsConfig {
    cert: string;
    key: string;
    ca?: string;
    passphrase?: string;
}

export class Config {
    readonly tfeBaseUrl: string;
    readonly graphqlBatchSize: number;
    readonly tfcPageSize: number;
    readonly rateLimitMaxRetries: number = 20;
    readonly requestCacheMaxSize: number;
    readonly serverErrorMaxRetries: number = 20;
    readonly serverErrorRetryDelay: number = 60000;
    readonly serverTlsConfig?: ServerTlsConfig;
    readonly authTokenTtlSeconds: number;
    readonly jwtEncryptionKeyMaterial?: string;

    constructor(env = process.env) {
        let baseUrl = env.TFE_BASE_URL || 'https://app.terraform.io/api/v2';
        baseUrl = baseUrl.toLowerCase();
        if (!baseUrl.endsWith('/api/v2')) {
            baseUrl = `${baseUrl.replace(/\/?$/, '')}/api/v2`;
        }
        this.tfeBaseUrl = baseUrl;

        this.graphqlBatchSize = this.parsePositiveNumber(env.TFCE_GRAPHQL_BATCH_SIZE, 10);
        const userGivenPageSize = this.parsePositiveNumber(env.TFCE_GRAPHQL_PAGE_SIZE, 100);
        this.tfcPageSize = userGivenPageSize > 100 || userGivenPageSize === 0 ? 100 : userGivenPageSize;
        this.rateLimitMaxRetries = this.parsePositiveNumber(env.TFCE_GRAPHQL_RATE_LIMIT_MAX_RETRIES, 50);
        this.serverErrorMaxRetries = this.parsePositiveNumber(env.TFCE_GRAPHQL_SERVER_ERROR_MAX_RETRIES, 20);
        this.serverErrorRetryDelay = this.parsePositiveNumber(env.TFCE_GRAPHQL_SERVER_ERROR_RETRY_DELAY, 60000);
        this.requestCacheMaxSize = this.parsePositiveNumber(env.TFCE_GRAPHQL_REQUEST_CACHE_MAX_SIZE, 5000);
        this.authTokenTtlSeconds = this.parsePositiveNumber(env.TFCE_AUTH_TOKEN_TTL, 2600000); // default 30 days
        this.jwtEncryptionKeyMaterial = env.TFCE_JWT_ENCRYPTION_KEY;

        const tlsCertPath = this.normalizePath(env.TFCE_SERVER_TLS_CERT_FILE);
        const tlsKeyPath = this.normalizePath(env.TFCE_SERVER_TLS_KEY_FILE);

        if ((tlsCertPath && !tlsKeyPath) || (!tlsCertPath && tlsKeyPath)) {
            throw new Error('Both TFCE_SERVER_TLS_CERT_FILE and TFCE_SERVER_TLS_KEY_FILE must be set to enable HTTPS');
        }

        if (tlsCertPath && tlsKeyPath) {
            const tlsConfig: ServerTlsConfig = {
                cert: this.readFileOrThrow(tlsCertPath, 'TFCE_SERVER_TLS_CERT_FILE'),
                key: this.readFileOrThrow(tlsKeyPath, 'TFCE_SERVER_TLS_KEY_FILE'),
            };

            const tlsCaPath = this.normalizePath(env.TFCE_SERVER_TLS_CA_FILE);
            if (tlsCaPath) {
                tlsConfig.ca = this.readFileOrThrow(tlsCaPath, 'TFCE_SERVER_TLS_CA_FILE');
            }

            if (env.TFCE_SERVER_TLS_KEY_PASSPHRASE) {
                tlsConfig.passphrase = env.TFCE_SERVER_TLS_KEY_PASSPHRASE;
            }

            this.serverTlsConfig = tlsConfig;
        }
    }

    private parsePositiveNumber(value: string | undefined, defaultValue: number): number {
        const num = Number(value);
        return Number.isFinite(num) && num >= 0 ? num : defaultValue;
    }

    private normalizePath(pathValue: string | undefined): string | undefined {
        const trimmed = pathValue?.trim();
        return trimmed ? trimmed : undefined;
    }

    private readFileOrThrow(path: string, envVar: string): string {
        try {
            return readFileSync(path, 'utf-8');
        } catch (error) {
            throw new Error(`Failed to read file for ${envVar} at path ${path}: ${(error as Error).message}`);
        }
    }
}

export const applicationConfiguration = new Config();
