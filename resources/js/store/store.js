import { configureStore } from '@reduxjs/toolkit'
import authSlice from './authSlice'
import sidebarSlice from './sidebarSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    sidebar: sidebarSlice,
  },
})
