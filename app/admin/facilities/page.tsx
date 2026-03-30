'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { DataTable } from '@/components/admin/data-table'
import { Pagination } from '@/components/admin/pagination'
import { Plus, Search, AlertCircle } from 'lucide-react'
import { FacilitiesFormModal } from '@/components/admin/facilities-form-modal'
import { facilitiesAPI } from '@/lib/api/facilities'

const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com/dzdeqpivt/'

function resolveAssetUrl(value?: string | null) {
  if (!value) return ''
  if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:')) {
    return value
  }
  const normalized = value.startsWith('/') ? value.slice(1) : value
  return `${CLOUDINARY_BASE_URL}${normalized}`
}

export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState<any[]>([])
  const [filteredFacilities, setFilteredFacilities] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingFacility, setEditingFacility] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const itemsPerPage = 10

  // Load facilities from API
  const loadFacilities = async (page: number = 1, search: string = '') => {
    try {
      setLoading(true)
      setError('')
      const response = await facilitiesAPI.listFacilities(page, itemsPerPage, search)
      
      // Handle different response formats
      let facilitiesList = response
      if (response.results) {
        facilitiesList = response.results
      } else if (Array.isArray(response)) {
        facilitiesList = response
      }

      const processedFacilities = (Array.isArray(facilitiesList) ? facilitiesList : []).map((fac: any) => ({
        id: fac.id,
        name: fac.name || '',
        description: fac.description || '',
        icon: resolveAssetUrl(fac.icon_url || fac.icon || ''),
        branches: Array.isArray(fac.branches) ? fac.branches.length : 0,
        branchIds: fac.branches || [],
      }))

      setFacilities(processedFacilities)
      setFilteredFacilities(processedFacilities)
    } catch (err: any) {
      console.error('Error loading facilities:', err)
      setError('Failed to load facilities')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFacilities(1, '')
  }, [])

  useEffect(() => {
    const filtered = facilities.filter((fac) =>
      fac.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fac.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredFacilities(filtered)
    setCurrentPage(1)
  }, [searchTerm, facilities])

  const handleAddNew = () => {
    setEditingFacility(null)
    setShowModal(true)
  }

  const handleEdit = async (facility: any) => {
    try {
      setLoading(true)
      // Fetch full facility details including branches
      const details = await facilitiesAPI.getFacility(facility.id)
      setEditingFacility(details)
      setShowModal(true)
    } catch (err) {
      console.error('Error fetching facility details:', err)
      setError('Failed to load facility details')
      // Fallback to showing the facility we have
      setEditingFacility(facility)
      setShowModal(true)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (facility: any) => {
    if (confirm(`Delete facility "${facility.name}"?`)) {
      try {
        setLoading(true)
        await facilitiesAPI.deleteFacility(facility.id)
        setFacilities(facilities.filter((f) => f.id !== facility.id))
      } catch (err: any) {
        console.error('Error deleting facility:', err)
        setError('Failed to delete facility')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleSubmit = async (data: any) => {
    try {
      if (editingFacility) {
        // Update existing facility
        await facilitiesAPI.updateFacility(editingFacility.id, data)
      } else {
        // Create new facility
        await facilitiesAPI.createFacility(data)
      }
      
      // Reload facilities list
      await loadFacilities(1, '')
      setShowModal(false)
      setEditingFacility(null)
    } catch (err: any) {
      console.error('Error saving facility:', err)
      throw err
    }
  }

  const paginatedFacilities = filteredFacilities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  const totalPages = Math.ceil(filteredFacilities.length / itemsPerPage)

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Branch Facilities</h1>
            <p className="text-sm text-gray-600 mt-1">Manage branch amenities and facilities with multi-branch support</p>
          </div>
          <button
            onClick={handleAddNew}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={20} />
            Add Facility
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900">Error</h3>
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="flex items-center gap-2 bg-white border-2 border-primary/30 rounded-lg px-4 py-2 hover:border-primary transition-all">
          <Search size={18} className="text-primary" />
          <input
            type="text"
            placeholder="Search facilities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 outline-none text-gray-900 bg-transparent"
            disabled={loading}
          />
        </div>

        {/* Loading State */}
        {loading && facilities.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <div className="inline-block">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            </div>
            <p className="mt-4 text-gray-600">Loading facilities...</p>
          </div>
        ) : filteredFacilities.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-gray-600">
              {searchTerm ? 'No facilities found matching your search' : 'No facilities added yet'}
            </p>
          </div>
        ) : (
          <>
            {/* Table */}
            <DataTable
              columns={[
                { 
                  header: 'Icon', 
                  accessor: 'icon', 
                  render: (val) => (
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      {val ? (
                        <img src={val} alt="icon" className="w-8 h-8 object-contain" />
                      ) : (
                        <span className="text-xl">📌</span>
                      )}
                    </div>
                  ),
                  width: '70px'
                },
                { header: 'Facility Name', accessor: 'name' },
                { header: 'Description', accessor: 'description', render: (val) => <div className="text-sm text-gray-600 line-clamp-2">{val}</div> },
                { 
                  header: 'Branches', 
                  accessor: 'branches',
                  render: (val) => (
                    <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-sm font-semibold rounded">
                      {val}
                    </span>
                  )
                },
              ]}
              data={paginatedFacilities}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={filteredFacilities.length}
                itemsPerPage={itemsPerPage}
              />
            )}
          </>
        )}
      </div>

      {/* Form Modal */}
      {showModal && (
        <FacilitiesFormModal
          facility={editingFacility}
          onSubmit={handleSubmit}
          onClose={() => {
            setShowModal(false)
            setEditingFacility(null)
          }}
        />
      )}
    </AdminLayout>
  )
}
