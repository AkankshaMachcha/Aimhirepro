import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllResumeSummaries } from '../../services/resumeService';

export const loadResumeSummaries = createAsyncThunk(
  'resumeList/loadResumeSummaries',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllResumeSummaries();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to load resumes");
    }
  }
);

const resumeListSlice = createSlice({
  name: 'resumeList',
  initialState: {
    summaries: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadResumeSummaries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadResumeSummaries.fulfilled, (state, action) => {
        state.loading = false;
        state.summaries = action.payload;
      })
      .addCase(loadResumeSummaries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default resumeListSlice.reducer;
