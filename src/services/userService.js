// src/services/userService.js
import api from "./api";

const handleError = (error) => {
  if (!error.response) return "Network error. Please try again.";

  const status = error.response.status;

  switch (status) {
    case 400:
      return error.response.data?.error || "Invalid input. Please try again.";
    case 401:
      return "Unauthorized. Please login again.";
    case 404:
      return "Profile not found.";
    case 413:
      return "File too large. Max 2MB allowed.";
    default:
      return "An unexpected error occurred.";
  }
};


export const getUserProfile = async () => {
  try {
    const response = await api.get("/user/profile/view"); 
    return { data: response.data };

  } catch (error) {
    ;

    if (!error.response) {
      return { error: "Network error or CORS issue" };
    }
    return {
      error:
        error.response?.data?.error ||
        `Something went wrong (status ${error.response.status})`,
    };
  }
};

export const uploadProfileImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const response = await api.post("/user/profile/profile-photo-update", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return { data: response.data };
  } catch (error) {
    return { error: handleError(error) };
  }
};

export const updateUserProfile = async (updatedData) => {
  try {
    const response = await api.put('/user/profile/update', updatedData);
    return { data: response.data };
  } catch (error) {
    console.error("Update profile failed:", error);
    return {
      error:
        error.response?.data?.message ||
        "Failed to update profile. Please try again.",
    };
  }
};
export const deleteUserAccount = async () => {
  try {
    const response = await api.delete("/user/profile/delete");
    return { data: response.data };
  } catch (error) {
    return {
      error:
        error.response?.data?.message || "Failed to delete account. Please try again.",
    };
  }
};
export const changeUserPassword = async (payload) => {
  try {
    const response = await api.put("/user/profile/change-password", payload);
    return { data: response.data };
  } catch (error) {
    if (!error.response) {
      return { error: "Network error or server unreachable" };
    }

    return {
      error: error.response.data?.error || "Password change failed",
    };
  }
};