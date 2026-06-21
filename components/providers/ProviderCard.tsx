'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { MapPin, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ProviderProfile } from '@/lib/types'

export default function ProviderCard({ provider }: { provider: ProviderProfile }) {
  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.10)' }}
      transition={{ duration: 0.2 }}
      className="bg-white border border-slate-200 rounded-xl p-6"
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold text-lg flex-shrink-0">
          {provider.full_name?.[0] || 'P'}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-800 truncate">{provider.full_name}</h3>
          <p className="text-sm text-slate-500 truncate">{provider.tagline}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span className="text-sm font-medium text-slate-700">
            {parseFloat(provider.avg_rating).toFixed(1)}
          </span>
          <span className="text-sm text-slate-400">({provider.total_reviews})</span>
        </div>
        {provider.location && (
          <div className="flex items-center gap-1 text-slate-400">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-sm">{provider.location}</span>
          </div>
        )}
      </div>

      {provider.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {provider.skills.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="secondary" className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100">
              {skill}
            </Badge>
          ))}
          {provider.skills.length > 3 && (
            <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-500">
              +{provider.skills.length - 3}
            </Badge>
          )}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          {provider.hourly_rate && (
            <span className="text-sm font-semibold text-slate-800">
              ₹{parseFloat(provider.hourly_rate).toLocaleString('en-IN')}/hr
            </span>
          )}
        </div>
        <Link href={`/providers/${provider.id}`}>
          <Button size="sm" variant="outline" className="text-blue-700 border-blue-200 hover:bg-blue-50">
            View Profile
          </Button>
        </Link>
      </div>
    </motion.div>
  )
}