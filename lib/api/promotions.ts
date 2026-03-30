import { API_BASE_URL, API_ENDPOINTS } from './config'

export const promotionsAPI = {
  // List promotions
  listPromotions: async (search?: string, status?: string, page: number = 1, pageSize: number = 10, token?: string) => {
    try {
      let url = `${API_BASE_URL}${API_ENDPOINTS.PROMOTIONS_LIST}?page=${page}&page_size=${pageSize}`
      if (search) url += `&search=${encodeURIComponent(search)}`
      if (status) url += `&status=${status}`

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      if (token) headers['Authorization'] = `Bearer ${token}`

      const response = await fetch(url, { method: 'GET', headers })
      if (!response.ok) throw new Error(`Failed to list promotions: ${response.statusText}`)
      return await response.json()
    } catch (error) {
      console.error('Error listing promotions:', error)
      throw error
    }
  },

  // Get single promotion
  getPromotion: async (id: string, token?: string) => {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      if (token) headers['Authorization'] = `Bearer ${token}`

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PROMOTIONS_GET(id)}`, { method: 'GET', headers })
      if (!response.ok) throw new Error(`Failed to get promotion: ${response.statusText}`)
      return await response.json()
    } catch (error) {
      console.error('Error getting promotion:', error)
      throw error
    }
  },

  // Create promotion
  createPromotion: async (data: any, token?: string) => {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      if (token) headers['Authorization'] = `Bearer ${token}`

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PROMOTIONS_CREATE}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error(`Failed to create promotion: ${response.statusText}`)
      return await response.json()
    } catch (error) {
      console.error('Error creating promotion:', error)
      throw error
    }
  },

  // Update promotion
  updatePromotion: async (id: string, data: any, token?: string) => {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      if (token) headers['Authorization'] = `Bearer ${token}`

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PROMOTIONS_UPDATE(id)}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error(`Failed to update promotion: ${response.statusText}`)
      return await response.json()
    } catch (error) {
      console.error('Error updating promotion:', error)
      throw error
    }
  },

  // Delete promotion
  deletePromotion: async (id: string, token?: string) => {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      if (token) headers['Authorization'] = `Bearer ${token}`

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PROMOTIONS_DELETE(id)}`, {
        method: 'POST',
        headers,
      })
      if (!response.ok) throw new Error(`Failed to delete promotion: ${response.statusText}`)
      return await response.json()
    } catch (error) {
      console.error('Error deleting promotion:', error)
      throw error
    }
  },
}
