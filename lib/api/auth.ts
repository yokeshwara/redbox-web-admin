/**
 * Authentication token management utilities
 */

/**
 * Retrieves the authentication token from localStorage
 * @returns The token string or null if not found
 */
export const getToken = async (): Promise<string | null> => {
  if (typeof window === 'undefined') {
    // Server-side context - return null
    return null
  }
  
  try {
    // Use 'authToken' key which is consistent with lib/auth.ts
    const token = localStorage.getItem('authToken')
    return token
  } catch (error) {
    console.warn('[v0] Error reading auth token:', error)
    return null
  }
}

/**
 * Sets the authentication token in localStorage
 * @param token The token to store
 */
export const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token)
    console.log('[v0] Auth token saved to localStorage')
  }
}

/**
 * Removes the authentication token from localStorage
 */
export const clearToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken')
    console.log('[v0] Auth token cleared')
  }
}

/**
 * Checks if a valid token exists
 */
export const hasToken = (): boolean => {
  if (typeof window === 'undefined') {
    return false
  }
  
  return !!localStorage.getItem('authToken')
}

// Expose debug helpers to window for testing
if (typeof window !== 'undefined' && window) {
  try {
    const w = window as any
    if (w) {
      w.__setAuthToken = setToken
      w.__getAuthToken = getToken
      w.__clearAuthToken = clearToken
      w.__hasAuthToken = hasToken
      console.log('[v0] Auth debug available: window.__setAuthToken("token"), window.__clearAuthToken()')
    }
  } catch (error) {
    // Silently fail if we can't set window properties
    console.warn('[v0] Could not set window debug helpers:', error)
  }
}
