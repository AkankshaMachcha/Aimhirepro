// src/redux/slices/profileSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUserProfile } from '../../services/userService';

export const fetchUserProfile = createAsyncThunk(
  'profile/fetch',
  async (_, { rejectWithValue }) => {
    const { data, error } = await getUserProfile();
    if (data) {
      const localUser = JSON.parse(localStorage.getItem("user") || "{}");
      const authority = localUser.authority || "";
      return { ...data, authority }; // ✅ inject authority into profile
    }
    return rejectWithValue(error);
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearProfile(state) {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
