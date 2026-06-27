'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Navbar from '@/components/layout/Navbar'
import { useAuthStore } from '@/lib/store/auth'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import api from '@/lib/api/client'
import { ProviderProfile } from '@/lib/types'
import { CheckCircle, XCircle, Star, MapPin } from 'lucide-react'

async function getPendingProviders() {
  const res = await api.get('/providers', { params: { status: 'pending' } })
  return res.data as ProviderProfile[]
}

async function getAllProviders() {
  const res = await api.get('/providers/admin/all')
  return res.data as ProviderProfile[]
}

export default function AdminPage() {
  const { user, isLoading } = useAuthStore()
  const router = useRouter()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!isLoading && !user) router.push('/login')
    if (!isLoading && user && user.role !== 'admin') router.push('/')
  }, [isLoading, user])

  const { data: providers } = useQuery({
    queryKey: ['all-providers'],
    queryFn: getAllProviders,
    enabled: !!user && user.role === 'admin',
  })

  const approveMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/providers/${id}/approve`),
    onSuccess: () => {
      toast.success('Provider approved!')
      queryClient.invalidateQueries({ queryKey: ['all-providers'] })
    },
    onError: () => toast.error('Failed to approve'),
  })

  const suspendMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/providers/${id}/suspend`),
    onSuccess: () => {
      toast.success('Provider suspended')
      queryClient.invalidateQueries({ queryKey: ['all-providers'] })
    },
    onError: () => toast.error('Failed to suspend'),
  })

  if (isLoading || !user) return null

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Admin Panel</h1>
            <p className="text-slate-500 text-sm mt-1">Manage providers and platform activity</p>
          </div>

          {/* stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="text-2xl font-bold text-slate-900">{providers?.length || 0}</div>
              <div className="text-sm text-slate-500 mt-1">Total Providers</div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="text-2xl font-bold text-amber-600">
                {providers?.filter(p => p.status === 'pending').length || 0}
              </div>
              <div className="text-sm text-slate-500 mt-1">Pending Approval</div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="text-2xl font-bold text-green-600">
                {providers?.filter(p => p.status === 'approved').length || 0}
              </div>
              <div className="text-sm text-slate-500 mt-1">Approved</div>
            </div>
          </div>

          {/* provider list */}
          <div className="bg-white rounded-xl border border-slate-200">
            <div className="p-5 border-b border-slate-100">
              <h2 className="font-semibold text-slate-800">All Providers</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {providers?.map((provider) => (
                <div key={provider.id} className="p-5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold flex-shrink-0">
                    {provider.full_name?.[0] || 'P'}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-slate-800">{provider.full_name}</div>
                    <div className="text-sm text-slate-500">{provider.tagline}</div>
                    <div className="flex gap-3 mt-1 text-xs text-slate-400">
                      {provider.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {provider.location}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {parseFloat(provider.avg_rating).toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <Badge className={
                    provider.status === 'approved' ? 'bg-green-100 text-green-700 border-0' :
                    provider.status === 'pending' ? 'bg-amber-100 text-amber-700 border-0' :
                    'bg-red-100 text-red-700 border-0'
                  }>
                    {provider.status}
                  </Badge>
                  <div className="flex gap-2">
                    {provider.status !== 'approved' && (
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 h-8"
                        onClick={() => approveMutation.mutate(provider.id)}
                        disabled={approveMutation.isPending}
                      >
                        <CheckCircle className="w-3.5 h-3.5 mr-1" />
                        Approve
                      </Button>
                    )}
                    {provider.status !== 'suspended' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50 h-8"
                        onClick={() => suspendMutation.mutate(provider.id)}
                        disabled={suspendMutation.isPending}
                      >
                        <XCircle className="w-3.5 h-3.5 mr-1" />
                        Suspend
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}