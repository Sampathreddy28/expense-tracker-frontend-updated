import axios from "axios";
import {
  API_BASE_URL,
  REFRESH_ENDPOINT,
  forceLogout
} from "./api";

const api = axios.create({
  baseURL: API_BASE_URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken =
        localStorage.getItem("refreshToken");

      if (!refreshToken) {
        forceLogout();
        return Promise.reject(err);
      }

      try {
        const res = await axios.post(
          `${API_BASE_URL}${REFRESH_ENDPOINT}`,
          { refreshToken }
        );

        const newToken =
          res.data.accessToken ||
          res.data.token ||
          res.data.jwt;

        localStorage.setItem("token", newToken);

        originalRequest.headers.Authorization =
          `Bearer ${newToken}`;

        return api(originalRequest);
      } catch (e) {
        forceLogout();
        return Promise.reject(e);
      }
    }

    return Promise.reject(err);
  }
);

export default api;
