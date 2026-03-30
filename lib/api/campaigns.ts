import { API_BASE_URL, API_ENDPOINTS } from './config'

export const campaignsAPI = {
  // List campaigns
  listCampaigns: async (search?: string, page: number = 1, pageSize: number = 10, token?: string) => {
    try {
      let url = `${API_BASE_URL}${API_ENDPOINTS.CAMPAIGNS_LIST}?page=${page}&page_size=${pageSize}`
      if (search) url += `&search=${encodeURIComponent(search)}`

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      if (token) headers['Authorization'] = `Bearer ${token}`

      const response = await fetch(url, { method: 'GET', headers })
      if (!response.ok) throw new Error(`Failed to list campaigns: ${response.statusText}`)
      return await response.json()
    } catch (error) {
      console.error('Error listing campaigns:', error)
      throw error
    }
  },

  // Get single campaign
  getCampaign: async (id: string, token?: string) => {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      if (token) headers['Authorization'] = `Bearer ${token}`

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CAMPAIGNS_GET(id)}`, { method: 'GET', headers })
      if (!response.ok) throw new Error(`Failed to get campaign: ${response.statusText}`)
      return await response.json()
    } catch (error) {
      console.error('Error getting campaign:', error)
      throw error
    }
  },

  // Create campaign
  createCampaign: async (data: any, token?: string) => {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      if (token) headers['Authorization'] = `Bearer ${token}`

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CAMPAIGNS_CREATE}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error(`Failed to create campaign: ${response.statusText}`)
      return await response.json()
    } catch (error) {
      console.error('Error creating campaign:', error)
      throw error
    }
  },

  // Update campaign
  updateCampaign: async (id: string, data: any, token?: string) => {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      if (token) headers['Authorization'] = `Bearer ${token}`

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CAMPAIGNS_UPDATE(id)}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error(`Failed to update campaign: ${response.statusText}`)
      return await response.json()
    } catch (error) {
      console.error('Error updating campaign:', error)
      throw error
    }
  },

  // Delete campaign
  deleteCampaign: async (id: string, token?: string) => {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      if (token) headers['Authorization'] = `Bearer ${token}`

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CAMPAIGNS_DELETE(id)}`, {
        method: 'POST',
        headers,
      })
      if (!response.ok) throw new Error(`Failed to delete campaign: ${response.statusText}`)
      return await response.json()
    } catch (error) {
      console.error('Error deleting campaign:', error)
      throw error
    }
  },
}
