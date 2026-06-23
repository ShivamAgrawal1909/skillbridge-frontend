'use client'

import { Inter } from 'next/font/google'
import './globals.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/sonner'
import { useEffect } from 'react'
import { refreshToken, getMe } from '@/lib/api/auth'
import { useAuthStore } from '@/lib/store/auth'
import ErrorBoundary from '@/components/ErrorBoundary'

const inter = Inter({ subsets: ['latin'] })
const queryClient = new QueryClient()

function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setAuth, setLoading } = useAuthStore()

  useEffect(() => {
    async function init() {
      try {
        const { access_token } = await refreshToken()
        const user = await getMe(access_token)
        setAuth(access_token, user)
      } catch {
        setLoading(false)
      }
    }
    init()
  }, [])

  return <>{children}</>
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          <ErrorBoundary>
            <AuthProvider>
              {children}
              <Toaster position="bottom-right" />
            </AuthProvider>
          </ErrorBoundary>
        </QueryClientProvider>
      </body>
    </html>
  )
}