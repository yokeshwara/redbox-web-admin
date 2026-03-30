import { API_BASE_URL, API_ENDPOINTS, getAuthHeader } from './config'
import { getToken } from '@/lib/auth'

export const branchReviewsAPI = {
  // List branch reviews with pagination and search
  listReviews: async (page: number = 1, pageSize: number = 10, search: string = '', branchId?: string) => {
    try {
      const token = getToken()
      if (!token) throw new Error('No authentication token')

      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
        ...(search && { search }),
        ...(branchId && { branch: branchId }),
      })

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.BRANCH_REVIEWS_LIST}?${params}`, {
        method: 'GET',
        headers: getAuthHeader(token),
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch reviews: ${response.statusText}`)
      }

      const result = await response.json()
      // Handle both wrapped and unwrapped responses
      return result.data || result
    } catch (error) {
      console.error('Error listing reviews:', error)
      throw error
    }
  },

  // Get single review details
  getReview: async (id: string) => {
    try {
      const token = getToken()
      if (!token) throw new Error('No authentication token')

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.BRANCH_REVIEWS_GET(id)}`, {
        method: 'GET',
        headers: getAuthHeader(token),
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch review: ${response.statusText}`)
      }

      const result = await response.json()
      // Handle both wrapped and unwrapped responses
      return result.data || result
    } catch (error) {
      console.error('Error getting review:', error)
      throw error
    }
  },

  // Create new review
  createReview: async (data: {
    customer_name: string
    branch: string
    rating: number
    review_text: string
    display_on_website: boolean
  }) => {
    try {
      const token = getToken()
      if (!token) throw new Error('No authentication token')

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.BRANCH_REVIEWS_CREATE}`, {
        method: 'POST',
        headers: getAuthHeader(token),
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`Failed to create review: ${response.statusText}`)
      }

      const result = await response.json()
      // Handle both wrapped and unwrapped responses
      return result.data || result
    } catch (error) {
      console.error('Error creating review:', error)
      throw error
    }
  },

  // Update review
  updateReview: async (id: string, data: {
    customer_name?: string
    branch?: string
    rating?: number
    review_text?: string
    display_on_website?: boolean
  }) => {
    try {
      const token = getToken()
      if (!token) throw new Error('No authentication token')

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.BRANCH_REVIEWS_UPDATE(id)}`, {
        method: 'PUT',
        headers: getAuthHeader(token),
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`Failed to update review: ${response.statusText}`)
      }

      const result = await response.json()
      // Handle both wrapped and unwrapped responses
      return result.data || result
    } catch (error) {
      console.error('Error updating review:', error)
      throw error
    }
  },

  // Delete review
  deleteReview: async (id: string) => {
    try {
      const token = getToken()
      if (!token) throw new Error('No authentication token')

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.BRANCH_REVIEWS_DELETE(id)}`, {
        method: 'DELETE',
        headers: getAuthHeader(token),
      })

      if (!response.ok) {
        throw new Error(`Failed to delete review: ${response.statusText}`)
      }

      const result = await response.json()
      // Handle both wrapped and unwrapped responses
      return result.data || result
    } catch (error) {
      console.error('Error deleting review:', error)
      throw error
    }
  },
}
