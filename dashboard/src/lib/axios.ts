import axios from "axios";

const instance = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}${
    import.meta.env.VITE_API_VERSION
  }`,
  timeout: 90000,
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    console.log("Request config:", config);
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
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        await instance.post(
          "/auth/refresh-token",
          {},
          {
            withCredentials: true,
          }
        );
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
