import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import taskFilterReducer from './slices/taskFilterSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    taskFilter: taskFilterReducer,
  },
});
