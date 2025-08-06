import api from './api';


export const deleteResume = async (email, versionLabel) => {
  return await api.delete(`/admin/resumes/${encodeURIComponent(email)}/${versionLabel}/delete`);
};

export const getResumeByVersionLabel = async (email,versionLabel) => {
  const res = await api.get(`/admin/resumes/${encodeURIComponent(email)}/${versionLabel}`);
  return res.data;
};
