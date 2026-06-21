'use client'

import { useAuthStore } from '@/lib/store/auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getMyRequests } from '@/lib/api/requests'
import { logout } from '@/lib/api/auth'
import { Plus, Clock, CheckCircle, XCircle, Loader } from 'lucide-react'

const statusConfig = {
  open: { label: 'Open', color: 'bg-blue-100 text-blue-700', icon: Clock },
  in_progress: { label: 'In Progress', color: 'bg-amber-100 text-amber-700', icon: Loader },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: XCircle },
}

export default function ClientDashboard() {
  const { user, clearAuth } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!user) router.push('/login')
  }, [user])

  const { data: requests, isLoading } = useQuery({
    queryKey: ['my-requests'],
    queryFn: getMyRequests,
    enabled: !!user,
  })

  async function handleLogout() {
    await logout()
    clearAuth()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">

          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Welcome, {user?.full_name}</h1>
              <p className="text-slate-500 text-sm mt-1">Manage your service requests</p>
            </div>
            <Link href="/requests/new">
              <Button className="bg-blue-800 hover:bg-blue-900">
                <Plus className="w-4 h-4 mr-2" />
                Post a Request
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse">
                  <div className="h-4 bg-slate-200 rounded w-1/3 mb-3" />
                  <div className="h-3 bg-slate-100 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : requests?.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">No requests yet</h3>
              <p className="text-slate-500 mb-6">Post your first request and get proposals from experts</p>
              <Link href="/requests/new">
                <Button className="bg-blue-800 hover:bg-blue-900">Post a Request</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {requests?.map((req) => {
                const config = statusConfig[req.status]
                const Icon = config.icon
                return (
                  <Link key={req.id} href={`/requests/${req.id}`}>
                    <div className="bg-white rounded-xl border border-slate-200 p-6 hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-800 mb-1">{req.title}</h3>
                          <p className="text-sm text-slate-500 line-clamp-1">{req.description}</p>
                        </div>
                        <span className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full ml-4 ${config.color}`}>
                          <Icon className="w-3 h-3" />
                          {config.label}
                        </span>
                      </div>
                      {(req.budget_min || req.budget_max) && (
                        <div className="mt-3 text-sm text-slate-500">
                          Budget: ₹{req.budget_min} – ₹{req.budget_max}
                        </div>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}