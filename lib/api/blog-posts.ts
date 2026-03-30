import { API_BASE_URL, API_ENDPOINTS, getAuthHeader } from './config'
import { getToken } from './auth'

export const blogPostsAPI = {
  listPosts: async (page: number = 1, pageSize: number = 10, search: string = '') => {
    try {
      const token = await getToken()
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
        ...(search && { search }),
      })

      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.BLOG_POSTS_LIST}?${params.toString()}`,
        {
          method: 'GET',
          headers: getAuthHeader(token || ''),
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching blog posts:', error)
      throw error
    }
  },

  getPost: async (id: string) => {
    try {
      const token = await getToken()
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.BLOG_POSTS_GET(id)}`,
        {
          method: 'GET',
          headers: getAuthHeader(token || ''),
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch post: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching blog post:', error)
      throw error
    }
  },

  createPost: async (data: {
    title: string
    category?: string
    content?: string
    featured_image?: string
    status?: string
    tags?: string[]
  }) => {
    try {
      const token = await getToken()
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.BLOG_POSTS_CREATE}`,
        {
          method: 'POST',
          headers: getAuthHeader(token || ''),
          body: JSON.stringify(data),
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to create post: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error creating blog post:', error)
      throw error
    }
  },

  updatePost: async (id: string, data: {
    title?: string
    category?: string
    content?: string
    featured_image?: string
    status?: string
    tags?: string[]
  }) => {
    try {
      const token = await getToken()
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.BLOG_POSTS_UPDATE(id)}`,
        {
          method: 'PUT',
          headers: getAuthHeader(token || ''),
          body: JSON.stringify(data),
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to update post: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error updating blog post:', error)
      throw error
    }
  },

  deletePost: async (id: string) => {
    try {
      const token = await getToken()
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.BLOG_POSTS_DELETE(id)}`,
        {
          method: 'DELETE',
          headers: getAuthHeader(token || ''),
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to delete post: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error deleting blog post:', error)
      throw error
    }
  },
}
