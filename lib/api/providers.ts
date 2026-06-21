import api from './client'
import { ProviderProfile } from '@/lib/types'

export async function searchProviders(params: {
  category_slug?: string
  min_rating?: number
  max_rate?: number
  location?: string
  page?: number
}) {
  const res = await api.get('/providers', { params })
  return res.data as ProviderProfile[]
}

export async function getProvider(id: string) {
  const res = await api.get(`/providers/${id}`)
  return res.data as ProviderProfile
}