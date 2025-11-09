import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  timeout: 10000,
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem("user");
    if (user) {
      const token = JSON.parse(user).accessToken;
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const response = await instance.post("/auth/refresh-token");
        const newToken = response.data.accessToken;
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        user.accessToken = newToken;
        localStorage.setItem("user", JSON.stringify(user));
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return instance(originalRequest);
      } catch (error) {
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(error);
      }
      // For now, we just reject the promise
    }
    return Promise.reject(error);
  }
);
export default instance;
