import axios from "axios";
import { getUserDetails, setUserDetails, removeUserDetails } from "./storage";
import { authInstance } from "./axiosInstance";

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
    refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
    refreshSubscribers.forEach((cb) => cb(token));
    refreshSubscribers = [];
};

authInstance.interceptors.request.use((config) => {
    const userDetails = getUserDetails();
    if (userDetails && userDetails.accessToken) {
        config.headers.Authorization = `Bearer ${userDetails.accessToken}`;
    }
    return config;
});

authInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const userDetails = getUserDetails();

        // Check if token is expired (401) and we have a refresh token
        if (error.response?.status === 401 && userDetails?.refreshToken && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve) => {
                    subscribeTokenRefresh((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(authInstance(originalRequest));
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Use the correct refresh URL from the environment
                const refreshResponse = await authInstance.post(`${process.env.NEXT_PUBLIC_PLS_AUTH}/refresh`, {
                    refreshToken: userDetails.refreshToken,
                });

                if (refreshResponse.data.success) {
                    // Update the userDetails with new accessToken
                    userDetails.accessToken = refreshResponse.data.accessToken;
                    setUserDetails(userDetails); // 🔐 Encrypt & Store the updated userDetails

                    // Set the Authorization header with new access token
                    authInstance.defaults.headers.common.Authorization = `Bearer ${refreshResponse.data.accessToken}`;
                    onRefreshed(refreshResponse.data.accessToken);

                    return authInstance(originalRequest); // Retry the original request
                }
            } catch (refreshError) {
                console.error("Refresh token failed, logging out user:", refreshError);
                removeUserDetails(); // Clear storage and log out user
                window.location.href = "/login"; // Redirect to login page
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);
