import axios from "axios";
import { authInstance } from "./axiosInstance";
import { getUserDetails, removeUserDetails, setUserDetails } from "./storage";

const API_BASE = process.env.NEXT_PUBLIC_PLS_AUTH;

export const registerUser = async (userData: {
  username: string;
  fullName: string;
  email: string;
  password: string;
  country: string;
}) => {
  try {
    const response = await authInstance.post("/register", userData);

    if (response.data.success) {
      // Store the received data in localStorage
      localStorage.setItem("userData", JSON.stringify(response.data.data));
    }

    return response.data;
  } catch (error) {
    console.error("Registration failed:", error);
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    } else {
      throw { message: "Registration failed" };
    }
  }
};

export const verifyOtp = async (
  email: string,
  otp: string,
) => {
  try {
    const response = await authInstance.post("/verifyEmail", {
      email,
      OTP: otp,
    });
    return response.data;
  } catch (error) {
    console.error("OTP Verification failed:", error);
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    } else {
      throw { message: "OTP Verification failed" };
    }
  }
};

export const login = async (username: string, password: string) => {
  try {
    const response = await authInstance.post("/login", { username, password });
    console.log(response);

    if (response.data.success) {
      const accessToken = response.data.data.accessToken;

      // Decode the JWT token to get the role and other details
      const decodedToken = JSON.parse(atob(accessToken.split(".")[1]));
      
      // Log the decoded token to verify its contents
      console.log("Decoded Token:", decodedToken);

      const userData = {
        uid: response.data.data.uid,
        username: response.data.data.username,
        accessToken,
        refreshToken: response.data.data.refreshToken,
        role: decodedToken.role, // Extract the role from the decoded token
      };

      setUserDetails(userData); // 🔐 Encrypt & Store user data in localStorage
      return userData;
    }
  } catch (error) {
    console.error("Login failed:", error);
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    } else {
      throw { message: "Login failed" };
    }
  }
};

export const logout = () => {
  removeUserDetails(); 
};

export async function sendOtp(email: string) {
  try {
    const response = await authInstance.post("/forgotPasswordRequestFromUser", {
      email,
    });
    console.log(response);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function sendOtpForVerifyingUser(email: string) {
  try {
    const response = await authInstance.post("/sendOTP", {
      email,
    });
    console.log(response);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function forgotPasswordVerifyOtp(otp: string) {
  try {
    const response = await authInstance.post("/verifyForgotPasswordRequest", {
      OTP: otp,
    });
    console.log(response);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function updatePassword(newPassword: string, uid: string) {
  try {
    const response = await authInstance.patch("/updateNewPasswordRequest", {
      newPassword,
      uid, // Include UID in the request
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function updateUserInfo(
  username: string,
  fullName: string,
  address: string,
  phone: string
) {
  try {
    const userDetails = getUserDetails();
    const uid = userDetails?.uid;
    const accessToken = userDetails?.accessToken; // Fetch access token

    if (!uid || !accessToken) {
      throw new Error("User not authenticated");
    }

    const response = await authInstance.patch(
      "/updateInfo",
      { username, fullName, uid, address, phone }, // Send as request body
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Include access token
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function updateUserEmail(email: string) {
  try {
    const userDetails = getUserDetails();
    const uid = userDetails?.uid;
    const accessToken = userDetails?.accessToken; // Fetch access token

    if (!uid || !accessToken) {
      throw new Error("User not authenticated");
    }

    const response = await authInstance.patch(
      "/updateEmail",
      { email, uid }, // Send as request body
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Include access token
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getCurrentUserDetails() {
  const userDetails = getUserDetails();
  const uid = userDetails?.uid;
  const accessToken = userDetails?.accessToken; // Fetch access token

  if (!uid || !accessToken) {
    throw new Error("User not authenticated");
  }

  const response = await authInstance.get("/getCurrentUser", {
    headers: {
      Authorization: `Bearer ${accessToken}`, // Include access token
    },
    params: {
      uid: uid, // Include uid as a query parameter
    },
  });
  // Handle the response
  return response.data;
}
export async function verifyEmail(email: string, otp: string) {
  try {
    const response = await authInstance.post("/verifyEmail", {
      email,
      OTP: otp, // Ensure correct key
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "OTP verification failed");
    } else {
      throw new Error("Network error, please try again.");
    }
  }
}
