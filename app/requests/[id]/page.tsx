'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import { useAuthStore } from '@/lib/store/auth'
import { getRequestProposals, acceptProposal } from '@/lib/api/requests'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import api from '@/lib/api/client'
import { ServiceRequest, Proposal } from '@/lib/types'

export default function RequestDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user, isLoading } = useAuthStore()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!isLoading && !user) router.push('/login')
  }, [isLoading, user])

  const { data: request } = useQuery({
    queryKey: ['request', id],
    queryFn: async () => {
      const res = await api.get(`/requests`)
      const requests = res.data as ServiceRequest[]
      return requests.find(r => r.id === id)
    },
    enabled: !!user && !!id,
  })

  const { data: proposals } = useQuery({
    queryKey: ['proposals', id],
    queryFn: () => getRequestProposals(id as string),
    enabled: !!user && !!id,
  })

  const acceptMutation = useMutation({
    mutationFn: (proposalId: string) => acceptProposal(proposalId),
    onSuccess: () => {
      toast.success('Proposal accepted! Conversation started.')
      queryClient.invalidateQueries({ queryKey: ['my-requests'] })
      router.push('/messages')
    },
    onError: () => toast.error('Failed to accept proposal'),
  })

  if (isLoading || !user) return null

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to dashboard
          </button>

          {request && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-xl font-bold text-slate-900 mb-2">{request.title}</h1>
                  <p className="text-slate-600 text-sm leading-relaxed">{request.description}</p>
                </div>
                <Badge className={
                  request.status === 'open' ? 'bg-blue-100 text-blue-700 border-0' :
                  request.status === 'in_progress' ? 'bg-amber-100 text-amber-700 border-0' :
                  request.status === 'completed' ? 'bg-green-100 text-green-700 border-0' :
                  'bg-red-100 text-red-700 border-0'
                }>
                  {request.status.replace('_', ' ')}
                </Badge>
              </div>
              {(request.budget_min || request.budget_max) && (
                <div className="mt-3 text-sm text-slate-500">
                  Budget: ₹{request.budget_min} – ₹{request.budget_max}
                </div>
              )}
            </div>
          )}

          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Proposals {proposals?.length ? `(${proposals.length})` : ''}
          </h2>

          {proposals?.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
              <div className="text-3xl mb-3">📬</div>
              <p className="text-slate-500">No proposals yet — providers will respond soon</p>
            </div>
          ) : (
            <div className="space-y-4">
              {proposals?.map((proposal) => (
                <div key={proposal.id} className="bg-white rounded-xl border border-slate-200 p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-semibold text-slate-800">{proposal.provider_name || 'Provider'}</div>
                      <div className="text-sm text-slate-500 mt-0.5">
                        ₹{parseFloat(proposal.proposed_amount).toLocaleString('en-IN')} · {proposal.delivery_days} days delivery
                      </div>
                    </div>
                    <Badge className={
                      proposal.status === 'accepted' ? 'bg-green-100 text-green-700 border-0' :
                      proposal.status === 'rejected' ? 'bg-red-100 text-red-700 border-0' :
                      'bg-slate-100 text-slate-600 border-0'
                    }>
                      {proposal.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">{proposal.cover_letter}</p>
                  {proposal.status === 'pending' && request?.status === 'open' && (
                    <Button
                      size="sm"
                      className="bg-blue-800 hover:bg-blue-900"
                      onClick={() => acceptMutation.mutate(proposal.id)}
                      disabled={acceptMutation.isPending}
                    >
                      <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                      Accept Proposal
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}