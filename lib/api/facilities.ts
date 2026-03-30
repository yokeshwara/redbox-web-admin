import { API_BASE_URL, API_ENDPOINTS, getAuthHeader } from './config'
import { getToken } from '@/lib/auth'

export const facilitiesAPI = {
  // List branch facilities with pagination and search
  listFacilities: async (page: number = 1, pageSize: number = 10, search: string = '') => {
    try {
      const token = getToken()
      if (!token) throw new Error('No authentication token')

      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
        ...(search && { search }),
      })

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.BRANCH_FACILITIES_LIST}?${params}`, {
        method: 'GET',
        headers: getAuthHeader(token),
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch facilities: ${response.statusText}`)
      }

      const result = await response.json()
      return result.data || result
    } catch (error) {
      console.error('Error listing facilities:', error)
      throw error
    }
  },

  // Get single facility details
  getFacility: async (id: string, search: string = '') => {
    try {
      const token = getToken()
      if (!token) throw new Error('No authentication token')

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.BRANCH_FACILITIES_GET(id)}`, {
        method: 'GET',
        headers: getAuthHeader(token),
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch facility: ${response.statusText}`)
      }

      const result = await response.json()
      return result.data || result
    } catch (error) {
      console.error('Error getting facility:', error)
      throw error
    }
  },

  // Create new facility
  createFacility: async (data: any) => {
    try {
      const token = getToken()
      if (!token) throw new Error('No authentication token')

      const formData = new FormData()
      
      // Add icon file if it exists
      if (data.icon instanceof File) {
        formData.append('icon', data.icon)
      }
      
      // Add other fields
      if (data.name) formData.append('name', data.name)
      if (data.description) formData.append('description', data.description)
      
      // Add branches as array
      if (data.branches && Array.isArray(data.branches)) {
        data.branches.forEach((branchId: string) => {
          formData.append('branches', branchId)
        })
      }

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.BRANCH_FACILITIES_CREATE}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Failed to create facility: ${response.statusText}`)
      }

      const result = await response.json()
      return result.data || result
    } catch (error) {
      console.error('Error creating facility:', error)
      throw error
    }
  },

  // Update facility
  updateFacility: async (id: string, data: any) => {
    try {
      const token = getToken()
      if (!token) throw new Error('No authentication token')

      const formData = new FormData()
      
      // Add icon file if it exists
      if (data.icon instanceof File) {
        formData.append('icon', data.icon)
      }
      
      // Add other fields
      if (data.name) formData.append('name', data.name)
      if (data.description) formData.append('description', data.description)
      
      // Add branches as array
      if (data.branches && Array.isArray(data.branches)) {
        data.branches.forEach((branchId: string) => {
          formData.append('branches', branchId)
        })
      }

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.BRANCH_FACILITIES_UPDATE(id)}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Failed to update facility: ${response.statusText}`)
      }

      const result = await response.json()
      return result.data || result
    } catch (error) {
      console.error('Error updating facility:', error)
      throw error
    }
  },

  // Delete facility
  deleteFacility: async (id: string) => {
    try {
      const token = getToken()
      if (!token) throw new Error('No authentication token')

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.BRANCH_FACILITIES_DELETE(id)}`, {
        method: 'DELETE',
        headers: getAuthHeader(token),
      })

      if (!response.ok) {
        throw new Error(`Failed to delete facility: ${response.statusText}`)
      }

      const result = await response.json()
      return result.data || result
    } catch (error) {
      console.error('Error deleting facility:', error)
      throw error
    }
  },
}
