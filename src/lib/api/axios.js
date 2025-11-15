import axios from "axios";

// Base URL for the API
const BASE_URL = "https://resolvecars.softvencefsd.xyz/api/v1";

// Create axios instance for public endpoints (no auth token required)
export const axiosPublic = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Create axios instance for private endpoints (with auth token)
export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor for private axios instance to add auth token
axiosPrivate.interceptors.request.use(
  (config) => {
    // Get token from localStorage or wherever you store it
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
axiosPrivate.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        window.location.href = "/auth/signin";
      }
    }
    return Promise.reject(error);
  }
);

axiosPublic.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle public API errors if needed
    return Promise.reject(error);
  }
);

export default axiosPublic;


