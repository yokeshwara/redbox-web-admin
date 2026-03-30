import { API_BASE_URL, API_ENDPOINTS, getAuthHeader } from './config'
import { getToken } from './auth'

export const profileAPI = {
  // Get user profile
  async getProfile() {
    const token = await getToken()
    
    // Build headers - include token if available, otherwise just content-type
    const headers = token ? getAuthHeader(token) : {
      'Content-Type': 'application/json',
    }
    
    const url = `${API_BASE_URL}${API_ENDPOINTS.PROFILE_GET}`
    console.log('[v0] Profile API call to:', url)
    
    const response = await fetch(url, {
      method: 'GET',
      headers,
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch profile: ${response.statusText}`)
    }

    return response.json()
  },

  // Update user profile with file upload support
  async updateProfile(data: any) {
    const token = await getToken()
    
    if (!token) {
      throw new Error('No authentication token found. Please log in.')
    }
    
    // Create FormData for multipart/form-data
    const formData = new FormData()
    
    // Add text fields
    if (data.full_name) {
      formData.append('full_name', data.full_name)
    }
    
    // Add file if provided
    if (data.profile_image && data.profile_image instanceof File) {
      formData.append('profile_image', data.profile_image)
    }

    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.PROFILE_UPDATE}`,
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
      throw new Error(`Failed to update profile: ${response.statusText}`)
    }

    return response.json()
  },
}
