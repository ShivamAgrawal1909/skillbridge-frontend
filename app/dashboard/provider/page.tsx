'use client'

import { useAuthStore } from '@/lib/store/auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import { Button } from '@/components/ui/button'
import { logout } from '@/lib/api/auth'
import { searchProviders } from '@/lib/api/providers'
import { Star, MapPin, Edit } from 'lucide-react'

export default function ProviderDashboard() {
  const { user, clearAuth } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!user) router.push('/login')
    if (user && user.role !== 'provider') router.push('/dashboard/client')
  }, [user])

  const { data: providers } = useQuery({
    queryKey: ['my-profile'],
    queryFn: () => searchProviders({}),
    enabled: !!user,
  })

  const myProfile = providers?.find(p => p.user_id === user?.id)

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
              <p className="text-slate-500 text-sm mt-1">Manage your provider profile</p>
            </div>
            <Link href="/profile/edit">
              <Button variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </Link>
          </div>

          {myProfile ? (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 p-6">
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
                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      myProfile.status === 'approved' ? 'bg-green-100 text-green-700' :
                      myProfile.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {myProfile.status ? myProfile.status.charAt(0).toUpperCase() + myProfile.status.slice(1) : 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>

              {myProfile.status === 'pending' && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-amber-800 text-sm font-medium">
                    Your profile is under review. Admin will approve it within 24 hours.
                  </p>
                </div>
              )}

              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-800 mb-2">Hourly Rate</h3>
                <p className="text-2xl font-bold text-slate-900">
                  {myProfile.hourly_rate ? `₹${parseFloat(myProfile.hourly_rate).toLocaleString('en-IN')}/hr` : 'Not set'}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
              <div className="text-4xl mb-4">👤</div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">Complete your profile</h3>
              <p className="text-slate-500 mb-6">Set up your profile to start getting clients</p>
              <Link href="/profile/edit">
                <Button className="bg-blue-800 hover:bg-blue-900">Create Profile</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}