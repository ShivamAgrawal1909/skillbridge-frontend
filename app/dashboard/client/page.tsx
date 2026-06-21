'use client'

import { useAuthStore } from '@/lib/store/auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { logout } from '@/lib/api/auth'

export default function ClientDashboard() {
  const { user, clearAuth } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!user) router.push('/login')
  }, [user])

  async function handleLogout() {
    await logout()
    clearAuth()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800">
            Welcome, {user?.full_name}
          </h1>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <p className="text-slate-500">Dashboard coming soon — Phase 5 mein build hoga.</p>
        </div>
      </div>
    </div>
  )
}