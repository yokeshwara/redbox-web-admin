import { API_BASE_URL, API_ENDPOINTS } from './config'

export const franchiseAPI = {
  listFranchises: async (searchTerm?: string, token?: string) => {
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.FRANCHISES_LIST}?${params.toString()}`,
        { headers }
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch franchises: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching franchises:', error)
      throw error
    }
  },

  getFranchise: async (id: string, token?: string) => {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.FRANCHISES_GET(id)}`,
        { headers }
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch franchise: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching franchise:', error)
      throw error
    }
  },

  getStats: async (token?: string) => {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.FRANCHISES_STATS}`,
        { headers }
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch franchise stats: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching franchise stats:', error)
      throw error
    }
  },

  updateFranchise: async (id: string, data: any, token?: string) => {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.FRANCHISES_UPDATE(id)}`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify(data),
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to update franchise: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error updating franchise:', error)
      throw error
    }
  },

  deleteFranchise: async (id: string, token?: string) => {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.FRANCHISES_DELETE(id)}`,
        {
          method: 'POST',
          headers,
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to delete franchise: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error deleting franchise:', error)
      throw error
    }
  },

  listReviews: async (token?: string) => {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.FRANCHISE_REVIEWS_LIST}`,
        { headers }
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch franchise reviews: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching franchise reviews:', error)
      throw error
    }
  },

  updateReview: async (id: string, data: any, token?: string) => {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.FRANCHISE_REVIEWS_UPDATE(id)}`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify(data),
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to update franchise review: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error updating franchise review:', error)
      throw error
    }
  },
}
