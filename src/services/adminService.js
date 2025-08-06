import api from './api';

export const getPlatformAnalytics = async () => {
  try {
    const response = await api.get('/admin/analytics/platform');
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const getAdminUsers = async (filters) => {
  try {
    const params = {};

    for (const key in filters) {
      const val = filters[key];
      if (val !== '' && val !== null && val !== undefined) {
        if ((key === 'createdBefore' || key === 'createdAfter') && val instanceof Date && !isNaN(val)) {
          params[key] = val.toISOString();
        } else {
          params[key] = val;
        }
      }
    }

    const response = await api.get('/admin/users', { params }); 
    return response.data;
  } catch (error) {
    console.error('Failed to fetch admin users:', error.response?.data || error.message);
    throw error;
  }
};



export const getUserByEmail = async (email) => {
  const res = await api.get(`/admin/user/email/${encodeURIComponent(email)}`);
  return res.data;
};



export const deleteUserByEmail = async (email) => {
  return await api.delete(`/admin/users/email/${encodeURIComponent(email)}/delete`);
};

export const toggleUserEnabled = async (email, enabled) => {
  return await api.patch(`/admin/email/${encodeURIComponent(email)}/ban`, null, {
    params: { enabled },
  });
};

export const updateUserRole = async (email, authority) => {
  return await api.patch(`/admin/email/${encodeURIComponent(email)}/role`, null, {
    params: { authority },
  });
};