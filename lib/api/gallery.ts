import { API_BASE_URL, API_ENDPOINTS } from './config'
import { getToken } from '@/lib/auth'

export const galleryAPI = {
  // Upload gallery image
  upload: async (branchId: string, file: File) => {
    const token = await getToken()
    if (!token) throw new Error('Authentication required')

    const formData = new FormData()
    formData.append('image', file)

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.BRANCH_GALLERY_UPLOAD(branchId)}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || `Upload failed: ${response.statusText}`)
    }

    const result = await response.json()
    return result.data || result
  },

  // List gallery images for a branch
  list: async (branchId: string, page: number = 1, pageSize: number = 50) => {
    const token = await getToken()
    if (!token) throw new Error('Authentication required')

    const endpoint = API_ENDPOINTS.BRANCH_GALLERY_LIST(branchId)
    const url = new URL(`${API_BASE_URL}${endpoint}`)
    url.searchParams.append('page', page.toString())
    url.searchParams.append('page_size', pageSize.toString())

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || `Failed to load gallery: ${response.statusText}`)
    }

    const result = await response.json()
    return result.data || result
  },

  // Delete gallery image
  delete: async (branchId: string, imageId: string) => {
    const token = await getToken()
    if (!token) throw new Error('Authentication required')

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.BRANCH_GALLERY_DELETE(branchId, imageId)}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || `Failed to delete image: ${response.statusText}`)
    }

    const data = await response.json().catch(() => ({}))
    return data
  },
}
