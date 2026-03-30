import { API_BASE_URL, API_ENDPOINTS, getAuthHeader } from './config'
import { getToken } from './auth'

export const franchisesAPI = {
  // List franchises with pagination and search
  listFranchises: async (page: number = 1, pageSize: number = 10, search: string = '') => {
    try {
      const token = await getToken()
      if (!token) throw new Error('No authentication token')

      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
        ...(search && { search }),
      })

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.FRANCHISES_LIST}?${params}`, {
        method: 'GET',
        headers: getAuthHeader(token),
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch franchises: ${response.statusText}`)
      }

      const result = await response.json()
      // Handle both wrapped and unwrapped responses
      return result.data || result
    } catch (error) {
      console.error('Error listing franchises:', error)
      throw error
    }
  },

  // Get single franchise details
  getFranchise: async (id: string) => {
    try {
      const token = await getToken()
      if (!token) throw new Error('No authentication token')

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.FRANCHISES_GET(id)}`, {
        method: 'GET',
        headers: getAuthHeader(token),
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch franchise: ${response.statusText}`)
      }

      const result = await response.json()
      // Handle both wrapped and unwrapped responses
      return result.data || result
    } catch (error) {
      console.error('Error getting franchise:', error)
      throw error
    }
  },

  // Create new franchise
  createFranchise: async (data: any) => {
    try {
      const token = await getToken()
      if (!token) throw new Error('No authentication token')

      const formData = new FormData()
      
      // Append all text fields
      Object.keys(data).forEach(key => {
        if (key !== 'profile_image' && data[key] !== null && data[key] !== undefined) {
          formData.append(key, data[key])
        }
      })

      // Append file if provided
      if (data.profile_image && data.profile_image instanceof File) {
        formData.append('profile_image', data.profile_image)
      }

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.FRANCHISES_CREATE}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Failed to create franchise: ${response.statusText}`)
      }

      const result = await response.json()
      // Handle both wrapped and unwrapped responses
      return result.data || result
    } catch (error) {
      console.error('Error creating franchise:', error)
      throw error
    }
  },

  // Update franchise
  updateFranchise: async (id: string, data: any) => {
    try {
      const token = await getToken()
      if (!token) throw new Error('No authentication token')

      const formData = new FormData()
      
      // Append all text fields
      Object.keys(data).forEach(key => {
        if (key !== 'profile_image' && data[key] !== null && data[key] !== undefined) {
          formData.append(key, data[key])
        }
      })

      // Append file if provided
      if (data.profile_image && data.profile_image instanceof File) {
        formData.append('profile_image', data.profile_image)
      }

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.FRANCHISES_UPDATE(id)}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Failed to update franchise: ${response.statusText}`)
      }

      const result = await response.json()
      // Handle both wrapped and unwrapped responses
      return result.data || result
    } catch (error) {
      console.error('Error updating franchise:', error)
      throw error
    }
  },

  // Delete franchise
  deleteFranchise: async (id: string) => {
    try {
      const token = await getToken()
      if (!token) throw new Error('No authentication token')

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.FRANCHISES_DELETE(id)}`, {
        method: 'DELETE',
        headers: getAuthHeader(token),
      })

      if (!response.ok) {
        throw new Error(`Failed to delete franchise: ${response.statusText}`)
      }

      const result = await response.json()
      // Handle both wrapped and unwrapped responses
      return result.data || result
    } catch (error) {
      console.error('Error deleting franchise:', error)
      throw error
    }
  },

  // Get franchise statistics
  getFranchiseStats: async () => {
    try {
      const token = await getToken()
      if (!token) throw new Error('No authentication token')

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.FRANCHISES_STATS}`, {
        method: 'GET',
        headers: getAuthHeader(token),
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch franchise stats: ${response.statusText}`)
      }

      const result = await response.json()
      // Handle both wrapped and unwrapped responses
      return result.data || result
    } catch (error) {
      console.error('Error fetching franchise stats:', error)
      throw error
    }
  },
}
