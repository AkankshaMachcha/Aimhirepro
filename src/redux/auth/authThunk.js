import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;



export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, thunkAPI) => {
    try {
      const res = await axios.post(`${BASE_URL}/auth/login`, { email, password });

      const {
        token,
        email: userEmail,
        firstName,
        lastName,
        profileImage,
        authority,
        tokenType,
        expiresAt
      } = res.data;

      const user = {
        email: userEmail,
        firstName,
        lastName,
        profileImage,
        authority
      };

      localStorage.setItem('token', token);
      localStorage.setItem('expiresAt', expiresAt);
      localStorage.setItem('user', JSON.stringify(user));

      return { token, user, tokenType, expiresAt };
    } catch (err) {
      const backendMessage =
        typeof err?.response?.data === 'string'
          ? err.response.data
          : err?.response?.data?.message || 'Login failed';

      return thunkAPI.rejectWithValue(backendMessage);
    }
  }
);


export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async ({ firstName, middleName, lastName, phoneNumber, email, password }, thunkAPI) => {
    try {
      const res = await axios.post(`${BASE_URL}/auth/signup`, {
        firstName,
        middleName,
        lastName,
        phoneNumber,
        email,
        password
      });

      return res.data; // returns SignupResponse
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.response?.data?.message || 'Signup failed');
    }
  }
);



export const premiumUserSignup = createAsyncThunk(
  'auth/premium-signup',
  async ({ firstName, middleName, lastName, phoneNumber, email, password }, thunkAPI) => {
    try {
      const res = await axios.post(`${BASE_URL}/auth/premium-signup`, {
        firstName,
        middleName,
        lastName,
        phoneNumber,
        email,
        password
      });

      return res.data; 
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.response?.data?.message || 'Signup failed');
    }
  }
);
