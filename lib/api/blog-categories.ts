import { API_BASE_URL, API_ENDPOINTS, getAuthHeader } from './config'

export const blogCategoriesAPI = {
  listCategories: async (page: number = 1, pageSize: number = 10, search: string = '', token?: string) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
        ...(search && { search }),
      })

      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.BLOG_CATEGORIES_LIST}?${params.toString()}`,
        {
          method: 'GET',
          headers: getAuthHeader(token || ''),
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching blog categories:', error)
      throw error
    }
  },

  getCategory: async (id: string, token?: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.BLOG_CATEGORIES_GET(id)}`,
        {
          method: 'GET',
          headers: getAuthHeader(token || ''),
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch category: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching blog category:', error)
      throw error
    }
  },

  createCategory: async (data: {
    name: string
    description?: string
  }, token?: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.BLOG_CATEGORIES_CREATE}`,
        {
          method: 'POST',
          headers: getAuthHeader(token || ''),
          body: JSON.stringify(data),
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to create category: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error creating blog category:', error)
      throw error
    }
  },

  updateCategory: async (id: string, data: {
    name?: string
    description?: string
  }, token?: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.BLOG_CATEGORIES_UPDATE(id)}`,
        {
          method: 'PUT',
          headers: getAuthHeader(token || ''),
          body: JSON.stringify(data),
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to update category: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error updating blog category:', error)
      throw error
    }
  },

  deleteCategory: async (id: string, token?: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.BLOG_CATEGORIES_DELETE(id)}`,
        {
          method: 'DELETE',
          headers: getAuthHeader(token || ''),
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to delete category: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error deleting blog category:', error)
      throw error
    }
  },
}
