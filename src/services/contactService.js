import axios from 'axios';
import api from './api';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const submitContactForm = async (data) => {
    console.log(data) ;
    const res = await axios.post(`${BASE_URL}/public/contact`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return res.data;
};



// export const getAllContactMessages = () => {
//   return api.get('/admin/contact');
// };


export const getAllContactMessages = async () => {
  try {
    const response = await api.get('/admin/contact');
    return {
      status: 'success',
      data: response.data, // array of ContactMessageResponse
    };
  } catch (error) {
    const status = error?.response?.status;

    let message;
    if (status === 403) {
      message = 'Access denied. Only admins can view contact messages.';
    } else if (status === 404) {
      message = 'No messages found.';
    } else if (status === 500) {
      message = 'Server error while fetching messages.';
    } else {
      message = 'Failed to load contact messages.';
    }

    return {
      status: 'error',
      message,
      code: status,
    };
  }
};


export const markMessageAsRead = (email, createdAt) => {
  return api.put(`/admin/contact/mark-read`, null, {
    params: { email, createdAt },
  });
};