import { API_BASE_URL, API_ENDPOINTS } from './config'
import { getToken } from '../auth'

export const menuCategoriesAPI = {
  listCategories: async (page = 1, pageSize = 10, search = '') => {
    const token = getToken()
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
      ...(search && { search }),
    })

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.MENU_CATEGORIES_LIST}?${params}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch menu categories: ${response.statusText}`)
    }

    return response.json()
  },

  getCategory: async (id: string) => {
    const token = getToken()
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.MENU_CATEGORIES_GET(id)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch menu category: ${response.statusText}`)
    }

    return response.json()
  },

  createCategory: async (data: any) => {
    const token = getToken()
    const formData = new FormData()

    // Add text fields
    formData.append('name', data.name)
    formData.append('description', data.description || '')
    formData.append('status', data.status !== false ? 'true' : 'false')

    // Add image if provided
    if (data.image) {
      formData.append('image', data.image)
    }

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.MENU_CATEGORIES_CREATE}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Failed to create menu category: ${response.statusText}`)
    }

    return response.json()
  },

  updateCategory: async (id: string, data: any) => {
    const token = getToken()
    const formData = new FormData()

    formData.append('name', data.name)
    formData.append('description', data.description || '')
    formData.append('status', data.status !== false ? 'true' : 'false')

    if (data.image) {
      formData.append('image', data.image)
    }

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.MENU_CATEGORIES_UPDATE(id)}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Failed to update menu category: ${response.statusText}`)
    }

    return response.json()
  },

  deleteCategory: async (id: string) => {
    const token = getToken()
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.MENU_CATEGORIES_DELETE(id)}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to delete menu category: ${response.statusText}`)
    }

    return response.json()
  },
}
