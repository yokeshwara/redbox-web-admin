import { API_BASE_URL, API_ENDPOINTS } from './config'

export const offersAPI = {
  // List offers
  listOffers: async (search?: string, page: number = 1, pageSize: number = 10, token?: string) => {
    try {
      let url = `${API_BASE_URL}${API_ENDPOINTS.OFFERS_LIST}?page=${page}&page_size=${pageSize}`
      if (search) url += `&search=${encodeURIComponent(search)}`

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      if (token) headers['Authorization'] = `Bearer ${token}`

      const response = await fetch(url, { method: 'GET', headers })
      if (!response.ok) throw new Error(`Failed to list offers: ${response.statusText}`)
      return await response.json()
    } catch (error) {
      console.error('Error listing offers:', error)
      throw error
    }
  },

  // Get single offer
  getOffer: async (id: string, token?: string) => {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      if (token) headers['Authorization'] = `Bearer ${token}`

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.OFFERS_GET(id)}`, { method: 'GET', headers })
      if (!response.ok) throw new Error(`Failed to get offer: ${response.statusText}`)
      return await response.json()
    } catch (error) {
      console.error('Error getting offer:', error)
      throw error
    }
  },

  // Create offer
  createOffer: async (data: any, token?: string) => {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      if (token) headers['Authorization'] = `Bearer ${token}`

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.OFFERS_CREATE}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error(`Failed to create offer: ${response.statusText}`)
      return await response.json()
    } catch (error) {
      console.error('Error creating offer:', error)
      throw error
    }
  },

  // Update offer
  updateOffer: async (id: string, data: any, token?: string) => {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      if (token) headers['Authorization'] = `Bearer ${token}`

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.OFFERS_UPDATE(id)}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error(`Failed to update offer: ${response.statusText}`)
      return await response.json()
    } catch (error) {
      console.error('Error updating offer:', error)
      throw error
    }
  },

  // Delete offer
  deleteOffer: async (id: string, token?: string) => {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      if (token) headers['Authorization'] = `Bearer ${token}`

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.OFFERS_DELETE(id)}`, {
        method: 'POST',
        headers,
      })
      if (!response.ok) throw new Error(`Failed to delete offer: ${response.statusText}`)
      return await response.json()
    } catch (error) {
      console.error('Error deleting offer:', error)
      throw error
    }
  },
}
