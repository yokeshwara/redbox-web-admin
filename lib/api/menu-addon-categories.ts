import { API_BASE_URL, API_ENDPOINTS } from './config'
import { getToken } from '../auth'

export const menuAddonCategoriesAPI = {
  listCategories: async (page = 1, pageSize = 10, search = '') => {
    const token = getToken()
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
      ...(search && { search }),
    })

    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.MENU_ADDON_CATEGORIES_LIST}?${params}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch addon categories: ${response.statusText}`)
    }

    return response.json()
  },

  getCategory: async (id: string) => {
    const token = getToken()
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.MENU_ADDON_CATEGORIES_GET(id)}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch addon category: ${response.statusText}`)
    }

    return response.json()
  },

  createCategory: async (data: any) => {
    const token = getToken()
    const payload = {
      name: data.name,
    }

    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.MENU_ADDON_CATEGORIES_CREATE}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to create addon category: ${response.statusText}`)
    }

    return response.json()
  },

  updateCategory: async (id: string, data: any) => {
    const token = getToken()
    const payload = {
      name: data.name,
    }

    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.MENU_ADDON_CATEGORIES_UPDATE(id)}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to update addon category: ${response.statusText}`)
    }

    return response.json()
  },

  deleteCategory: async (id: string) => {
    const token = getToken()
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.MENU_ADDON_CATEGORIES_DELETE(id)}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to delete addon category: ${response.statusText}`)
    }

    return response.json()
  },
}
