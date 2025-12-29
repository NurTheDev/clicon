import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const instance = axios.create({
    baseURL: `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_API_VERSION}`,
    withCredentials: true,
})

let isRefreshing = false

interface Queue {
    resolve: (value?: string | null) => void
    reject: (error: AxiosError) => void
}

const failedQueue: Array<Queue> = []

const processQueue = (error: AxiosError | null, token: string | null = null) => {
    failedQueue.forEach((item) => {
        if (error) {
            item.reject(error)
        } else {
            item.resolve(token)
        }
    });
    failedQueue.length = 0
}

instance.interceptors.request.use(
    (config) => {
        console.log("Request config:", config)
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean
}

instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as CustomAxiosRequestConfig

        if (originalRequest?.url?.includes("/auth/refresh-token")) {
            console.log("❌ Refresh token failed, logging out")
            localStorage.removeItem("user")
            window.location.href = "/login"
            isRefreshing = false
            return Promise.reject(error)
        }
        // Fixed typo: error.resonse -> error.response
        if (error.response && error.response.status === 401 && !originalRequest?._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject })
                }).then((token) => {
                    if (originalRequest.headers) {
                        originalRequest.headers['Authorization'] = 'Bearer ' + token
                    }
                    return instance(originalRequest)
                }).catch(err => Promise.reject(err))
            }

            originalRequest._retry = true
            isRefreshing = true
            console.log("🔄 Attempting to refresh token...")

            try {
                await instance.post("/auth/refresh-token", {}, { withCredentials: true })
                console.log("✅ Token refreshed successfully")
                isRefreshing = false
                processQueue(null, "newAccessToken")
                return instance(originalRequest)
            } catch (refreshError) {
                console.error("❌ Token refresh failed, logging out")
                isRefreshing = false
                processQueue(refreshError as AxiosError, null)
                localStorage.removeItem("user")
                window.location.href = "/login"
                return Promise.reject(refreshError)
            }
        }
        return Promise.reject(error)
    }
)

export default instance
