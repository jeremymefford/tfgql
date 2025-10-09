import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
} from "axios";
import { applicationConfiguration } from "./conf";
import { logger, logContext } from "./logger";

export function createHttpClient(tfcToken: string): AxiosInstance {
  const client = axios.create({
    baseURL: applicationConfiguration.tfeBaseUrl,
    headers: {
      "Content-Type": "application/vnd.api+json",
      Authorization: `Bearer ${tfcToken}`,
    },
  });

  client.interceptors.request.use((config) => {
    config.headers = config.headers ?? {};

    const ctx = logContext.getStore();
    if (ctx?.traceparent) {
      config.headers["traceparent"] = ctx.traceparent;
      config.headers["x-request-id"] = ctx.traceparent;
    }
    return config;
  });

  client.interceptors.response.use(undefined, async (error: AxiosError) => {
    if (
      !error.response ||
      error.response.status < 500 ||
      error.response.status >= 600
    ) {
      return Promise.reject(error);
    }

    const config = error.config as AxiosRequestConfig & {
      _retryCount?: number;
    };

    const method = config.method?.toUpperCase();
    const queryStr =
      typeof config.data === "object" && typeof config.data?.query === "string"
        ? config.data.query
        : "";
    const isMutation = /\bmutation\b\s+(\w+)?\s*(\([^)]*\))?\s*\{/i.test(
      queryStr,
    );

    const isRetryableMethod =
      method === "GET" || (method === "POST" && !isMutation);

    if (!isRetryableMethod) {
      return Promise.reject(error);
    }

    config._retryCount = (config._retryCount || 0) + 1;
    if (config._retryCount <= applicationConfiguration.serverErrorMaxRetries) {
      const retryDelay = applicationConfiguration.serverErrorRetryDelay;
      logger.debug(
        { attempt: config._retryCount, retryDelay },
        "Server error occurred, retrying",
      );
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(client(config));
        }, retryDelay);
      });
    }
    if (error.response) {
      logger.error(
        {
          attempts: config._retryCount,
          status: error.response.status,
          statusText: error.response.statusText,
        },
        "Server error after retries",
      );
    }

    return Promise.reject(error);
  });

  client.interceptors.response.use(undefined, async (error: AxiosError) => {
    if (error.response?.status !== 429) {
      return Promise.reject(error);
    }

    const config = error.config as AxiosRequestConfig & {
      _retryCount?: number;
    };

    const headers = error.response?.headers;
    const retryAfter = parseFloat(headers?.["retry-after"]);
    const xReset = parseFloat(headers?.["x-ratelimit-reset"]);
    const reset = !isNaN(retryAfter)
      ? retryAfter
      : !isNaN(xReset)
        ? xReset
        : 30;

    config._retryCount = (config._retryCount || 0) + 1;

    if (config._retryCount <= applicationConfiguration.rateLimitMaxRetries) {
      const backoff = Math.min(reset * 1000, 60000);

      logger.debug(
        { attempt: config._retryCount, backoff: Math.round(backoff) },
        "Rate limited, retrying",
      );

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(client(config));
        }, backoff);
      });
    }

    return Promise.reject(error);
  });

  return client;
}
