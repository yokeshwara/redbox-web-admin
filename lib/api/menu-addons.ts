import { API_BASE_URL, API_ENDPOINTS } from './config'
import { getToken } from '../auth'

export const menuAddonsAPI = {
  listAddons: async (page = 1, pageSize = 10, search = '', category = '') => {
    const token = getToken()
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
      ...(search && { search }),
      ...(category && { category }),
    })

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.MENU_ADDONS_LIST}?${params}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch menu addons: ${response.statusText}`)
    }

    return response.json()
  },

  getAddon: async (id: string) => {
    const token = getToken()
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.MENU_ADDONS_GET(id)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch menu addon: ${response.statusText}`)
    }

    return response.json()
  },

  createAddon: async (data: any) => {
    const token = getToken()
    const payload: any = {
      name: data.name,
      category: data.category,
      price_type: data.price_type || 'free',
    }

    // Only add price if it's a paid addon
    if (data.price_type === 'paid' && data.price) {
      payload.price = parseFloat(data.price)
    } else {
      payload.price = null
    }

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.MENU_ADDONS_CREATE}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`Failed to create menu addon: ${response.statusText}`)
    }

    return response.json()
  },

  updateAddon: async (id: string, data: any) => {
    const token = getToken()
    const payload: any = {
      name: data.name,
      category: data.category,
      price_type: data.price_type || 'free',
    }

    if (data.price_type === 'paid' && data.price) {
      payload.price = parseFloat(data.price)
    } else {
      payload.price = null
    }

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.MENU_ADDONS_UPDATE(id)}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`Failed to update menu addon: ${response.statusText}`)
    }

    return response.json()
  },

  deleteAddon: async (id: string) => {
    const token = getToken()
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.MENU_ADDONS_DELETE(id)}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to delete menu addon: ${response.statusText}`)
    }

    return response.json()
  },
}
