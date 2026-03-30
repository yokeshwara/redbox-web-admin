import { API_BASE_URL, API_ENDPOINTS, getAuthHeader } from './config'
import { getToken } from './auth'

export const rolesAPI = {
  // List all roles
  async list(page: number = 1, pageSize: number = 20) {
    const token = await getToken()
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.ROLES_LIST}?page=${page}&page_size=${pageSize}`,
      {
        headers: getAuthHeader(token),
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch roles: ${response.statusText}`)
    }

    return response.json()
  },

  // Create role
  async create(data: { name: string; description: string }) {
    const token = await getToken()
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.ROLES_CREATE}`,
      {
        method: 'POST',
        headers: getAuthHeader(token),
        body: JSON.stringify(data),
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to create role: ${response.statusText}`)
    }

    return response.json()
  },

  // Get single role
  async get(id: string) {
    const token = await getToken()
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.ROLES_GET(id)}`,
      {
        headers: getAuthHeader(token),
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch role: ${response.statusText}`)
    }

    return response.json()
  },

  // Update role
  async update(id: string, data: any) {
    const token = await getToken()
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.ROLES_UPDATE(id)}`,
      {
        method: 'PUT',
        headers: getAuthHeader(token),
        body: JSON.stringify(data),
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to update role: ${response.statusText}`)
    }

    return response.json()
  },

  // Delete role
  async delete(id: string) {
    const token = await getToken()
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.ROLES_DELETE(id)}`,
      {
        method: 'DELETE',
        headers: getAuthHeader(token),
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to delete role: ${response.statusText}`)
    }

    return response.json()
  },

  // Assign permissions to role
  async assignPermissions(roleId: string, permissionIds: string[]) {
    const token = await getToken()
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.ROLE_ASSIGN_PERMISSIONS}`,
      {
        method: 'POST',
        headers: getAuthHeader(token),
        body: JSON.stringify({
          role_id: roleId,
          permission_ids: permissionIds,
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to assign permissions: ${response.statusText}`)
    }

    return response.json()
  },
}
