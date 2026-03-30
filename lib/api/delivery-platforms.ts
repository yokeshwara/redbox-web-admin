import { API_BASE_URL, API_ENDPOINTS, getAuthHeader } from './config'
import { getToken } from '@/lib/auth'

export const deliveryPlatformsAPI = {
  // List delivery platforms with pagination and search
  listPlatforms: async (page: number = 1, pageSize: number = 10, search: string = '') => {
    try {
      const token = getToken()
      if (!token) throw new Error('No authentication token')

      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
        ...(search && { search }),
      })

      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.DELIVERY_PLATFORMS_LIST}?${params}`,
        {
          method: 'GET',
          headers: getAuthHeader(token),
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch delivery platforms: ${response.statusText}`)
      }

      const result = await response.json()
      // Handle both wrapped and unwrapped responses
      return result.data || result.results || result
    } catch (error) {
      console.error('Error listing delivery platforms:', error)
      throw error
    }
  },

  // Get single delivery platform details
  getPlatform: async (id: string) => {
    try {
      const token = getToken()
      if (!token) throw new Error('No authentication token')

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.DELIVERY_PLATFORMS_GET(id)}`, {
        method: 'GET',
        headers: getAuthHeader(token),
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch delivery platform: ${response.statusText}`)
      }

      const result = await response.json()
      // Handle both wrapped and unwrapped responses
      return result.data || result
    } catch (error) {
      console.error('Error getting delivery platform:', error)
      throw error
    }
  },

  // Create new delivery platform
  createPlatform: async (data: any) => {
    try {
      const token = getToken()
      if (!token) throw new Error('No authentication token')

      const formData = new FormData()

      // Add form fields
      if (data.name) formData.append('name', data.name)
      if (data.url) formData.append('url', data.url)
      if (data.commission !== undefined) formData.append('commission', data.commission.toString())
      if (data.status) formData.append('status', data.status)
      // Add branches if provided
      if (data.branches && Array.isArray(data.branches)) {
        data.branches.forEach((branchId: string) => {
          formData.append('branches', branchId)
        })
      }

      const headers = getAuthHeader(token)
      // Remove Content-Type for FormData - browser will set it with boundary
      delete headers['Content-Type']

      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.DELIVERY_PLATFORMS_CREATE}`,
        {
          method: 'POST',
          headers,
          body: formData,
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to create delivery platform: ${response.statusText}`)
      }

      const result = await response.json()
      // Handle both wrapped and unwrapped responses
      return result.data || result
    } catch (error) {
      console.error('Error creating delivery platform:', error)
      throw error
    }
  },

  // Update delivery platform
  updatePlatform: async (id: string, data: any) => {
    try {
      const token = getToken()
      if (!token) throw new Error('No authentication token')

      const formData = new FormData()

      // Add form fields
      if (data.name) formData.append('name', data.name)
      if (data.url) formData.append('url', data.url)
      if (data.commission !== undefined) formData.append('commission', data.commission.toString())
      if (data.status) formData.append('status', data.status)
      // Add branches if provided
      if (data.branches && Array.isArray(data.branches)) {
        data.branches.forEach((branchId: string) => {
          formData.append('branches', branchId)
        })
      }

      const headers = getAuthHeader(token)
      // Remove Content-Type for FormData - browser will set it with boundary
      delete headers['Content-Type']

      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.DELIVERY_PLATFORMS_UPDATE(id)}`,
        {
          method: 'PUT',
          headers,
          body: formData,
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to update delivery platform: ${response.statusText}`)
      }

      const result = await response.json()
      // Handle both wrapped and unwrapped responses
      return result.data || result
    } catch (error) {
      console.error('Error updating delivery platform:', error)
      throw error
    }
  },

  // Delete delivery platform
  deletePlatform: async (id: string) => {
    try {
      const token = getToken()
      if (!token) throw new Error('No authentication token')

      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.DELIVERY_PLATFORMS_DELETE(id)}`,
        {
          method: 'DELETE',
          headers: getAuthHeader(token),
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to delete delivery platform: ${response.statusText}`)
      }

      const result = await response.json()
      // Handle both wrapped and unwrapped responses
      return result.data || result
    } catch (error) {
      console.error('Error deleting delivery platform:', error)
      throw error
    }
  },
}
