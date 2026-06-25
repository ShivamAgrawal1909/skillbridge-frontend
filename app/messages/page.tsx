'use client'

import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import { getConversations } from '@/lib/api/messages'
import { useAuthStore } from '@/lib/store/auth'
import { MessageSquare } from 'lucide-react'

export default function MessagesPage() {
  const { user, isLoading } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) router.push('/login')
  }, [isLoading, user])

  const { data: conversations, isLoading: convLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: getConversations,
    enabled: !!user,
  })

  if (isLoading) return null

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-slate-900 mb-6">Messages</h1>

          {convLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse">
                  <div className="h-4 bg-slate-200 rounded w-1/3 mb-2" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : conversations?.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
              <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">No conversations yet</h3>
              <p className="text-slate-500">Start by contacting a provider from their profile</p>
            </div>
          ) : (
            <div className="space-y-3">
              {conversations?.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => router.push(`/messages/${conv.id}`)}
                  className="bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold">
                        {conv.other_name?.[0] || '?'}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{conv.other_name || 'Conversation'}</p>
                        <p className="text-sm text-slate-500 mt-0.5">Click to open chat</p>
                      </div>
                    </div>
                    {conv.unread_count > 0 && (
                      <span className="bg-blue-800 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        {conv.unread_count}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}