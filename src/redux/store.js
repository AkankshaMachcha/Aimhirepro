import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import profileReducer from './slices/profileSlice';
import resumeBuilderReducer from './slices/resumeBuilderSlice';
import resumeListReducer from './slices/resumeListSlice';
import adminAnalyticsReducer from './slices/adminAnalyticsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    resumeBuilder: resumeBuilderReducer,
    resumeList: resumeListReducer,
    adminAnalytics: adminAnalyticsReducer,
  }
});

export default store;
