import api from './client'
import { ServiceRequest, Proposal } from '@/lib/types'

export async function getMyRequests() {
  const res = await api.get('/requests')
  return res.data as ServiceRequest[]
}

export async function createRequest(data: {
  title: string
  description: string
  category_id: string
  budget_min?: number
  budget_max?: number
  deadline?: string
}) {
  const res = await api.post('/requests', data)
  return res.data as ServiceRequest
}

export async function getRequestProposals(requestId: string) {
  const res = await api.get(`/requests/${requestId}/proposals`)
  return res.data as Proposal[]
}

export async function acceptProposal(proposalId: string) {
  const res = await api.patch(`/requests/proposals/${proposalId}/accept`)
  return res.data as Proposal
}

export async function getCategories() {
  const res = await api.get('/providers')
  return res.data
}