import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:6060';

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    timeout: 15_000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ── Request Interceptor ────────────────────────────────────────────────────────
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Attach auth token from storage if available
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('access_token');
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error),
);

// ── Response Interceptor ──────────────────────────────────────────────────────
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // 401 retry placeholder — will be implemented with full auth flow in Phase 2
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            // Phase 2 implementation: call refresh token endpoint, then retry
            // e.g. await refreshAccessToken();
            // return api(originalRequest);
        }

        // Normalize error response for UI consumption
        const message =
            (error.response?.data as { message?: string })?.message ??
            error.message ??
            'An unexpected error occurred';

        return Promise.reject(new Error(message));
    },
);

export default api;
