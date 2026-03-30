import { API_BASE_URL, API_ENDPOINTS, getAuthHeader } from './config'
import { getToken } from './auth'

export const careersAPI = {
  list: async (page: number = 1, pageSize: number = 10, search: string = '', isReviewed?: string) => {
    const token = await getToken()
    if (!token) throw new Error('No authentication token')

    const params = new URLSearchParams({
      page: String(page),
      page_size: String(pageSize),
    })

    if (search) params.set('search', search)
    if (isReviewed && isReviewed !== 'All') {
      params.set('is_reviewed', String(isReviewed === 'Reviewed'))
    }

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CAREERS_LIST}?${params}`, {
      method: 'GET',
      headers: getAuthHeader(token),
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch career applications: ${response.statusText}`)
    }

    const result = await response.json()
    return result.data || result
  },

  get: async (id: string) => {
    const token = await getToken()
    if (!token) throw new Error('No authentication token')

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CAREERS_GET(id)}`, {
      method: 'GET',
      headers: getAuthHeader(token),
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch career application: ${response.statusText}`)
    }

    const result = await response.json()
    return result.data || result
  },

  update: async (id: string, data: any) => {
    const token = await getToken()
    if (!token) throw new Error('No authentication token')

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CAREERS_UPDATE(id)}`, {
      method: 'PUT',
      headers: getAuthHeader(token),
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Failed to update career application: ${response.statusText}`)
    }

    const result = await response.json()
    return result.data || result
  },

  delete: async (id: string) => {
    const token = await getToken()
    if (!token) throw new Error('No authentication token')

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CAREERS_DELETE(id)}`, {
      method: 'DELETE',
      headers: getAuthHeader(token),
    })

    if (!response.ok) {
      throw new Error(`Failed to delete career application: ${response.statusText}`)
    }

    const result = await response.json()
    return result.data || result
  },
}
