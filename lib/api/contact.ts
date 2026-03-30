import { API_BASE_URL, API_ENDPOINTS, getAuthHeader } from './config'
import { getToken } from './auth'

export type ContactStatus = 'new' | 'in_progress' | 'resolved' | 'closed'

export interface ContactEnquiry {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  status: ContactStatus
  created_at: string
  updated_at?: string
  assigned_to?: string | null
  admin_notes?: string
}

function unwrapResult(result: any) {
  return result?.data ?? result
}

export const contactAPI = {
  async listEnquiries(page: number = 1, pageSize: number = 50, search?: string, status?: ContactStatus) {
    const token = await getToken()
    if (!token) throw new Error('No authentication token')

    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    })

    if (search) params.append('search', search)
    if (status) params.append('status', status)

    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.CONTACT_ENQUIRIES_LIST}?${params.toString()}`,
      { headers: getAuthHeader(token) }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch enquiries: ${response.statusText}`)
    }

    const result = unwrapResult(await response.json())
    return result?.results ?? []
  },

  async getEnquiry(id: string) {
    const token = await getToken()
    if (!token) throw new Error('No authentication token')

    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.CONTACT_ENQUIRIES_GET(id)}`,
      { headers: getAuthHeader(token) }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch enquiry: ${response.statusText}`)
    }

    return unwrapResult(await response.json()) as ContactEnquiry
  },

  async updateEnquiry(id: string, data: Partial<ContactEnquiry>) {
    const token = await getToken()
    if (!token) throw new Error('No authentication token')

    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.CONTACT_ENQUIRIES_UPDATE(id)}`,
      {
        method: 'PUT',
        headers: getAuthHeader(token),
        body: JSON.stringify(data),
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to update enquiry: ${response.statusText}`)
    }

    return unwrapResult(await response.json()) as ContactEnquiry
  },

  async deleteEnquiry(id: string) {
    const token = await getToken()
    if (!token) throw new Error('No authentication token')

    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.CONTACT_ENQUIRIES_DELETE(id)}`,
      {
        method: 'DELETE',
        headers: getAuthHeader(token),
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to delete enquiry: ${response.statusText}`)
    }

    return unwrapResult(await response.json())
  },

  async assignEnquiry(id: string, assignedTo: string | null) {
    const token = await getToken()
    if (!token) throw new Error('No authentication token')

    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.CONTACT_ENQUIRIES_ASSIGN(id)}`,
      {
        method: 'PUT',
        headers: getAuthHeader(token),
        body: JSON.stringify({ assigned_to: assignedTo }),
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to assign enquiry: ${response.statusText}`)
    }

    return unwrapResult(await response.json()) as ContactEnquiry
  },

  async updateNotes(id: string, adminNotes: string) {
    const token = await getToken()
    if (!token) throw new Error('No authentication token')

    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.CONTACT_ENQUIRIES_NOTES(id)}`,
      {
        method: 'PUT',
        headers: getAuthHeader(token),
        body: JSON.stringify({ admin_notes: adminNotes }),
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to update notes: ${response.statusText}`)
    }

    return unwrapResult(await response.json()) as ContactEnquiry
  },
}
