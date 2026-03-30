import { API_BASE_URL, API_ENDPOINTS, getAuthHeader } from './config'

export const mediaLibraryAPI = {
  listMedia: async (page: number = 1, pageSize: number = 10, search: string = '', token?: string) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
        ...(search && { search }),
      })

      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.MEDIA_LIST}?${params.toString()}`,
        {
          method: 'GET',
          headers: getAuthHeader(token || ''),
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch media: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching media library:', error)
      throw error
    }
  },

  getMedia: async (id: string, token?: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.MEDIA_GET(id)}`,
        {
          method: 'GET',
          headers: getAuthHeader(token || ''),
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch media: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching media:', error)
      throw error
    }
  },

  uploadMedia: async (name: string, file: File, token?: string) => {
    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('image', file)

      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.MEDIA_UPLOAD}`,
        {
          method: 'POST',
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
          },
          body: formData,
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to upload media: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error uploading media:', error)
      throw error
    }
  },

  updateMedia: async (id: string, name: string, file?: File, token?: string) => {
    try {
      const formData = new FormData()
      formData.append('name', name)
      if (file) {
        formData.append('image', file)
      }

      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.MEDIA_UPDATE(id)}`,
        {
          method: 'POST',
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
          },
          body: formData,
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to update media: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error updating media:', error)
      throw error
    }
  },

  deleteMedia: async (id: string, token?: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.MEDIA_DELETE(id)}`,
        {
          method: 'DELETE',
          headers: getAuthHeader(token || ''),
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to delete media: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error deleting media:', error)
      throw error
    }
  },
}
