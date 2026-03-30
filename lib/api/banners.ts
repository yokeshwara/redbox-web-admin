import { API_BASE_URL, API_ENDPOINTS, getAuthHeader } from './config'
import { getToken } from '@/lib/auth'

export const bannersAPI = {
  // List banners
list: async (page: number = 1, pageSize: number = 10) => {

  const token = await getToken()

  if (!token) {
    console.error("Token missing")
    return []
  }

  const params = new URLSearchParams({
    page: page.toString(),
    page_size: pageSize.toString(),
  })

  const url = `${API_BASE_URL}${API_ENDPOINTS.BANNERS_LIST}?${params}`

  console.log("Calling Banner API:", url)

  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeader(token),
  })

  const result = await response.json()

  console.log("Banner API Response:", result)

  return result.data || result
},

  // Get single banner
  get: async (id: string) => {
    try {
      const token = getToken()
      if (!token) throw new Error('No authentication token')

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.BANNERS_GET(id)}`, {
        method: 'GET',
        headers: getAuthHeader(token),
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch banner: ${response.statusText}`)
      }

      const result = await response.json()
      return result.data || result
    } catch (error) {
      console.error('Error getting banner:', error)
      throw error
    }
  },

  // Create banner
  create: async (data: any) => {
    try {
      const token = getToken()
      if (!token) throw new Error('No authentication token')

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.BANNERS_CREATE}`, {
        method: 'POST',
        headers: getAuthHeader(token),
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`Failed to create banner: ${response.statusText}`)
      }

      const result = await response.json()
      return result.data || result
    } catch (error) {
      console.error('Error creating banner:', error)
      throw error
    }
  },

  // Update banner
  update: async (id: string, data: any) => {
    try {
      const token = getToken()
      if (!token) throw new Error('No authentication token')

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.BANNERS_UPDATE(id)}`, {
        method: 'PUT',
        headers: getAuthHeader(token),
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`Failed to update banner: ${response.statusText}`)
      }

      const result = await response.json()
      return result.data || result
    } catch (error) {
      console.error('Error updating banner:', error)
      throw error
    }
  },

  // Delete banner
  delete: async (id: string) => {
    try {
      const token = getToken()
      if (!token) throw new Error('No authentication token')

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.BANNERS_DELETE(id)}`, {
        method: 'DELETE',
        headers: getAuthHeader(token),
      })

      if (!response.ok) {
        throw new Error(`Failed to delete banner: ${response.statusText}`)
      }

      const result = await response.json()
      return result.data || result
    } catch (error) {
      console.error('Error deleting banner:', error)
      throw error
    }
  },

  // Activate banner
  activate: async (id: string) => {
    try {
      const token = getToken()
      if (!token) throw new Error('No authentication token')

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.BANNERS_ACTIVATE(id)}`, {
        method: 'PATCH',
        headers: getAuthHeader(token),
      })

      if (!response.ok) {
        throw new Error(`Failed to activate banner: ${response.statusText}`)
      }

      const result = await response.json()
      return result.data || result
    } catch (error) {
      console.error('Error activating banner:', error)
      throw error
    }
  },
}
