import { createSlice } from '@reduxjs/toolkit';
import { loginUser, signupUser } from './authThunk';

const initialState = {
  token: localStorage.getItem('token'),
  user: JSON.parse(localStorage.getItem('user')),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  expiresAt: null,
  error: null
};


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutUser(state) {
      state.token = null;
      state.user = null;
      state.expiresAt = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('expiresAt');
      localStorage.removeItem('user');
      localStorage.removeItem('authority');
      localStorage.removeItem('rzp_checkout_anon_id');
      localStorage.removeItem('rzp_device_id');
    },
    clearAuthMessages(state) {
      state.error = null;
      state.signupMessage = null;
    },
    setUser(state, action) {
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Signup
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.signupMessage = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.signupMessage = action.payload.message;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { logoutUser, clearAuthMessages, setUser } = authSlice.actions;
export default authSlice.reducer;
