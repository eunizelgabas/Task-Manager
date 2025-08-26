import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// Configure axios base URL (adjust to your Laravel backend)
const API_BASE_URL = 'http://localhost:8000/api' // Change this to your Laravel API URL

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        email,
        password
      })

      // Store token in localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        // Set default authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
      }

      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Login failed'
      )
    }
  }
)

// Async thunk for logout
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await axios.post(`${API_BASE_URL}/logout`)
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
      return true
    } catch (error) {
      // Even if logout fails on server, clear local data
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
      return true
    }
  }
)

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    checkAuth: (state) => {
      const token = localStorage.getItem('token')
      if (token) {
        state.token = token
        state.isAuthenticated = true
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.isAuthenticated = false
        state.user = null
        state.token = null
      })
      // Logout cases
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.loading = false
        state.error = null
      })
  }
})

export const { clearError, checkAuth } = authSlice.actions
export default authSlice.reducer
