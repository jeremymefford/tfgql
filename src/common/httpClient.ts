import axios, { AxiosInstance } from 'axios';
import type { AxiosError, AxiosRequestConfig } from 'axios';

const MAX_RETRIES = 3;

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Base URL for Terraform Enterprise (or Terraform Cloud) API
const TFE_BASE_URL = process.env.TFE_BASE_URL || 'https://app.terraform.io/api/v2';
const TFC_TOKEN = process.env.TFC_TOKEN;

if (!TFC_TOKEN) {
  throw new Error('TFC_TOKEN environment variable is required for API calls.');
}

/** Pre-configured Axios HTTP client for Terraform Enterprise API requests */
axios.interceptors.response.use(undefined, async (error: AxiosError) => {
  const config = error.config as AxiosRequestConfig & { _retryCount?: number };

  if (error.response?.status === 429 && config && config._retryCount !== undefined) {
    config._retryCount = (config._retryCount || 0) + 1;

    if (config._retryCount <= MAX_RETRIES) {
      const retryAfter = parseInt(error.response.headers['retry-after'] || '1', 10) * 1000;
      const backoff = retryAfter || Math.pow(2, config._retryCount) * 100 + Math.random() * 100;

      console.warn(
        `Rate limited (429). Retry attempt #${config._retryCount} in ${Math.round(backoff)}ms`
      );

      await sleep(backoff);
      return axios(config);
    }
  }

  return Promise.reject(error);
});

export const axiosClient: AxiosInstance = axios.create({
  baseURL: TFE_BASE_URL,
  headers: {
    'Content-Type': 'application/vnd.api+json',
    'Authorization': `Bearer ${TFC_TOKEN}`
  }
});