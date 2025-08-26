import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Layout from '../Layouts/AuthenticatedLayout'
import Login from '../Pages/Auth/Login'
import Dashboard from '../Pages/Dashboard'
import Users from '../Pages/Users'
import Tasks from '../Pages/Tasks'
import Projects from '../Pages/Projects'
import { checkAuth } from '../store/authSlice'
import { openSidebar } from '../store/sidebarSlice'

const AppContent = () => {
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state) => state.auth)

  useEffect(() => {
    // Check if user is authenticated on app load
    dispatch(checkAuth())

    // Open sidebar by default on desktop
    if (window.innerWidth >= 768) {
      dispatch(openSidebar())
    }
  }, [dispatch])

  // If not authenticated, show login
  if (!isAuthenticated) {
    return <Login />
  }

  // If authenticated, show the main app with layout
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/projects" element={<Projects />} />
      </Routes>
    </Layout>
  )
}

export default AppContent
