import axios from "axios";
import { useAuth } from "../contexts/authcontext";

// Create axios instance
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  timeout: 10000,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("authToken");
      delete apiClient.defaults.headers.common["Authorization"];
      // Call login function from authContext
      const { login } = useAuth();
      login();
    }
    return Promise.reject(error);
  }
);

// API functions
export const dashboardAPI = {
  getDashboardData: () =>
    apiClient.get(
      "/services/data/v64.0/actions/custom/flow/Ticker_Generate_UI_Values"
    ),
};
