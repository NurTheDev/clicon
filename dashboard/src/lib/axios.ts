import axios from "axios";

const instance = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}${
    import.meta.env.VITE_API_VERSION
  }`,
  // timeout: 90000,
  withCredentials: true,
});

let isRefreshing = false;
const failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue.length = 0;
};

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
    //Don't retry if it's the refresh token endpoint
    if (error.config.url.includes("/auth/refresh-token")) {
      console.log("❌ Refresh token failed, logging out");
      localStorage.removeItem("user");
      window.location.href = "/login";
      isRefreshing = false;
      return Promise.reject(error);
    }
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return instance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }
      originalRequest._retry = true;
      isRefreshing = true;
      console.log("🔄 Token expired, attempting refresh...");
      try {
        await instance.post(
          "/auth/refresh-token",
          {},
          {
            withCredentials: true,
          }
        );
        isRefreshing = false;
        processQueue(null, "success");
        return instance(originalRequest);
      } catch (error) {
        console.error("❌ Refresh token failed:", error);
        isRefreshing = false;
        processQueue(error, null);
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
