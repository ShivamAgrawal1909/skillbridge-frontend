'use client'
import React from 'react'

import { useAuthStore } from '@/lib/store/auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { searchProviders } from '@/lib/api/providers'
import { toast } from 'sonner'
import { Star, MapPin, Edit, Briefcase, Send } from 'lucide-react'
import api from '@/lib/api/client'
import { ServiceRequest } from '@/lib/types'

async function getOpenRequests() {
  const res = await api.get('/requests/open')
  return res.data as ServiceRequest[]
}

export default function ProviderDashboard() {
  const { user, isLoading } = useAuthStore()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [proposalForm, setProposalForm] = React.useState<{ requestId: string | null, cover_letter: string, proposed_amount: string, delivery_days: string }>({
    requestId: null, cover_letter: '', proposed_amount: '', delivery_days: ''
  })

  useEffect(() => {
    if (!isLoading && !user) router.push('/login')
    if (!isLoading && user && user.role !== 'provider') router.push('/dashboard/client')
  }, [isLoading, user])

  const { data: providers } = useQuery({
    queryKey: ['my-profile'],
    queryFn: () => searchProviders({}),
    enabled: !!user,
  })

  const { data: openRequests } = useQuery({
    queryKey: ['open-requests'],
    queryFn: getOpenRequests,
    enabled: !!user,
  })

  const proposalMutation = useMutation({
    mutationFn: async ({ requestId, data }: { requestId: string, data: any }) => {
      return api.post(`/requests/${requestId}/proposals`, data)
    },
    onSuccess: () => {
      toast.success('Proposal submitted!')
      setProposalForm({ requestId: null, cover_letter: '', proposed_amount: '', delivery_days: '' })
      queryClient.invalidateQueries({ queryKey: ['open-requests'] })
    },
    onError: (err: any) => toast.error(err?.response?.data?.detail || 'Failed to submit'),
  })

  const myProfile = providers?.find(p => p.user_id === user?.id)

  if (isLoading || !user) return null

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Welcome, {user?.full_name}</h1>
              <p className="text-slate-500 text-sm mt-1">Manage your provider profile</p>
            </div>
            <Link href="/profile/edit">
              <Button variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </Link>
          </div>

          {myProfile && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold text-2xl">
                  {user?.full_name?.[0]}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-slate-800">{user?.full_name}</h2>
                  <p className="text-slate-500">{myProfile.tagline}</p>
                  <div className="flex gap-4 mt-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span>{parseFloat(myProfile.avg_rating).toFixed(1)} ({myProfile.total_reviews} reviews)</span>
                    </div>
                    {myProfile.location && (
                      <div className="flex items-center gap-1 text-slate-500">
                        <MapPin className="w-4 h-4" />
                        {myProfile.location}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  {myProfile.hourly_rate && (
                    <p className="text-xl font-bold text-slate-900">₹{parseFloat(myProfile.hourly_rate).toLocaleString('en-IN')}/hr</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-700" />
              Open Requests
            </h2>
            {openRequests?.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                <p className="text-slate-500">No open requests right now — check back soon</p>
              </div>
            ) : (
              <div className="space-y-4">
                {openRequests?.map((req) => (
                  <div key={req.id} className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-slate-800">{req.title}</h3>
                        <p className="text-sm text-slate-500 mt-1 line-clamp-2">{req.description}</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-700 border-0">Open</Badge>
                    </div>
                    {(req.budget_min || req.budget_max) && (
                      <p className="text-sm text-slate-500 mb-3">Budget: ₹{req.budget_min} – ₹{req.budget_max}</p>
                    )}

                    {proposalForm.requestId === req.id ? (
                      <div className="border border-slate-200 rounded-lg p-4 space-y-3 mt-3">
                        <textarea
                          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-24 resize-none"
                          placeholder="Cover letter — why are you the best fit?"
                          value={proposalForm.cover_letter}
                          onChange={(e) => setProposalForm({ ...proposalForm, cover_letter: e.target.value })}
                        />
                        <div className="flex gap-3">
                          <input
                            type="number"
                            className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Amount (₹)"
                            value={proposalForm.proposed_amount}
                            onChange={(e) => setProposalForm({ ...proposalForm, proposed_amount: e.target.value })}
                          />
                          <input
                            type="number"
                            className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Delivery days"
                            value={proposalForm.delivery_days}
                            onChange={(e) => setProposalForm({ ...proposalForm, delivery_days: e.target.value })}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setProposalForm({ requestId: null, cover_letter: '', proposed_amount: '', delivery_days: '' })}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            className="bg-blue-800 hover:bg-blue-900"
                            disabled={proposalMutation.isPending}
                            onClick={() => proposalMutation.mutate({
                              requestId: req.id,
                              data: {
                                cover_letter: proposalForm.cover_letter,
                                proposed_amount: parseFloat(proposalForm.proposed_amount),
                                delivery_days: parseInt(proposalForm.delivery_days),
                              }
                            })}
                          >
                            <Send className="w-3.5 h-3.5 mr-1.5" />
                            Submit Proposal
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-blue-700 border-blue-200 hover:bg-blue-50"
                        onClick={() => setProposalForm({ ...proposalForm, requestId: req.id })}
                      >
                        Submit Proposal
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}