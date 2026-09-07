
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

        console.log("Access token refreshed");

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

    // Do not intercept if no response or not 401
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Do not attempt refresh on auth endpoints (e.g. login, 2fa, refresh)
    // to allow LoginView to properly display credential validation errors
    const isAuthEndpoint = originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/2fa") ||
      originalRequest.url?.includes("/auth/refresh");

    if (isAuthEndpoint) {
      return Promise.reject(error);
    }

    // Prevent infinite retry loop
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const newAccessToken = await refreshAccessToken();

      // Safely assign new access token to headers
      if (originalRequest.headers?.set) {
        originalRequest.headers.set("Authorization", `Bearer ${newAccessToken}`);
      } else if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      } else {
        originalRequest.headers = { Authorization: `Bearer ${newAccessToken}` };
      }

      return api(originalRequest);

    } catch (refreshError) {
      // Refresh token is expired or invalid
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("user");

      window.location.href = "/auth/login";
      console.log("Refresh token expired/invalid");

      return Promise.reject(refreshError);
    }
  }
);

export default api;

