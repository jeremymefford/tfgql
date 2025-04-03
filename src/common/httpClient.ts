import axios, { AxiosInstance } from 'axios';

// Base URL for Terraform Enterprise (or Terraform Cloud) API
const TFE_BASE_URL = process.env.TFE_BASE_URL || 'https://app.terraform.io/api/v2';
const TFE_TOKEN = process.env.TFE_TOKEN || 'LQhuNIwk4z3S6Q.atlasv1.Jvz38MYCp4M94mJCDZlgzfuXf4G5AxrFEJWzRd3tIpfLsqyznP5yr0An0kzkZU3igTw';

if (!TFE_TOKEN) {
  throw new Error('TFE_TOKEN environment variable is required for API calls.');
}

/** Pre-configured Axios HTTP client for Terraform Enterprise API requests */
export const axiosClient: AxiosInstance = axios.create({
  baseURL: TFE_BASE_URL,
  headers: {
    'Content-Type': 'application/vnd.api+json',
    'Authorization': `Bearer ${TFE_TOKEN}`
  }
});