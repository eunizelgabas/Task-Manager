import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isOpen: false,
  activeItem: 'Dashboard',
  isMobile: false,
}

export const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isOpen = !state.isOpen
    },
    closeSidebar: (state) => {
      state.isOpen = false
    },
    openSidebar: (state) => {
      state.isOpen = true
    },
    setActiveItem: (state, action) => {
      state.activeItem = action.payload
    },
    setIsMobile: (state, action) => {
      state.isMobile = action.payload
    },
  },
})

export const {
  toggleSidebar,
  closeSidebar,
  openSidebar,
  setActiveItem,
  setIsMobile
} = sidebarSlice.actions

export default sidebarSlice.reducer
