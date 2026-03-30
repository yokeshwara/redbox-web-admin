import { API_BASE_URL, API_ENDPOINTS, getAuthHeader } from './config'
import { getToken } from './auth'

export const settingsAPI = {
  // Website Settings
  async list() {
    const token = await getToken()
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.WEBSITE_SETTINGS_LIST}`,
      {
        headers: getAuthHeader(token),
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch website settings: ${response.statusText}`)
    }

    return response.json()
  },

  async update(data: any) {
    const token = await getToken()
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.WEBSITE_SETTINGS_UPDATE}`,
      {
        method: 'PUT',
        headers: getAuthHeader(token),
        body: JSON.stringify(data),
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to update website settings: ${response.statusText}`)
    }

    return response.json()
  },

  // Update logo with file upload
  async updateLogo(data: any) {
    const token = await getToken()
    
    // Create FormData for multipart/form-data
    const formData = new FormData()
    
    // Add logo file if provided
    if (data.logo && data.logo instanceof File) {
      formData.append('logo', data.logo)
    }
    
    // Add text fields
    if (data.title) {
      formData.append('title', data.title)
    }
    
    if (data.subtitle) {
      formData.append('subtitle', data.subtitle)
    }

    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.LOGO_UPDATE}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type for FormData - browser will set it with boundary
        },
        body: formData,
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to update logo: ${response.statusText}`)
    }

    return response.json()
  },
}
