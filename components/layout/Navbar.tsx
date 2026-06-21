'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/lib/store/auth'
import { logout } from '@/lib/api/auth'

export default function Navbar() {
  const { user, clearAuth } = useAuthStore()
  const router = useRouter()

  async function handleLogout() {
    await logout()
    clearAuth()
    router.push('/')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-800">
          SkillBridge
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm text-slate-600">
          <Link href="/providers" className="hover:text-blue-800 transition-colors">Browse Experts</Link>
          <Link href="#how-it-works" className="hover:text-blue-800 transition-colors">How it Works</Link>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link href={user.role === 'provider' ? '/dashboard/provider' : '/dashboard/client'}>
                <Button variant="outline" size="sm">Dashboard</Button>
              </Link>
              <Button size="sm" variant="ghost" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Sign in</Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-blue-800 hover:bg-blue-900">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}