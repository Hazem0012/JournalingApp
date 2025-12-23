// api.ts
import axios from "axios";
import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";



const api: AxiosInstance = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

const refreshClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
});


const publicPaths=['/', '/login', '/signup']
const isPublic = publicPaths.includes(window.location.pathname);

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // No Authorization header needed; HttpOnly cookies are sent automatically
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const original = error.config as InternalAxiosRequestConfig | undefined;
    if (!original) return Promise.reject(error);

    if (original.skipAuth) {
      return Promise.reject(error);
    }

    const url = original.url || "";
    const isAuthEndpoint = url.includes("/auth/token") || url.includes("/auth/refresh") || url.includes("/auth/logout");
    const isExpired = status === 401 || status === 403;
    if (!isExpired || isAuthEndpoint) {
      return Promise.reject(error);
    }

    if (original._retry) {
      if (!isPublic){
        window.location.href = "/";
      }
      return Promise.reject(error);
    }

    original._retry = true;

    try {
      await refreshClient.post("/auth/refresh");
      // Cookies now contain a fresh access token; retry the original request
      return api.request(original);
    } catch (refreshErr) {
      if (!isPublic){
        window.location.href = "/";
      }
      return Promise.reject(refreshErr);
    }
  }
);

export default api;

// Auth helpers
export async function login(username: string, password: string) {
  const body = new URLSearchParams();
  body.append("username", username);
  body.append("password", password);
  const resp = await api.post("/auth/token", body, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    skipAuth: true,
  });
  // Tokens are set as HttpOnly cookies by the server; nothing to store client-side
  return resp.data;
}

export async function logout() {
  try {
    await api.post("/auth/logout", null, { skipAuth: true });
  } finally {
    // Nothing to clear client-side; cookies are HttpOnly and cleared by the server
  }
}
