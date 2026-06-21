'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Navbar from '@/components/layout/Navbar'
import ProviderCard from '@/components/providers/ProviderCard'
import SkeletonCard from '@/components/providers/SkeletonCard'
import { searchProviders } from '@/lib/api/providers'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, SlidersHorizontal } from 'lucide-react'

const categories = [
  { name: 'All', slug: '' },
  { name: 'Website Dev', slug: 'website-development' },
  { name: 'Mobile App', slug: 'mobile-app-development' },
  { name: 'Chatbot', slug: 'chatbot-whatsapp-bot' },
  { name: 'Marketing', slug: 'digital-marketing' },
  { name: 'SEO', slug: 'seo' },
  { name: 'Design', slug: 'graphic-design-branding' },
  { name: 'Content', slug: 'content-writing' },
  { name: 'Video', slug: 'video-editing' },
  { name: 'UI/UX', slug: 'ui-ux-design' },
]

export default function ProvidersPage() {
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')
  const [maxRate, setMaxRate] = useState('')

  const { data: providers, isLoading } = useQuery({
    queryKey: ['providers', category, location, maxRate],
    queryFn: () => searchProviders({
      category_slug: category || undefined,
      location: location || undefined,
      max_rate: maxRate ? Number(maxRate) : undefined,
    }),
  })

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Browse Experts</h1>
            <p className="text-slate-500">Find the right digital expert for your project</p>
          </div>

          {/* filters */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
            <div className="flex flex-wrap gap-3 mb-4">
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => setCategory(cat.slug)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    category === cat.slug
                      ? 'bg-blue-800 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Filter by city..."
                  className="pl-9"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <Input
                placeholder="Max rate (₹/hr)"
                className="w-40"
                type="number"
                value={maxRate}
                onChange={(e) => setMaxRate(e.target.value)}
              />
              <Button
                variant="outline"
                onClick={() => { setCategory(''); setLocation(''); setMaxRate('') }}
              >
                Clear
              </Button>
            </div>
          </div>

          {/* results */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : providers?.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">No experts found</h3>
              <p className="text-slate-500">Try different filters or clear all</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {providers?.map((p) => <ProviderCard key={p.id} provider={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}