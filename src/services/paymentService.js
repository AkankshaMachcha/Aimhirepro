import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const fetchRazorpayKey = async () => {
  const res = await axios.get(`${BASE_URL}/payment/key`);
  return res.data;
};

export const createRazorpayOrder = async () => {
  const res = await axios.post(`${BASE_URL}/payment/checkout`, {}, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return res.data;
};

export const verifyRazorpayPayment = async (paymentDetails) => {
  const res = await axios.post(`${BASE_URL}/payment/verify`, paymentDetails, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return res.data;
};
