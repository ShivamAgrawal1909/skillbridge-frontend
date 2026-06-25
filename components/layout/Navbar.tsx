'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/lib/store/auth'
import { logout } from '@/lib/api/auth'
import { MessageSquare, Menu, X } from 'lucide-react'

export default function Navbar() {
  const { user, clearAuth } = useAuthStore()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

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

        {/* desktop links */}
        <div className="hidden md:flex items-center gap-6 text-sm text-slate-600">
          <Link href="/providers" className="hover:text-blue-800 transition-colors">Browse Experts</Link>
          <Link href="/#how-it-works" className="hover:text-blue-800 transition-colors">How it Works</Link>
          {user && (
            <Link href="/messages" className="hover:text-blue-800 transition-colors flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              Messages
            </Link>
          )}
        </div>

        {/* desktop auth buttons */}
        <div className="hidden md:flex items-center gap-3">
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

        {/* mobile hamburger */}
        <button
          className="md:hidden p-2 text-slate-600"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-3">
          <Link href="/providers" className="block text-sm text-slate-700 hover:text-blue-800 py-2" onClick={() => setMenuOpen(false)}>
            Browse Experts
          </Link>
          <Link href="/#how-it-works" className="block text-sm text-slate-700 hover:text-blue-800 py-2" onClick={() => setMenuOpen(false)}>
            How it Works
          </Link>
          {user && (
            <Link href="/messages" className="block text-sm text-slate-700 hover:text-blue-800 py-2" onClick={() => setMenuOpen(false)}>
              Messages
            </Link>
          )}
          {user ? (
            <>
              <Link
                href={user.role === 'provider' ? '/dashboard/provider' : '/dashboard/client'}
                className="block"
                onClick={() => setMenuOpen(false)}
              >
                <Button variant="outline" size="sm" className="w-full">Dashboard</Button>
              </Link>
              <Button size="sm" variant="ghost" className="w-full" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setMenuOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full">Sign in</Button>
              </Link>
              <Link href="/register" onClick={() => setMenuOpen(false)}>
                <Button size="sm" className="w-full bg-blue-800 hover:bg-blue-900">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}