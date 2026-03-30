import { API_BASE_URL, API_ENDPOINTS, getAuthHeader } from './config'
import { getToken } from '@/lib/auth'

const normalizeTestimonial = (item: any) => ({
  ...item,
  text: item.review || item.text || '',
  review: item.review || item.text || '',
  image: item.image_url || item.image || '',
  status: (item.status || 'pending').toLowerCase(),
})

export const testimonialsAPI = {
  // List testimonials
  list: async (page: number = 1, pageSize: number = 10) => {
    try {
      const token = getToken()
      if (!token) throw new Error('No authentication token')

      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
      })

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.TESTIMONIALS_LIST}?${params}`, {
        method: 'GET',
        headers: getAuthHeader(token),
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch testimonials: ${response.statusText}`)
      }

      const result = await response.json()
      const data = result.data || result
      return Array.isArray(data) ? data.map(normalizeTestimonial) : data
    } catch (error) {
      console.error('Error listing testimonials:', error)
      throw error
    }
  },

  // Get single testimonial
  get: async (id: string) => {
    try {
      const token = getToken()
      if (!token) throw new Error('No authentication token')

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.TESTIMONIALS_GET(id)}`, {
        method: 'GET',
        headers: getAuthHeader(token),
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch testimonial: ${response.statusText}`)
      }

      const result = await response.json()
      return normalizeTestimonial(result.data || result)
    } catch (error) {
      console.error('Error getting testimonial:', error)
      throw error
    }
  },

  create: async (data: any) => {
    const token = getToken()
    if (!token) throw new Error('No authentication token')

    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('email', data.email || '')
    formData.append('rating', String(data.rating))
    formData.append('review', data.review || data.text || '')
    formData.append('status', (data.status || 'pending').toLowerCase())
    formData.append('display_on_homepage', String(data.display_on_homepage ?? true))

    if (data.image instanceof File) {
      formData.append('image', data.image)
    }

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.TESTIMONIALS_CREATE}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Failed to create testimonial: ${response.statusText}`)
    }

    const result = await response.json()
    return normalizeTestimonial(result.data || result)
  },

  update: async (id: string, data: any) => {
    const token = getToken()
    if (!token) throw new Error('No authentication token')

    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('email', data.email || '')
    formData.append('rating', String(data.rating))
    formData.append('review', data.review || data.text || '')
    formData.append('status', (data.status || 'pending').toLowerCase())
    formData.append('display_on_homepage', String(data.display_on_homepage ?? true))

    if (data.image instanceof File) {
      formData.append('image', data.image)
    }

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.TESTIMONIALS_UPDATE(id)}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Failed to update testimonial: ${response.statusText}`)
    }

    const result = await response.json()
    return normalizeTestimonial(result.data || result)
  },

  // Approve testimonial
  approve: async (id: string, approved: boolean) => {
    try {
      const token = getToken()
      if (!token) throw new Error('No authentication token')

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.TESTIMONIALS_APPROVE(id)}`, {
        method: 'PATCH',
        headers: getAuthHeader(token),
        body: JSON.stringify({ status: approved ? 'approved' : 'rejected' }),
      })

      if (!response.ok) {
        throw new Error(`Failed to approve/reject testimonial: ${response.statusText}`)
      }

      const result = await response.json()
      return normalizeTestimonial(result.data || result)
    } catch (error) {
      console.error('Error approving testimonial:', error)
      throw error
    }
  },

  // Delete testimonial
  delete: async (id: string) => {
    try {
      const token = getToken()
      if (!token) throw new Error('No authentication token')

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.TESTIMONIALS_DELETE(id)}`, {
        method: 'DELETE',
        headers: getAuthHeader(token),
      })

      if (!response.ok) {
        throw new Error(`Failed to delete testimonial: ${response.statusText}`)
      }

      const result = await response.json()
      return result.data || result
    } catch (error) {
      console.error('Error deleting testimonial:', error)
      throw error
    }
  },
}
