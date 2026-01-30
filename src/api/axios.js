// import axios from "axios";

// const api = axios.create({
//   baseURL: "/api",
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// api.interceptors.response.use(
//   res => res,
//   err => {
//     if (err.response?.status === 401) {
//       window.forceLogout?.();
//     }
//     return Promise.reject(err);
//   }
// );

// export default api;
import axios from "axios";
import { API_BASE_URL, REFRESH_ENDPOINT } from "./api";

const api = axios.create({
  baseURL: API_BASE_URL
});

// ================= REQUEST =================
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ================= RESPONSE =================
api.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        window.forceLogout?.();
        return Promise.reject(err);
      }

      try {
        const refreshRes = await axios.post(
          `${API_BASE_URL}${REFRESH_ENDPOINT}`,
          { refreshToken }
        );

        const newToken = refreshRes.data.accessToken;
        localStorage.setItem("token", newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest); // 🔁 retry original request
      } catch (e) {
        window.forceLogout?.();
        return Promise.reject(e);
      }
    }

    return Promise.reject(err);
  }
);

export default api;
