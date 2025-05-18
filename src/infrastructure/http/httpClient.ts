import axios, { AxiosInstance } from "axios";

/**
 * Creates a configured Axios instance for making API requests
 */
const createHttpClient = (): AxiosInstance => {
  const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "",
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Request interceptor to handle auth
  axiosInstance.interceptors.request.use(
    (config) => {
      // Get token from localStorage
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      // Add auth header if token exists
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      console.log("📡 HTTP Request:", {
        method: config.method?.toUpperCase(),
        url: (config.baseURL || "") + (config.url || ""),
        headers: config.headers,
        data: config.data,
      });

      return config;
    },
    (error) => {
      console.error("❌ HTTP Request Error:", error);
      return Promise.reject(error);
    }
  );

  // Response interceptor for error handling
  axiosInstance.interceptors.response.use(
    (response) => {
      console.log("📡 HTTP Response:", {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
      });
      return response;
    },
    (error) => {
      console.error("❌ HTTP Response Error:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });

      if (error.response) {
        // Handle unauthorized responses
        if (error.response.status === 401) {
          if (typeof window !== "undefined") {
            // Clear auth data and redirect to login
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
          }
        }
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

// Export the client instance
export const httpClient = createHttpClient();
