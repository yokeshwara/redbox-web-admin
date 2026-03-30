import { API_BASE_URL, API_ENDPOINTS, getAuthHeader } from './config'

export const blogTagsAPI = {
  listTags: async (page: number = 1, pageSize: number = 10, search: string = '', token?: string) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
        ...(search && { search }),
      })

      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.BLOG_TAGS_LIST}?${params.toString()}`,
        {
          method: 'GET',
          headers: getAuthHeader(token || ''),
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch tags: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching blog tags:', error)
      throw error
    }
  },

  getTag: async (id: string, token?: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.BLOG_TAGS_GET(id)}`,
        {
          method: 'GET',
          headers: getAuthHeader(token || ''),
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch tag: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching blog tag:', error)
      throw error
    }
  },

  createTag: async (data: {
    name: string
    blogs?: string[]
  }, token?: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.BLOG_TAGS_CREATE}`,
        {
          method: 'POST',
          headers: getAuthHeader(token || ''),
          body: JSON.stringify(data),
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to create tag: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error creating blog tag:', error)
      throw error
    }
  },

  updateTag: async (id: string, data: {
    name?: string
    blogs?: string[]
  }, token?: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.BLOG_TAGS_UPDATE(id)}`,
        {
          method: 'PUT',
          headers: getAuthHeader(token || ''),
          body: JSON.stringify(data),
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to update tag: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error updating blog tag:', error)
      throw error
    }
  },

  deleteTag: async (id: string, token?: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.BLOG_TAGS_DELETE(id)}`,
        {
          method: 'DELETE',
          headers: getAuthHeader(token || ''),
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to delete tag: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error deleting blog tag:', error)
      throw error
    }
  },
}
