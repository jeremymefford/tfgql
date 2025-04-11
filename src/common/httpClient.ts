import axios, { AxiosInstance } from 'axios';
import type { AxiosError, AxiosRequestConfig } from 'axios';
import { applicationConfiguration } from './conf';

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const axiosClient: AxiosInstance = axios.create({
  baseURL: applicationConfiguration.tfeBaseUrl,
  headers: {
    'Content-Type': 'application/vnd.api+json',
    'Authorization': `Bearer ${applicationConfiguration.tfcToken}`,
  }
});

axiosClient.interceptors.response.use(undefined, async (error: AxiosError) => {
  const config = error.config as AxiosRequestConfig & { _retryCount?: number };

  if (error.response?.status === 429) {
    config._retryCount = (config._retryCount || 0) + 1;

    if (config._retryCount <= applicationConfiguration.rateLimitMaxRetries) {
      const baseDelay = 1000; 
      const maxDelay = 60000; 
      const backoff = Math.min(Math.pow(2, config._retryCount) * baseDelay + Math.random() * 1000, maxDelay);

      // console.debug(`Rate limited (429). Retry attempt #${config._retryCount} in ${Math.round(backoff)}ms`);

      await sleep(backoff);
      return axiosClient(config);
    }
  }

  return Promise.reject(error);
});