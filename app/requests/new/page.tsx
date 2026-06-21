'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Navbar from '@/components/layout/Navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createRequest } from '@/lib/api/requests'
import { CATEGORIES } from '@/lib/api/categories'
import { useAuthStore } from '@/lib/store/auth'

export default function NewRequestPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    category_id: '',
    budget_min: '',
    budget_max: '',
    deadline: '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) { router.push('/login'); return }
    if (!form.category_id) { toast.error('Please select a category'); return }

    setLoading(true)
    try {
      await createRequest({
        title: form.title,
        description: form.description,
        category_id: form.category_id,
        budget_min: form.budget_min ? Number(form.budget_min) : undefined,
        budget_max: form.budget_max ? Number(form.budget_max) : undefined,
        deadline: form.deadline || undefined,
      })
      toast.success('Request posted! Providers will be notified.')
      router.push('/dashboard/client')
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Failed to post request')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Post a Request</h1>
            <p className="text-slate-500 text-sm mt-1">Tell us what you need — providers will send proposals</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <Label>Service Category</Label>
                <select
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.category_id}
                  onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                  required
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <Label>Project Title</Label>
                <Input
                  placeholder="e.g. Website for my cafe in Lucknow"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label>Description</Label>
                <textarea
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-32 resize-none"
                  placeholder="Describe what you need in detail — pages, features, style preferences..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Min Budget (₹)</Label>
                  <Input
                    type="number"
                    placeholder="5000"
                    value={form.budget_min}
                    onChange={(e) => setForm({ ...form, budget_min: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Max Budget (₹)</Label>
                  <Input
                    type="number"
                    placeholder="15000"
                    value={form.budget_max}
                    onChange={(e) => setForm({ ...form, budget_max: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label>Deadline (optional)</Label>
                <Input
                  type="date"
                  value={form.deadline}
                  onChange={(e) => setForm({ ...form, deadline: e.target.value })}
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
                  disabled={loading}
                >
                  {loading ? 'Posting...' : 'Post Request'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}