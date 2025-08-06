// src/services/resumeService.js
import api from "./api";

// Helper: Normalize descriptions to always be arrays
const formatDescriptionList = (list) =>
  list?.map((item) => ({
    ...item,
    description: Array.isArray(item.description)
      ? item.description
      : [item.description],
  })) || [];


export const createResume = async (resumeData) => {
  try {
    const payload = {
      title: resumeData.title,
      summary: resumeData.summary,
      visibility: resumeData.visibility,
      templateName: resumeData.templateName,
      themeColor: resumeData.themeColor,
      contactInfo: resumeData.contactInfo,
      experienceList: formatDescriptionList(resumeData.experienceList),
      educationList: resumeData.educationList,
      skillList: resumeData.skillList,
      achievementList: formatDescriptionList(resumeData.achievementList),
      certificationList: formatDescriptionList(resumeData.certificationList),
      languageList: resumeData.languageList,
      projectList: formatDescriptionList(resumeData.projectList),
      personalLinkList: resumeData.personalLinkList,
    };

    const response = await api.post("/user/resume/create", payload);
    return { data: response.data };
  } catch (error) {
    if (!error.response) {
      return { error: "Network error or CORS issue. Please check your connection." };
    }

    const status = error.response.status;
    const serverMessage = error.response.data;

    // Friendly message mapping
    let friendlyMessage = "Something went wrong. Please try again.";

    if (status === 400) {
      if (typeof serverMessage === "string" && serverMessage.toLowerCase().includes("limit")) {
        friendlyMessage = "You’ve reached the limit for creating resumes. Consider upgrading to Premium to create more.";
      } else {
        friendlyMessage = "Some of the fields seem invalid. Please review your resume and try again.";
      }
    } else if (status === 401) {
      friendlyMessage = "You must be logged in to create a resume.";
    } else if (status === 403) {
      friendlyMessage = "You’re not authorized to perform this action.";
    } else if (status === 404) {
      friendlyMessage = "We couldn’t find your user account. Please log in again.";
    } else if (status === 500) {
      friendlyMessage = "Something went wrong on our end. Please try again later.";
    }

    return { error: friendlyMessage };
  }
};

export const downloadResume = async (versionLabel) => {
  if (!versionLabel) {
    return { error: "Version label not found for this resume." };
  }

  try {
    const response = await api.get(`/user/resume/${versionLabel}/download`, {
      responseType: "text",
    });

    return { data: response.data };
  } catch (error) {
    if (!error.response) {
      return { error: "Network error or CORS issue." };
    }

    const status = error.response.status;
    let errorMessage;

    switch (status) {
      case 403:
        errorMessage =
          "Free users can only download up to 5 resumes. Please upgrade to Premium.";
        break;
      case 401:
        errorMessage = "Unauthorized. Please login again.";
        break;
      case 404:
        errorMessage = "Resume not found or versionLabel is invalid.";
        break;
      default:
        errorMessage = "Unexpected error during resume download.";
    }

    return { error: errorMessage };
  }
};


export const getLatestResume = async () => {
  try {
    const response = await api.get("/user/resume/get");
    return response.data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          throw new Error(data || "Download limit exceeded.");
        case 401:
          throw new Error("Unauthorized. Please log in again.");
        case 403:
          throw new Error("Access denied. You don’t have permission.");
        case 404:
          throw new Error("No resume found for your account.");
        case 500:
          throw new Error("Server error. Please try again later.");
        default:
          throw new Error(data || "An unexpected error occurred.");
      }
    } else {
      throw new Error("Network error. Please check your connection.");
    }
  }
};


export const updateResume = async (versionLabel, resumeData) => {
  try {
    const payload = {
      title: resumeData.title,
      summary: resumeData.summary,
      visibility: resumeData.visibility,
      templateName: resumeData.templateName,
      themeColor: resumeData.themeColor,
      contactInfo: resumeData.contactInfo,
      experienceList: formatDescriptionList(resumeData.experienceList),
      educationList: resumeData.educationList,
      skillList: resumeData.skillList,
      achievementList: formatDescriptionList(resumeData.achievementList),
      certificationList: formatDescriptionList(resumeData.certificationList),
      languageList: resumeData.languageList,
      projectList: formatDescriptionList(resumeData.projectList),
      personalLinkList: resumeData.personalLinkList,
    };
    const response = await api.put(`/user/resume/update/${versionLabel}`, payload);
    return { data: response.data };
  } catch (error) {
    return {
      error:
        error.response?.data ||
        `Update failed (status ${error.response?.status || '??'})`,
    };
  }
};


// export const getAllResumeSummaries = async () => {
//   try {
//     const response = await api.get("/user/resume/get-all");
//     return response.data;
//   } catch (error) {
//     throw new Error(
//       error?.response?.data || "Unable to fetch resume summaries"
//     );
//   }
// };


export const getAllResumeSummaries = async () => {
  try {
    const response = await api.get("/user/resume/get-all");
    return response.data; // This should include { status, count, data }
  } catch (error) {
    const status = error?.response?.status;
    const data = error?.response?.data;

    let message;

    if (status === 401) {
      message = "Unauthorized. Please log in again.";
    } else if (status === 404) {
      message = typeof data === "string" ? data : "No resumes found for this user.";
    } else if (status === 500) {
      message = "Server error occurred. Please try again later.";
    } else {
      message = typeof data === "string" ? data : "Unable to fetch resume summaries.";
    }

    // Return structured error instead of throwing generic error
    return {
      status: "error",
      message,
      code: status,
    };
  }
};


export const getResumeByVersion = async (versionLabel) => {
  try {
    const response = await api.get(`/user/resume/${versionLabel}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch full resume");
  }
};


export const deleteResumeByVersion = async (versionLabel) => {
  try {
    const response = await api.delete(`/user/resume/version-label/${versionLabel}/delete`);
    return { data: response.data }; // "Resume deleted successfully."
  } catch (error) {
    // Map backend messages into user-friendly errors
    const resMsg = error?.response?.data;
    const status = error?.response?.status;

    if (status === 400) {
      return { error: resMsg || 'Invalid request to delete resume.' };
    } else if (status === 401) {
      return { error: 'You must be logged in to delete a resume.' };
    } else if (status === 403) {
      return { error: 'You do not have permission to delete this resume.' };
    } else if (status === 404) {
      return { error: resMsg || 'Resume not found.' };
    } else {
      return { error: 'Something went wrong while deleting the resume.' };
    }
  }
};


// export const matchResumeWithJD = async (versionLabel, jobDescription) => {
//   const res = await api.post("/user/resume/match-jd", {
//     versionLabel,
//     jobDescription,
//   });
//   return res.data;
// };


export const matchResumeWithJD = async (versionLabel, jobDescription) => {
  try {
    const res = await api.post("/user/resume/match-jd", {
      versionLabel,
      jobDescription,
    });

    return {
      status: "success",
      data: res.data,
    };
  } catch (error) {
    const status = error?.response?.status;
    const message = error?.response?.data;

    let friendlyMessage;

    if (status === 403) {
      friendlyMessage = "Access denied. JD matching is available for premium users only.";
    } else if (status === 404) {
      friendlyMessage = typeof message === "string" ? message : "Resume not found.";
    } else if (status === 500) {
      friendlyMessage = "Internal server error. Please try again later.";
    } else {
      friendlyMessage = "Something went wrong. Please try again.";
    }

    return {
      status: "error",
      message: friendlyMessage,
      code: status,
    };
  }
};
