import { API_BASE_URL, API_ENDPOINTS, getAuthHeader } from './config'
import { getToken } from '@/lib/auth'

export const eventsAPI = {
  // List all events
  listEvents: async (page: number = 1, pageSize: number = 10) => {
    try {
      const token = getToken()
      if (!token) throw new Error('No authentication token')

      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
      })

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.EVENTS_LIST}?${params}`, {
        method: 'GET',
        headers: getAuthHeader(token),
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.statusText}`)
      }

      const result = await response.json()
      return result.data || result
    } catch (error) {
      console.error('Error listing events:', error)
      throw error
    }
  },

  // Create event
  createEvent: async (eventData: any) => {
    try {
      const token = getToken()
      if (!token) throw new Error('No authentication token')

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.EVENTS_CREATE}`, {
        method: 'POST',
        headers: getAuthHeader(token),
        body: JSON.stringify(eventData),
      })

      if (!response.ok) {
        throw new Error(`Failed to create event: ${response.statusText}`)
      }

      const result = await response.json()
      return result.data || result
    } catch (error) {
      console.error('Error creating event:', error)
      throw error
    }
  },

  // Update event
  updateEvent: async (id: string, eventData: any) => {
    try {
      const token = getToken()
      if (!token) throw new Error('No authentication token')

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.EVENTS_UPDATE(id)}`, {
        method: 'PUT',
        headers: getAuthHeader(token),
        body: JSON.stringify(eventData),
      })

      if (!response.ok) {
        throw new Error(`Failed to update event: ${response.statusText}`)
      }

      const result = await response.json()
      return result.data || result
    } catch (error) {
      console.error('Error updating event:', error)
      throw error
    }
  },

  // Delete event
  deleteEvent: async (id: string) => {
    try {
      const token = getToken()
      if (!token) throw new Error('No authentication token')

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.EVENTS_DELETE(id)}`, {
        method: 'DELETE',
        headers: getAuthHeader(token),
      })

      if (!response.ok) {
        throw new Error(`Failed to delete event: ${response.statusText}`)
      }

      return { success: true }
    } catch (error) {
      console.error('Error deleting event:', error)
      throw error
    }
  },

  // List event bookings
  listEventBookings: async (page: number = 1, pageSize: number = 10) => {
    try {
      const token = getToken()
      if (!token) throw new Error('No authentication token')

      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
      })

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.EVENT_BOOKINGS_LIST}?${params}`, {
        method: 'GET',
        headers: getAuthHeader(token),
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch event bookings: ${response.statusText}`)
      }

      const result = await response.json()
      return result.data || result
    } catch (error) {
      console.error('Error listing event bookings:', error)
      throw error
    }
  },

  // Update event booking status (approve/reject)
  updateEventBookingStatus: async (id: string, status: 'confirmed' | 'rejected', rejectionReason?: string) => {
    try {
      const token = getToken()
      if (!token) throw new Error('No authentication token')

      const body: any = { status }
      if (rejectionReason) {
        body.rejection_reason = rejectionReason
      }

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.EVENT_BOOKINGS_STATUS(id)}`, {
        method: 'PATCH',
        headers: getAuthHeader(token),
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        throw new Error(`Failed to update event booking status: ${response.statusText}`)
      }

      const result = await response.json()
      return result.data || result
    } catch (error) {
      console.error('Error updating event booking status:', error)
      throw error
    }
  },

  // List reservations
  listReservations: async (page: number = 1, pageSize: number = 10) => {
    try {
      const token = getToken()
      if (!token) throw new Error('No authentication token')

      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
      })

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.RESERVATIONS_LIST}?${params}`, {
        method: 'GET',
        headers: getAuthHeader(token),
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch reservations: ${response.statusText}`)
      }

      const result = await response.json()
      return result.data || result
    } catch (error) {
      console.error('Error listing reservations:', error)
      throw error
    }
  },

  // Update reservation status (approve/reject)
  updateReservationStatus: async (id: string, status: 'approved' | 'rejected', rejectionReason?: string) => {
    try {
      const token = getToken()
      if (!token) throw new Error('No authentication token')

      const body: any = { status }
      if (rejectionReason) {
        body.rejection_reason = rejectionReason
      }

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.RESERVATIONS_STATUS(id)}`, {
        method: 'PUT',
        headers: getAuthHeader(token),
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        throw new Error(`Failed to update reservation status: ${response.statusText}`)
      }

      const result = await response.json()
      return result.data || result
    } catch (error) {
      console.error('Error updating reservation status:', error)
      throw error
    }
  },

  // List catering requests
  listCateringRequests: async (page: number = 1, pageSize: number = 10) => {
    try {
      const token = getToken()
      if (!token) throw new Error('No authentication token')

      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
      })

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CATERING_REQUESTS_LIST}?${params}`, {
        method: 'GET',
        headers: getAuthHeader(token),
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch catering requests: ${response.statusText}`)
      }

      const result = await response.json()
      return result.data || result
    } catch (error) {
      console.error('Error listing catering requests:', error)
      throw error
    }
  },

  getCateringRequest: async (id: string) => {
    try {
      const token = getToken()
      if (!token) throw new Error('No authentication token')

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CATERING_REQUESTS_GET(id)}`, {
        method: 'GET',
        headers: getAuthHeader(token),
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch catering request: ${response.statusText}`)
      }

      const result = await response.json()
      return result.data || result
    } catch (error) {
      console.error('Error fetching catering request:', error)
      throw error
    }
  },

  updateCateringRequest: async (id: string, requestData: any) => {
    try {
      const token = getToken()
      if (!token) throw new Error('No authentication token')

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CATERING_REQUESTS_UPDATE(id)}`, {
        method: 'PUT',
        headers: getAuthHeader(token),
        body: JSON.stringify(requestData),
      })

      if (!response.ok) {
        throw new Error(`Failed to update catering request: ${response.statusText}`)
      }

      const result = await response.json()
      return result.data || result
    } catch (error) {
      console.error('Error updating catering request:', error)
      throw error
    }
  },

  deleteCateringRequest: async (id: string) => {
    try {
      const token = getToken()
      if (!token) throw new Error('No authentication token')

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CATERING_REQUESTS_DELETE(id)}`, {
        method: 'DELETE',
        headers: getAuthHeader(token),
      })

      if (!response.ok) {
        throw new Error(`Failed to delete catering request: ${response.statusText}`)
      }

      return { success: true }
    } catch (error) {
      console.error('Error deleting catering request:', error)
      throw error
    }
  },

  // Update catering request status (approve/reject)
  updateCateringRequestStatus: async (id: string, status: 'approved' | 'rejected', rejectionReason?: string) => {
    try {
      const token = getToken()
      if (!token) throw new Error('No authentication token')

      const body: any = { status }
      if (rejectionReason) {
        body.rejection_reason = rejectionReason
      }

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CATERING_REQUESTS_STATUS(id)}`, {
        method: 'PATCH',
        headers: getAuthHeader(token),
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        throw new Error(`Failed to update catering request status: ${response.statusText}`)
      }

      const result = await response.json()
      return result.data || result
    } catch (error) {
      console.error('Error updating catering request status:', error)
      throw error
    }
  },
}
