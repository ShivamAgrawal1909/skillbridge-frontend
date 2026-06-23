import axios from 'axios'
import { toast } from 'sonner'
import { useAuthStore } from '@/lib/store/auth'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    const status = error.response?.status

    if (status === 401 && !original._retry) {
      original._retry = true
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/auth/refresh`,
          {},
          { withCredentials: true }
        )
        const newToken = res.data.access_token
        useAuthStore.getState().setAuth(newToken, useAuthStore.getState().user!)
        original.headers.Authorization = `Bearer ${newToken}`
        return api(original)
      } catch {
        useAuthStore.getState().clearAuth()
        window.location.href = '/login'
      }
    }

    if (status === 429) {
      toast.error('Too many requests — please wait a moment', { duration: 4000 })
    }

    if (status === 500) {
      toast.error('Server error — please try again', { duration: 4000 })
    }

    if (!error.response) {
      toast.error('Check your internet connection', { duration: 4000 })
    }

    return Promise.reject(error)
  }
)

export default api