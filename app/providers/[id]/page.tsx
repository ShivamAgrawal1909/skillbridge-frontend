'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import { getProvider } from '@/lib/api/providers'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Star, Clock, ArrowLeft } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

export default function ProviderProfilePage() {
  const { id } = useParams()
  const router = useRouter()

  const { data: provider, isLoading } = useQuery({
    queryKey: ['provider', id],
    queryFn: () => getProvider(id as string),
  })

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to results
          </button>

          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-48 rounded-xl" />
              <Skeleton className="h-32 rounded-xl" />
            </div>
          ) : provider ? (
            <div className="space-y-6">
              {/* header card */}
              <div className="bg-white rounded-xl border border-slate-200 p-8">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold text-3xl flex-shrink-0">
                    {provider.full_name?.[0] || 'P'}
                  </div>
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-slate-900 mb-1">{provider.full_name}</h1>
                    <p className="text-slate-500 mb-4">{provider.tagline}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="font-medium">{parseFloat(provider.avg_rating).toFixed(1)}</span>
                        <span className="text-slate-400">({provider.total_reviews} reviews)</span>
                      </div>
                      {provider.location && (
                        <div className="flex items-center gap-1 text-slate-500">
                          <MapPin className="w-4 h-4" />
                          {provider.location}
                        </div>
                      )}
                      {provider.years_experience && (
                        <div className="flex items-center gap-1 text-slate-500">
                          <Clock className="w-4 h-4" />
                          {provider.years_experience} years experience
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    {provider.hourly_rate && (
                      <div className="text-2xl font-bold text-slate-900 mb-1">
                        ₹{parseFloat(provider.hourly_rate).toLocaleString('en-IN')}
                        <span className="text-base font-normal text-slate-500">/hr</span>
                      </div>
                    )}
                    <Button className="bg-blue-800 hover:bg-blue-900 w-full md:w-auto">
                      Contact
                    </Button>
                  </div>
                </div>
              </div>

              {/* bio */}
              {provider.bio && (
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <h2 className="text-lg font-semibold text-slate-800 mb-3">About</h2>
                  <p className="text-slate-600 leading-relaxed">{provider.bio}</p>
                </div>
              )}

              {/* skills */}
              {provider.skills.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <h2 className="text-lg font-semibold text-slate-800 mb-4">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {provider.skills.map((skill) => (
                      <Badge key={skill} className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-0">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-slate-500">Provider not found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}