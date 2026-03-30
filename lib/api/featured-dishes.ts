import { API_BASE_URL, API_ENDPOINTS, getAuthHeader } from './config'
import { getToken } from '@/lib/auth'

const buildRequestOptions = (token: string, data?: FormData | Record<string, unknown>) => {
  if (data instanceof FormData) {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    }
  }

  return {
    headers: getAuthHeader(token),
    body: data ? JSON.stringify(data) : undefined,
  }
}

export const featuredDishesAPI = {
  // List featured dishes
  list: async (page: number = 1, pageSize: number = 10) => {
    try {
      const token = getToken()
      if (!token) throw new Error('No authentication token')

      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
      })

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.FEATURED_DISHES_LIST}?${params}`, {
        method: 'GET',
        headers: getAuthHeader(token),
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch featured dishes: ${response.statusText}`)
      }

      const result = await response.json()
      return result.data || result
    } catch (error) {
      console.error('Error listing featured dishes:', error)
      throw error
    }
  },

  // Get single featured dish
get: async (id: string) => {
  try {
    const token = getToken()
    if (!token) throw new Error('No authentication token')

    const params = new URLSearchParams({ id })
    const response = await fetch(`${API_BASE_URL}/api/cms/featured-dishes?${params.toString()}`, {
      method: 'GET',
      headers: getAuthHeader(token),
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch featured dish: ${response.statusText}`)
    }

    const result = await response.json()
    return result.data || result
  } catch (error) {
    console.error('Error getting featured dish:', error)
    throw error
  }
},
  // Create featured dish
  create: async (data: any) => {
    try {
      const token = getToken()
      if (!token) throw new Error('No authentication token')

      const requestOptions = buildRequestOptions(token, data)
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.FEATURED_DISHES_CREATE}`, {
        method: 'POST',
        ...requestOptions,
      })

      if (!response.ok) {
        throw new Error(`Failed to create featured dish: ${response.statusText}`)
      }

      const result = await response.json()
      return result.data || result
    } catch (error) {
      console.error('Error creating featured dish:', error)
      throw error
    }
  },

  // Update featured dish
  update: async (id: string, data: any) => {
    try {
      const token = getToken()
      if (!token) throw new Error('No authentication token')

      const requestOptions = buildRequestOptions(token, data)
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.FEATURED_DISHES_UPDATE(id)}`, {
        method: 'PUT',
        ...requestOptions,
      })

      if (!response.ok) {
        throw new Error(`Failed to update featured dish: ${response.statusText}`)
      }

      const result = await response.json()
      return result.data || result
    } catch (error) {
      console.error('Error updating featured dish:', error)
      throw error
    }
  },

  // Delete featured dish
  delete: async (id: string) => {
    try {
      const token = getToken()
      if (!token) throw new Error('No authentication token')

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.FEATURED_DISHES_DELETE(id)}`, {
        method: 'DELETE',
        headers: getAuthHeader(token),
      })

      if (!response.ok) {
        throw new Error(`Failed to delete featured dish: ${response.statusText}`)
      }

      const result = await response.json()
      return result.data || result
    } catch (error) {
      console.error('Error deleting featured dish:', error)
      throw error
    }
  },
}
