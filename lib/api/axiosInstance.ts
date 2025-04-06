// import axios from "axios";

// // General API instance
// export const apiInstance  = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_PLS,
//   headers: { "Content-Type": "application/json" },
// });

// // Contact Us API instance
// export const contactUsInstance  = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_PLS_CONTACT_US,
//   headers: { "Content-Type": "application/json" },
// });

// // Authentication API instance
// export const authInstance  = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_PLS_AUTH,
//   headers: { "Content-Type": "application/json" },
// });

// // Authentication API instance
// export const trashInstance  = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_PLS_TRASH,
//   headers: { "Content-Type": "application/json" },
// });
import axios from "axios";
import { getUserDetails, setUserDetails, removeUserDetails } from "./storage";

// Track refresh status to prevent multiple calls
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Decode JWT Token Function
const decodeToken = (token: string) => {
    try {
        return JSON.parse(atob(token.split(".")[1]));
    } catch (error) {
        console.error("Invalid token format:", error);
        return null;
    }
};
// Check if Token is Expired
const isTokenExpired = (token: string): boolean => {
    const decodedToken = decodeToken(token);
    if (!decodedToken?.exp) return true;
    return decodedToken.exp * 1000 < Date.now();
};

// 🔥 Refresh Access Token and Store in Cookie
export const refreshAccessToken = async (): Promise<string | null> => {
    if (isRefreshing) {
        return new Promise((resolve) => {
            refreshSubscribers.push(resolve);
        });
    }

    isRefreshing = true;

    try {
        const userDetails = getUserDetails();
        if (!userDetails?.refreshToken) throw new Error("No refresh token found");

        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_PLS_AUTH}/refreshAcessToken`, 
            {}, 
            { headers: { Authorization: `Bearer ${userDetails.refreshToken}` } }
        );

        if (response.data?.data?.accessToken) {
            const newAccessToken = response.data.data.accessToken;
            const decodedToken = decodeToken(newAccessToken); // Decode new token

            userDetails.accessToken = newAccessToken;
            userDetails.tokenData = decodedToken; // Store decoded token info
            setUserDetails(userDetails); // Store in cookie

            console.log("✅ Access token refreshed and stored in cookie");

            refreshSubscribers.forEach((callback) => callback(newAccessToken));
            refreshSubscribers = [];

            return newAccessToken;
        } else {
            throw new Error("Failed to refresh token");
        }
    } catch (error) {
        console.error("❌ Token refresh failed:", error);
        removeUserDetails(); // Logout user if refresh fails
        return null;
    } finally {
        isRefreshing = false;
    }
};
// Function to Create Axios Instances with Interceptors
const createAxiosInstance = (baseURL: string) => {
    const instance = axios.create({
        baseURL,
        headers: { "Content-Type": "application/json" },
    });

    instance.interceptors.request.use(
        async (config) => {
            const userDetails = getUserDetails();
            if (userDetails?.accessToken) {
                if (isTokenExpired(userDetails.accessToken)) {
                    console.warn("⚠️ Token expired, refreshing...");
                    const newAccessToken = await refreshAccessToken();
                    if (newAccessToken) {
                        config.headers.Authorization = `Bearer ${newAccessToken}`;
                    }
                } else {
                    config.headers.Authorization = `Bearer ${userDetails.accessToken}`;
                }
            }
            return config;
        },
        (error) => Promise.reject(error)
    );


    // Response Interceptor - Handle Expired Token & Retry
    instance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            // Handle Unauthorized (401) - Token Expired
            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                try {
                    const newAccessToken = await refreshAccessToken();
                    if (newAccessToken) {
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                        return axios(originalRequest); // Retry request
                    }
                } catch (refreshError) {
                    console.error("Retrying request failed:", refreshError);
                }
            }

            return Promise.reject(error);
        }
    );

    return instance;
};

// Create Instances with Token Handling
export const apiInstance = createAxiosInstance(process.env.NEXT_PUBLIC_PLS!);
export const contactUsInstance = createAxiosInstance(process.env.NEXT_PUBLIC_PLS_CONTACT_US!);
export const authInstance = createAxiosInstance(process.env.NEXT_PUBLIC_PLS_AUTH!);
export const trashInstance = createAxiosInstance(process.env.NEXT_PUBLIC_PLS_TRASH!);
