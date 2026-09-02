
import axios from "axios";
const baseURL = `${import.meta.env.VITE_API_BASE_URL}/${import.meta.env.VITE_API_VERSION}`;

// ==========================================
// Main API
// ==========================================
const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ==========================================
// Refresh API
// No interceptor here
// ==========================================
const refreshClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ==========================================
// Attach Access Token
// ==========================================
api.interceptors.request.use(
  (config) => {
    const accessToken = sessionStorage.getItem("accessToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ==========================================
// Refresh Access Token
// ==========================================
let isRefreshing = false;
let refreshPromise = null;

const refreshAccessToken = async () => {
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post("/auth/refresh")
      .then((response) => {
        const newAccessToken =
          response.data?.data?.accessToken;

        if (!newAccessToken) {
          throw new Error("No access token returned");
        }

        sessionStorage.setItem(
          "accessToken",
          newAccessToken
        );

        return newAccessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

// ==========================================
// Response Interceptor
// ==========================================
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Not 401
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Prevent infinite retry
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const newAccessToken =
        await refreshAccessToken();

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return api(originalRequest);

    } catch (refreshError) {
      // Refresh token expired/invalid
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("user");

      window.location.href = "/auth/login";

      return Promise.reject(refreshError);
    }
  }
);

export default api;

