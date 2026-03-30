// Auth Utilities
import { apiCall, API_ENDPOINTS, API_BASE_URL } from './api/config'

export const storeToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token)
  }
}

export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken')
  }
  return null
}

export const clearToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken')
  }
}

export const logoutUser = (redirectTo: string = '/admin/login') => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken')
    localStorage.removeItem('adminUser')
    localStorage.removeItem('adminProfile')
    window.location.replace(redirectTo)
  }
}

export const handleUnauthorized = () => {
  logoutUser('/admin/login')
}

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.LOGIN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      throw new Error('Login failed')
    }

    const data = await response.json()
    if (data.access) {
      storeToken(data.access)
      return data
    }
    throw new Error('No access token in response')
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

export const isAuthenticated = (): boolean => {
  return !!getToken()
}
