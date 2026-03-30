import { API_BASE_URL, API_ENDPOINTS } from './config'
import { getToken } from '../auth'

export const menuTagsAPI = {
  listTags: async (page = 1, pageSize = 10, search = '') => {
    const token = getToken()
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
      ...(search && { search }),
    })

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.MENU_TAGS_LIST}?${params}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch menu tags: ${response.statusText}`)
    }

    return response.json()
  },

  getTag: async (id: string) => {
    const token = getToken()
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.MENU_TAGS_GET(id)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch menu tag: ${response.statusText}`)
    }

    return response.json()
  },

  createTag: async (data: any) => {
    const token = getToken()
    const payload = {
      name: data.name,
      menu_items: Array.isArray(data.menu_items) ? data.menu_items : [],
    }

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.MENU_TAGS_CREATE}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`Failed to create menu tag: ${response.statusText}`)
    }

    return response.json()
  },

  updateTag: async (id: string, data: any) => {
    const token = getToken()
    const payload = {
      name: data.name,
      menu_items: Array.isArray(data.menu_items) ? data.menu_items : [],
    }

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.MENU_TAGS_UPDATE(id)}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`Failed to update menu tag: ${response.statusText}`)
    }

    return response.json()
  },

  deleteTag: async (id: string) => {
    const token = getToken()
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.MENU_TAGS_DELETE(id)}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to delete menu tag: ${response.statusText}`)
    }

    return response.json()
  },
}
