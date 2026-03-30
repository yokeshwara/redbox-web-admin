'use client'

import { ReactNode, useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Sidebar } from './sidebar'
import { AdminHeader } from './admin-header'
import { clearToken, getToken, handleUnauthorized } from '@/lib/auth'

interface AdminLayoutProps {
  children: ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  useEffect(() => {
    const token = getToken()

    if (!token) {
      clearToken()
      if (pathname !== '/admin/login') {
        router.replace('/admin/login')
      }
      return
    }

    setIsCheckingAuth(false)
  }, [pathname, router])

  useEffect(() => {
    const originalFetch = window.fetch.bind(window)

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const response = await originalFetch(input, init)

      if (response.status === 401 && pathname !== '/admin/login') {
        handleUnauthorized()
      }

      return response
    }

    return () => {
      window.fetch = originalFetch
    }
  }, [pathname])

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm font-medium text-gray-600">Checking admin session...</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-0 md:ml-64 overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="p-4 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
