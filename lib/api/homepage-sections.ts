import { API_BASE_URL, API_ENDPOINTS, getAuthHeader } from './config'
import { getToken } from './auth'

export interface HomepageSection {
  id: string
  title: string
  type: 'hero' | 'featured' | 'testimonials' | 'menu' | 'offers' | 'cta' | 'faq' | 'custom'
  order: number
  isVisible: boolean
  content: string
  createdAt: string
}

interface ListResponse {
  data: HomepageSection[]
  total: number
  page: number
  page_size: number
}

// ✅ Get Headers With Token
const getHeaders = async () => {

  const token = await getToken()

  if (!token) {
    return {
      'Content-Type': 'application/json'
    }
  }

  return getAuthHeader(token)
}

export const homepageSectionsAPI = {

  // LIST SECTIONS
  async listSections(
    type?: string,
    isVisible?: boolean,
    page: number = 1,
    pageSize: number = 10
  ): Promise<ListResponse> {

    const params = new URLSearchParams()

    if (type) params.append('type', type)
    if (isVisible !== undefined) params.append('is_visible', String(isVisible))

    params.append('page', String(page))
    params.append('page_size', String(pageSize))

    const url = `${API_BASE_URL}${API_ENDPOINTS.HOMEPAGE_SECTIONS_LIST}?${params.toString()}`

    console.log('[Homepage Sections] API:', url)

    const headers = await getHeaders()

    const response = await fetch(url, {
      method: 'GET',
      headers,
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch sections: ${response.status}`)
    }

    return response.json()
  },



  // CREATE SECTION
  async createSection(data: any): Promise<HomepageSection> {

    
    const payload = {
      title: data.title,
      section_type: data.type,      // ✅ FIXED
      description: data.content,    // ✅ FIXED
      order: data.order,
      is_visible: data.isVisible ?? true
    }


   
    const headers = await getHeaders()

    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.HOMEPAGE_SECTIONS_CREATE}`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to create section: ${response.status}`)
    }

    return response.json()
  },


  // GET SINGLE SECTION
async getSection(id: string): Promise<any> {

  const headers = await getHeaders()

  const url = `${API_BASE_URL}/api/cms/sections?id=${id}`

  const response = await fetch(url, {
    method: 'GET',
    headers
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch section: ${response.status}`)
  }

  return response.json()
},

  // UPDATE SECTION
  async updateSection(id: string, data: any): Promise<HomepageSection> {

    const payload = {
      title: data.title,
      section_type: data.type,      // ✅ FIXED
      description: data.content,    // ✅ FIXED
      order: data.order,
      is_visible: data.isVisible ?? true
    }


    const headers = await getHeaders()

    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.HOMEPAGE_SECTIONS_UPDATE(id)}`,
      {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload),
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to update section: ${response.status}`)
    }

    return response.json()
  },

  // DELETE SECTION
  async deleteSection(id: string): Promise<void> {

    const headers = await getHeaders()

    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.HOMEPAGE_SECTIONS_DELETE(id)}`,
      {
        method: 'POST',
        headers,
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to delete section: ${response.status}`)
    }
  },

  // REORDER SECTIONS
  async reorderSections({ ids }: { ids: string[] }): Promise<HomepageSection[]> {

    const headers = await getHeaders()

    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.HOMEPAGE_SECTIONS_REORDER}`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ids: ids
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to reorder sections: ${response.status}`)
    }

    return response.json()
  },

  // TOGGLE VISIBILITY
  async toggleVisibility(id: string, isVisible: boolean): Promise<HomepageSection> {

    const headers = await getHeaders()

    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.HOMEPAGE_SECTIONS_TOGGLE(id)}`,
      {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          is_visible: isVisible
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to toggle visibility: ${response.status}`)
    }

    return response.json()
  },

}