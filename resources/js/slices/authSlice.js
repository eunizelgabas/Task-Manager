import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    role: null,
  },
  reducers: {
    setAuthUser: (state, action) => {
      state.user = action.payload.user;
      state.role = action.payload.role;
    },
    clearAuth: (state) => {
      state.user = null;
      state.role = null;
    },
  },
});

export const { setAuthUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;
