import { API_BASE_URL, API_ENDPOINTS, getAuthHeader } from './config'
import { getToken } from './auth'

export const menuItemsAPI = {
  listItems: async (page = 1, pageSize = 10, search = '', category = '', foodType = '') => {
    const token = await getToken()
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
      ...(search && { search }),
      ...(category && { category }),
      ...(foodType && { food_type: foodType }),
    })

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.MENU_ITEMS_LIST}?${params}`, {
      method: 'GET',
      headers: getAuthHeader(token || ''),
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch menu items: ${response.statusText}`)
    }

    return response.json()
  },

  getItem: async (id: string) => {
    const token = await getToken()
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.MENU_ITEMS_GET(id)}`, {
      method: 'GET',
      headers: getAuthHeader(token || ''),
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch menu item: ${response.statusText}`)
    }

    return response.json()
  },

  createItem: async (data: any) => {
    const token = await getToken()
    const formData = new FormData()

    // Add text fields
    formData.append('name', data.name)
    formData.append('description', data.description || '')
    formData.append('category', data.category)
    formData.append('food_type', data.food_type)
    formData.append('base_price', data.base_price)
    formData.append('status', data.status || 'available')
    formData.append('is_special', data.is_special ? 'true' : 'false')
    formData.append('rating', data.rating || '0')
    formData.append('is_combo', data.is_combo ? 'true' : 'false')

    // Add tags if provided
    if (Array.isArray(data.tags) && data.tags.length > 0) {
      data.tags.forEach((tag: string, index: number) => {
        formData.append(`tags[${index}][name]`, tag)
      })
    }

    // Add addons if provided
    if (Array.isArray(data.addons) && data.addons.length > 0) {
      data.addons.forEach((addon: any, index: number) => {
        formData.append(`add_ons[${index}][name]`, addon.name)
        formData.append(`add_ons[${index}][price]`, addon.price)
      })
    }

    // Add image if provided
    if (data.image) {
      formData.append('image', data.image)
    }

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.MENU_ITEMS_CREATE}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token || ''}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to create menu item: ${errorText}`)
    }

    return response.json()
  },

  updateItem: async (id: string, data: any) => {
    const token = await getToken()
    const formData = new FormData()

    formData.append('name', data.name)
    formData.append('description', data.description || '')
    formData.append('category', data.category)
    formData.append('food_type', data.food_type)
    formData.append('base_price', data.base_price)
    formData.append('status', data.status || 'available')
    formData.append('is_special', data.is_special ? 'true' : 'false')
    formData.append('rating', data.rating || '0')
    formData.append('is_combo', data.is_combo ? 'true' : 'false')

    if (Array.isArray(data.tags) && data.tags.length > 0) {
      data.tags.forEach((tag: string, index: number) => {
        formData.append(`tags[${index}][name]`, tag)
      })
    }

    if (Array.isArray(data.addons) && data.addons.length > 0) {
      data.addons.forEach((addon: any, index: number) => {
        formData.append(`add_ons[${index}][name]`, addon.name)
        formData.append(`add_ons[${index}][price]`, addon.price)
      })
    }

    if (data.image) {
      formData.append('image', data.image)
    }

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.MENU_ITEMS_UPDATE(id)}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token || ''}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Failed to update menu item: ${response.statusText}`)
    }

    return response.json()
  },

  deleteItem: async (id: string) => {
    const token = await getToken()
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.MENU_ITEMS_DELETE(id)}`, {
      method: 'DELETE',
      headers: getAuthHeader(token || ''),
    })

    if (!response.ok) {
      throw new Error(`Failed to delete menu item: ${response.statusText}`)
    }

    return response.json()
  },
}
