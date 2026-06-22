'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Navbar from '@/components/layout/Navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/lib/store/auth'
import api from '@/lib/api/client'

export default function EditProfilePage() {
  const { user, isLoading } = useAuthStore()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    bio: '',
    tagline: '',
    hourly_rate: '',
    years_experience: '',
    location: '',
  })

  useEffect(() => {
    if (!isLoading && !user) router.push('/login')
    if (!isLoading && user?.role !== 'provider') router.push('/dashboard/client')
  }, [isLoading, user])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await api.post('/providers/profile', {
        bio: form.bio || null,
        tagline: form.tagline || null,
        hourly_rate: form.hourly_rate ? parseFloat(form.hourly_rate) : null,
        years_experience: form.years_experience ? parseInt(form.years_experience) : null,
        location: form.location || null,
        skill_ids: [],
      })
      toast.success('Profile updated!')
      router.push('/dashboard/provider')
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (isLoading) return null

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Edit Profile</h1>
            <p className="text-slate-500 text-sm mt-1">Update your provider profile</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <Label>Tagline</Label>
                <Input
                  placeholder="e.g. I build fast, clean web apps"
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <Label>Bio</Label>
                <textarea
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-28 resize-none"
                  placeholder="Tell clients about yourself, your experience, and what makes you stand out..."
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Hourly Rate (₹)</Label>
                  <Input
                    type="number"
                    placeholder="500"
                    value={form.hourly_rate}
                    onChange={(e) => setForm({ ...form, hourly_rate: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Years Experience</Label>
                  <Input
                    type="number"
                    placeholder="2"
                    value={form.years_experience}
                    onChange={(e) => setForm({ ...form, years_experience: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label>Location</Label>
                <Input
                  placeholder="e.g. Lucknow"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-blue-800 hover:bg-blue-900"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Profile'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}