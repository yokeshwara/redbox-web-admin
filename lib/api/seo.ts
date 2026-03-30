import { API_BASE_URL, API_ENDPOINTS, getAuthHeader } from './config'
import { getToken } from './auth'

export const seoAPI = {
  // List all SEO pages
  async list(page: number = 1, pageSize: number = 20) {
    const token = await getToken()
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.SEO_LIST}?page=${page}&page_size=${pageSize}`,
      {
        headers: getAuthHeader(token),
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch SEO pages: ${response.statusText}`)
    }

    return response.json()
  },

  // Create SEO page
  async create(data: { page_name: string; meta_title: string; meta_description: string; keywords: string }) {
    const token = await getToken()
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.SEO_CREATE}`,
      {
        method: 'POST',
        headers: getAuthHeader(token),
        body: JSON.stringify(data),
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to create SEO page: ${response.statusText}`)
    }

    return response.json()
  },

  // Get single SEO page
  async get(id: string) {
    const token = await getToken()
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.SEO_GET(id)}`,
      {
        headers: getAuthHeader(token),
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch SEO page: ${response.statusText}`)
    }

    return response.json()
  },

  // Update SEO page
  async update(id: string, data: any) {
    const token = await getToken()
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.SEO_UPDATE(id)}`,
      {
        method: 'POST',
        headers: getAuthHeader(token),
        body: JSON.stringify(data),
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to update SEO page: ${response.statusText}`)
    }

    return response.json()
  },

  // Delete SEO page
  async delete(id: string) {
    const token = await getToken()
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.SEO_DELETE(id)}`,
      {
        method: 'DELETE',
        headers: getAuthHeader(token),
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to delete SEO page: ${response.statusText}`)
    }

    return response.json()
  },
}
