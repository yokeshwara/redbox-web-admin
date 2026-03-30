import { API_BASE_URL, API_ENDPOINTS, getAuthHeader } from './config'
import { getToken } from './auth'

export const usersAPI = {
  // List all users
  async list(page: number = 1, pageSize: number = 20, search?: string, role?: string) {
    const token = await getToken()
    let url = `${API_BASE_URL}${API_ENDPOINTS.USERS_LIST}?page=${page}&page_size=${pageSize}`
    
    if (search) {
      url += `&search=${encodeURIComponent(search)}`
    }
    
    if (role) {
      url += `&role=${encodeURIComponent(role)}`
    }

    const response = await fetch(url, {
      headers: getAuthHeader(token),
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.statusText}`)
    }

    return response.json()
  },

  // Create user
  async create(data: {
    full_name: string
    email: string
    phone: string
    password: string
    role: string
    branch: string
  }) {
    const token = await getToken()
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.USERS_CREATE}`,
      {
        method: 'POST',
        headers: getAuthHeader(token),
        body: JSON.stringify(data),
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to create user: ${response.statusText}`)
    }

    return response.json()
  },

  // Get single user
  async get(id: string) {
    const token = await getToken()
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.USERS_GET(id)}`,
      {
        headers: getAuthHeader(token),
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.statusText}`)
    }

    return response.json()
  },

  // Update user
  async update(id: string, data: any) {
    const token = await getToken()
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.USERS_UPDATE(id)}`,
      {
        method: 'PUT',
        headers: getAuthHeader(token),
        body: JSON.stringify(data),
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to update user: ${response.statusText}`)
    }

    return response.json()
  },

  // Delete user
  async delete(id: string) {
    const token = await getToken()
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.USERS_DELETE(id)}`,
      {
        method: 'DELETE',
        headers: getAuthHeader(token),
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to delete user: ${response.statusText}`)
    }

    return response.json()
  },
}
