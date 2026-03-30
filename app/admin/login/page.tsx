'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react'
import { loginUser, storeToken } from '@/lib/auth'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('redboxadmin@gmail.com')
  const [password, setPassword] = useState('AdminRed123')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!email || !password) {
      setError('Please enter email and password')
      setLoading(false)
      return
    }

    try {
      const result = await loginUser(email, password)
      
      if (result.access) {
        storeToken(result.access)
        
        // Also store user info if available
        const adminUser = {
          id: result.user_id || 'admin-001',
          email,
          name: 'Admin User',
          role: 'Administrator',
          loginTime: new Date().toISOString(),
        }
        localStorage.setItem('adminUser', JSON.stringify(adminUser))
        
        router.push('/admin/dashboard')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-accent p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-foreground rounded-xl mb-4">
              <LogIn size={32} className="text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-primary-foreground mb-2">Admin Login</h1>
            <p className="text-primary-foreground/80 text-sm">Redbox Restaurant Management System</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="p-8 space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@redbox.com"
                className="w-full px-4 py-3 bg-white border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-white border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-border bg-secondary accent-primary cursor-pointer"
                />
                <span className="text-foreground">Remember me</span>
              </label>
              <Link href="#" className="text-primary hover:text-accent transition-colors">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? 'Logging in...' : 'Login to Dashboard'}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="px-8 pb-8 bg-blue-50 border-t border-blue-200">
            <p className="text-xs text-blue-700 font-semibold mb-3">Production Credentials (Pre-filled):</p>
            <div className="space-y-1 text-xs bg-blue-100 p-3 rounded-lg">
              <p className="text-blue-900">Email: <span className="font-mono font-semibold">redboxadmin@gmail.com</span></p>
              <p className="text-blue-900">Password: <span className="font-mono font-semibold">AdminRed123</span></p>
            </div>
            <p className="text-xs text-blue-600 mt-3">These credentials authenticate with the backend API at<br/>
            <span className="font-mono text-blue-700">https://theredbox-admin-python-emjc.onrender.com</span></p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-muted-foreground text-sm mt-6">
          Secure admin access only • Use strong credentials
        </p>
      </div>
    </div>
  )
}
