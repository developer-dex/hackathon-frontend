/**
 * API client for making HTTP requests to backend services
 * Currently configured as a placeholder for future implementation
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

/**
 * Configuration options for the API client
 */
export interface ApiClientConfig {
  baseURL: string;
  headers?: Record<string, string>;
  timeout?: number;
}

/**
 * Default configuration for the API client
 */
const DEFAULT_CONFIG: ApiClientConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
};

/**
 * API client for handling HTTP requests
 */
export class ApiClient {
  private client: AxiosInstance;

  constructor(config: Partial<ApiClientConfig> = {}) {
    const finalConfig = { ...DEFAULT_CONFIG, ...config };
    this.client = axios.create(finalConfig);

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error("API Error:", error.response.data);
          return Promise.reject(error.response.data);
        } else if (error.request) {
          // The request was made but no response was received
          console.error("API Request Error:", error.request);
          return Promise.reject(new Error("No response received from server"));
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("API Setup Error:", error.message);
          return Promise.reject(error);
        }
      }
    );
  }

  /**
   * Performs a GET request to the specified endpoint
   * @param url - The endpoint URL
   * @param config - Optional axios request configuration
   * @returns Promise with the response data
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, config);
    return response.data;
  }

  /**
   * Performs a POST request to the specified endpoint
   * @param url - The endpoint URL
   * @param data - The data to send in the request body
   * @param config - Optional axios request configuration
   * @returns Promise with the response data
   */
  async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(
      url,
      data,
      config
    );
    return response.data;
  }

  /**
   * Performs a PUT request to the specified endpoint
   * @param url - The endpoint URL
   * @param data - The data to send in the request body
   * @param config - Optional axios request configuration
   * @returns Promise with the response data
   */
  async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data, config);
    return response.data;
  }

  /**
   * Performs a DELETE request to the specified endpoint
   * @param url - The endpoint URL
   * @param config - Optional axios request configuration
   * @returns Promise with the response data
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url, config);
    return response.data;
  }
}
