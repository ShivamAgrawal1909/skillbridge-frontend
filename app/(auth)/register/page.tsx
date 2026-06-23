'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { register } from '@/lib/api/auth'

const registerSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
})

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [role, setRole] = useState<'client' | 'provider' | null>(null)
  const [form, setForm] = useState({ full_name: '', email: '', password: '' })
  const [errors, setErrors] = useState<{ full_name?: string; email?: string; password?: string }>({})
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!role) return
    setErrors({})

    const result = registerSchema.safeParse(form)
    if (!result.success) {
      const fieldErrors: typeof errors = {}
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof typeof errors
        fieldErrors[field] = err.message
      })
      setErrors(fieldErrors)
      return
    }

    setLoading(true)
    try {
      await register({ ...form, role })
      toast.success('Account created! Please sign in.')
      router.push('/login')
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-sm">
        <CardHeader className="text-center pb-2">
          <div className="text-2xl font-bold text-blue-800 mb-1">SkillBridge</div>
          <CardTitle className="text-xl font-semibold text-slate-800">
            {step === 1 ? 'Join SkillBridge' : 'Create your account'}
          </CardTitle>
          <p className="text-sm text-slate-500">
            {step === 1 ? 'I want to...' : `Signing up as a ${role}`}
          </p>
        </CardHeader>
        <CardContent>
          {step === 1 ? (
            <div className="space-y-3">
              <button
                onClick={() => { setRole('client'); setStep(2) }}
                className="w-full p-4 border-2 border-slate-200 rounded-lg text-left hover:border-blue-700 hover:bg-blue-50 transition-all"
              >
                <div className="font-semibold text-slate-800">Hire a digital expert</div>
                <div className="text-sm text-slate-500 mt-1">Post requests, get proposals, hire the best fit</div>
              </button>
              <button
                onClick={() => { setRole('provider'); setStep(2) }}
                className="w-full p-4 border-2 border-slate-200 rounded-lg text-left hover:border-blue-700 hover:bg-blue-50 transition-all"
              >
                <div className="font-semibold text-slate-800">Offer my services</div>
                <div className="text-sm text-slate-500 mt-1">Create a profile, get matched with clients, grow your business</div>
              </button>
              <p className="text-center text-sm text-slate-500 mt-2">
                Already have an account?{' '}
                <Link href="/login" className="text-blue-700 hover:underline font-medium">Sign in</Link>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label>Full Name</Label>
                <Input
                  placeholder="Rahul Sharma"
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                />
                {errors.full_name && <p className="text-xs text-red-500">{errors.full_name}</p>}
              </div>
              <div className="space-y-1">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
              </div>
              <div className="space-y-1">
                <Label>Password</Label>
                <Input
                  type="password"
                  placeholder="Min 8 chars, 1 number, 1 special char"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button type="submit" className="flex-1 bg-blue-800 hover:bg-blue-900" disabled={loading}>
                  {loading ? 'Creating...' : 'Create account'}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}