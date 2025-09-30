export class Config {
    readonly tfcToken: string;
    readonly tfeBaseUrl: string;
    readonly graphqlBatchSize: number;
    readonly tfcPageSize: number;
    readonly rateLimitMaxRetries: number = 20;
    readonly requestCacheMaxSize: number;
    readonly serverErrorMaxRetries: number = 20;
    readonly serverErrorRetryDelay: number = 60000; 

    constructor(env = process.env) {
        const token = env.TFC_TOKEN;
        if (!token) {
            throw new Error("TFC_TOKEN is required");
        }

        this.tfcToken = token;
        let baseUrl = env.TFE_BASE_URL || 'https://app.terraform.io/api/v2';
        baseUrl = baseUrl.toLowerCase();
        if (!baseUrl.endsWith('/api/v2')) {
            baseUrl = baseUrl + '/api/v2';
        }
        this.tfeBaseUrl = baseUrl;
        this.graphqlBatchSize = this.parsePositiveNumber(env.TFCE_GRAPHQL_BATCH_SIZE, 10);
        const userGivenPageSize = this.parsePositiveNumber(env.TFCE_GRAPHQL_PAGE_SIZE, 100);
        this.tfcPageSize = userGivenPageSize > 100 || userGivenPageSize == 0 ? 100 : userGivenPageSize;
        this.rateLimitMaxRetries = this.parsePositiveNumber(env.TFCE_GRAPHQL_RATE_LIMIT_MAX_RETRIES, 50);
        this.serverErrorMaxRetries = this.parsePositiveNumber(env.TFCE_GRAPHQL_SERVER_ERROR_MAX_RETRIES, 20);
        this.serverErrorRetryDelay = this.parsePositiveNumber(env.TFCE_GRAPHQL_SERVER_ERROR_RETRY_DELAY, 60000);
        this.requestCacheMaxSize = this.parsePositiveNumber(env.TFCE_GRAPHQL_REQUEST_CACHE_MAX_SIZE, 5000);
    }

    private parsePositiveNumber(value: string | undefined, defaultValue: number): number {
        const num = Number(value);
        return isNaN(num) || num < 0 ? defaultValue : num;
    }
}

export const applicationConfiguration = new Config();