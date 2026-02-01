import axios from "axios";
import {
  API_BASE_URL,
  REFRESH_ENDPOINT
} from "./api";

const api = axios.create({
  baseURL: API_BASE_URL
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// api.interceptors.response.use(
//   res => res,
//   async err => {
//     const originalRequest = err.config;

//     if (!originalRequest) {
//       return Promise.reject(err);
//     }

//     if (
//       err.response?.status === 401 &&
//       !originalRequest._retry &&
//       !originalRequest.url.includes(REFRESH_ENDPOINT)
//     ) {
//       originalRequest._retry = true;

//       const refreshToken = localStorage.getItem("refreshToken");

//       // Skip refresh if not available
//       if (!refreshToken) {
//         console.warn("No refresh token available");
//         return Promise.reject(err);
//       }

//       try {
//         const res = await axios.post(
//           `${API_BASE_URL}${REFRESH_ENDPOINT}`,
//           { refreshToken }
//         );

//         const newToken =
//           res.data.accessToken ||
//           res.data.token ||
//           res.data.jwt;

//         localStorage.setItem("token", newToken);

//         originalRequest.headers.Authorization =
//           `Bearer ${newToken}`;

//         return api(originalRequest);
//       } catch (e) {
//         console.error("Refresh failed:", e);
//         return Promise.reject(e);
//       }
//     }

//     return Promise.reject(err);
//   }
// );
api.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config;

    if (!originalRequest) {
      return Promise.reject(err);
    }

    if (
      err.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes(REFRESH_ENDPOINT)
    ) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        console.warn("No refresh token available");
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
        console.error("Refresh failed:", e);

        // ❗ Stop retrying, just fail
        return Promise.reject(e);
      }
    }

    return Promise.reject(err);
  }
);

export default api;
