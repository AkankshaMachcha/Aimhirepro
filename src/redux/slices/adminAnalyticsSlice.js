// src/redux/slices/adminAnalyticsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getPlatformAnalytics } from '../../services/adminService';

export const fetchPlatformAnalytics = createAsyncThunk(
  'adminAnalytics/fetch',
  async (_, thunkAPI) => {
    try {
      return await getPlatformAnalytics();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || 'Error fetching analytics');
    }
  }
);

const adminAnalyticsSlice = createSlice({
  name: 'adminAnalytics',
  initialState: {
    loading: false,
    data: null,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlatformAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlatformAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchPlatformAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminAnalyticsSlice.reducer;
