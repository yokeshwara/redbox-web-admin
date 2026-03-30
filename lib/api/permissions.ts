import { API_BASE_URL, API_ENDPOINTS, getAuthHeader } from './config'
import { getToken } from './auth'

export const permissionsAPI = {
  // List all permissions
  async list(page: number = 1, pageSize: number = 50) {
    const token = await getToken()
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.PERMISSIONS_LIST}?page=${page}&page_size=${pageSize}`,
      {
        headers: getAuthHeader(token),
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch permissions: ${response.statusText}`)
    }

    return response.json()
  },

  // Create permission
  async create(data: { module: string; action: string }) {
    const token = await getToken()
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.PERMISSIONS_CREATE}`,
      {
        method: 'POST',
        headers: getAuthHeader(token),
        body: JSON.stringify(data),
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to create permission: ${response.statusText}`)
    }

    return response.json()
  },

  // Get single permission
  async get(id: string) {
    const token = await getToken()
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.PERMISSIONS_GET(id)}`,
      {
        headers: getAuthHeader(token),
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch permission: ${response.statusText}`)
    }

    return response.json()
  },

  // Update permission
  async update(id: string, data: any) {
    const token = await getToken()
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.PERMISSIONS_UPDATE(id)}`,
      {
        method: 'PUT',
        headers: getAuthHeader(token),
        body: JSON.stringify(data),
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to update permission: ${response.statusText}`)
    }

    return response.json()
  },

  // Delete permission
  async delete(id: string) {
    const token = await getToken()
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.PERMISSIONS_DELETE(id)}`,
      {
        method: 'DELETE',
        headers: getAuthHeader(token),
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to delete permission: ${response.statusText}`)
    }

    return response.json()
  },
}
