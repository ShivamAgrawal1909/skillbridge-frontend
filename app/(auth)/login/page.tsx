'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { login, getMe } from '@/lib/api/auth'
import { useAuthStore } from '@/lib/store/auth'

export default function LoginPage() {
  const router = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const { access_token } = await login(email, password)
      const user = await getMe()
      setAuth(access_token, user)
      toast.success(`Welcome back, ${user.full_name}!`)
      if (user.role === 'admin') router.push('/admin')
      else if (user.role === 'provider') router.push('/dashboard/provider')
      else router.push('/dashboard/client')
    } catch (err: any) {
      const msg = err?.response?.data?.detail || 'Invalid credentials'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-sm">
        <CardHeader className="text-center pb-2">
          <div className="text-2xl font-bold text-blue-800 mb-1">SkillBridge</div>
          <CardTitle className="text-xl font-semibold text-slate-800">Welcome back</CardTitle>
          <p className="text-sm text-slate-500">Sign in to your account</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-800 hover:bg-blue-900"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
          <p className="text-center text-sm text-slate-500 mt-4">
            Don't have an account?{' '}
            <Link href="/register" className="text-blue-700 hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}