import { API_BASE_URL, API_ENDPOINTS, getAuthHeader } from './config'
import { getToken } from './auth'

export const branchesAPI = {
  // List branches with pagination and search
  listBranches: async (page: number = 1, pageSize: number = 5, search: string = '') => {
    try {
      const token = await getToken()

      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
        ...(search && { search }),
      })

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.BRANCHES_LIST}?${params}`, {
        method: 'GET',
        headers: getAuthHeader(token),
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch branches: ${response.statusText}`)
      }

      const result = await response.json()
      // Handle both wrapped and unwrapped responses
      return result.data || result
    } catch (error) {
      console.error('Error listing branches:', error)
      throw error
    }
  },

  // Get single branch details
  getBranch: async (id: string) => {
    try {
      const token = await getToken()

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.BRANCHES_GET(id)}`, {
        method: 'GET',
        headers: getAuthHeader(token),
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch branch: ${response.statusText}`)
      }

      const result = await response.json()
      // Handle both wrapped and unwrapped responses
      return result.data || result
    } catch (error) {
      console.error('Error getting branch:', error)
      throw error
    }
  },

  // Create new branch
  createBranch: async (data: any) => {
    try {
      const token = await getToken()
      const headers =
        data instanceof FormData
          ? { Authorization: `Bearer ${token}` }
          : getAuthHeader(token)

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.BRANCHES_CREATE}`, {
        method: 'POST',
        headers,
        body: data instanceof FormData ? data : JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`Failed to create branch: ${response.statusText}`)
      }

      const result = await response.json()
      // Handle both wrapped and unwrapped responses
      return result.data || result
    } catch (error) {
      console.error('Error creating branch:', error)
      throw error
    }
  },

  // Update branch
  updateBranch: async (id: string, data: any) => {
    try {
      const token = await getToken()
      const headers =
        data instanceof FormData
          ? { Authorization: `Bearer ${token}` }
          : getAuthHeader(token)

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.BRANCHES_UPDATE(id)}`, {
        method: 'PUT',
        headers,
        body: data instanceof FormData ? data : JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`Failed to update branch: ${response.statusText}`)
      }

      const result = await response.json()
      // Handle both wrapped and unwrapped responses
      return result.data || result
    } catch (error) {
      console.error('Error updating branch:', error)
      throw error
    }
  },

  // Delete branch
  deleteBranch: async (id: string) => {
    try {
      const token = await getToken()

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.BRANCHES_DELETE(id)}`, {
        method: 'DELETE',
        headers: getAuthHeader(token),
      })

      if (!response.ok) {
        throw new Error(`Failed to delete branch: ${response.statusText}`)
      }

      const result = await response.json()
      // Handle both wrapped and unwrapped responses
      return result.data || result
    } catch (error) {
      console.error('Error deleting branch:', error)
      throw error
    }
  },
}
