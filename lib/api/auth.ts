import api from './client'
import { User } from '@/lib/types'

export async function login(email: string, password: string) {
  const res = await api.post('/auth/login', { email, password })
  return res.data as { access_token: string }
}

export async function register(data: {
  email: string
  password: string
  full_name: string
  role: 'client' | 'provider'
  phone?: string
}) {
  const res = await api.post('/auth/register', data)
  return res.data as User
}

export async function getMe() {
  const res = await api.get('/auth/me')
  return res.data as User
}

export async function refreshToken() {
  const res = await api.post('/auth/refresh')
  return res.data as { access_token: string }
}

export async function logout() {
  await api.post('/auth/logout')
}