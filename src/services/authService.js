import api from './api';
import axios from 'axios';
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const forgotPassword = async (email) => {
  return api.post(`${BASE_URL}/auth/forgot-password`, null, {
    params: { email },
  });
};

export const resetPassword = async ({ token, newPassword, confirmPassword }) => {
  return api.post(`${BASE_URL}/auth/reset-password`, null, {
    params: { token, newPassword, confirmPassword },
  });
};


export const sendOtp = async (email) => {
  return axios.post(`${BASE_URL}/auth/send-otp`, null, {
    params: { email },
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const verifyOtp = async (email, otp) => {
  return axios.post(`${BASE_URL}/auth/verify-otp`, null, {
    params: { email, otp },
    headers: {
      'Content-Type': 'application/json',
    },
  });
};