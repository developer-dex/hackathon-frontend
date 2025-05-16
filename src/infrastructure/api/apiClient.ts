/**
 * API client configuration goes here.
 *
 * Example API client:
 *
 * import axios from 'axios';
 *
 * const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com';
 *
 * export const apiClient = axios.create({
 *   baseURL: API_BASE_URL,
 *   headers: {
 *     'Content-Type': 'application/json',
 *   },
 * });
 *
 * // Add request interceptor
 * apiClient.interceptors.request.use(
 *   (config) => {
 *     // You can add auth tokens here
 *     const token = localStorage.getItem('token');
 *     if (token) {
 *       config.headers.Authorization = `Bearer ${token}`;
 *     }
 *     return config;
 *   },
 *   (error) => {
 *     return Promise.reject(error);
 *   }
 * );
 *
 * // Add response interceptor
 * apiClient.interceptors.response.use(
 *   (response) => {
 *     return response;
 *   },
 *   (error) => {
 *     // Handle common errors
 *     if (error.response?.status === 401) {
 *       // Handle unauthorized errors
 *     }
 *     return Promise.reject(error);
 *   }
 * );
 */
