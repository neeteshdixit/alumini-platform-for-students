import axios from 'axios'

import { useAuthStore } from '../store/authStore'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

export const api = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 15000,
})

let refreshPromise = null

const shouldSkipRefresh = (url = '') => {
  return (
    url.includes('/api/login') ||
    url.includes('/api/signup') ||
    url.includes('/api/refresh-token') ||
    url.includes('/api/auth/login') ||
    url.includes('/api/auth/signup') ||
    url.includes('/api/auth/refresh-token') ||
    url.includes('/api/v1/auth/login') ||
    url.includes('/api/v1/auth/signup') ||
    url.includes('/api/v1/auth/refresh-token')
  )
}

api.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {}
    const statusCode = error.response?.status

    if (
      statusCode !== 401 ||
      originalRequest._retry ||
      shouldSkipRefresh(originalRequest.url || '')
    ) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    try {
      if (!refreshPromise) {
        refreshPromise = api.post('/api/refresh-token', {})
      }

      const refreshResponse = await refreshPromise
      const newAccessToken = refreshResponse.data?.accessToken

      if (!newAccessToken) {
        throw new Error('Failed to refresh token.')
      }

      useAuthStore.getState().setAccessToken(newAccessToken)
      refreshPromise = null

      originalRequest.headers = originalRequest.headers || {}
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

      return api(originalRequest)
    } catch (refreshError) {
      refreshPromise = null
      useAuthStore.getState().clearSession()
      return Promise.reject(refreshError)
    }
  },
)
