'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { DataTable } from '@/components/admin/data-table'
import { Pagination } from '@/components/admin/pagination'
import { Plus, Search, AlertCircle } from 'lucide-react'
import { DeliveryPlatformFormModal } from '@/components/admin/delivery-platform-form-modal'
import { deliveryPlatformsAPI } from '@/lib/api/delivery-platforms'

export default function DeliveryPlatformsPage() {
  const [platforms, setPlatforms] = useState<any[]>([])
  const [filteredPlatforms, setFilteredPlatforms] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingPlatform, setEditingPlatform] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const itemsPerPage = 10

  // Load delivery platforms from API
  const loadPlatforms = async (page: number = 1, search: string = '') => {
    try {
      setLoading(true)
      setError('')
      const response = await deliveryPlatformsAPI.listPlatforms(page, itemsPerPage, search)

      // Handle different response formats
      let platformsList = response
      if (response.results) {
        platformsList = response.results
      } else if (response.data) {
        platformsList = response.data
      } else if (Array.isArray(response)) {
        platformsList = response
      }

      const processedPlatforms = (Array.isArray(platformsList) ? platformsList : []).map((plat: any) => ({
        id: plat.id,
        name: plat.name || '',
        url: plat.url || '',
        commission: plat.commission || 0,
        status: plat.status || 'active',
        icon: plat.icon || '',
        branches: Array.isArray(plat.branches) ? plat.branches.length : 0,
        branchList: plat.branches || [],
      }))

      setPlatforms(processedPlatforms)
      setFilteredPlatforms(processedPlatforms)
    } catch (err: any) {
      console.error('Error loading delivery platforms:', err)
      setError('Failed to load delivery platforms')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPlatforms(1, '')
  }, [])

  useEffect(() => {
    const filtered = platforms.filter((plat) =>
      plat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plat.url.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredPlatforms(filtered)
    setCurrentPage(1)
  }, [searchTerm, platforms])

  const handleAddNew = () => {
    setEditingPlatform(null)
    setShowModal(true)
  }

  const handleEdit = async (platform: any) => {
    try {
      setLoading(true)
      // Fetch full platform details
      const details = await deliveryPlatformsAPI.getPlatform(platform.id)
      setEditingPlatform(details)
      setShowModal(true)
    } catch (err) {
      console.error('Error fetching platform details:', err)
      setError('Failed to load platform details')
      // Fallback to showing the platform we have
      setEditingPlatform(platform)
      setShowModal(true)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (platform: any) => {
    if (confirm(`Delete platform "${platform.name}"?`)) {
      try {
        setLoading(true)
        await deliveryPlatformsAPI.deletePlatform(platform.id)
        setPlatforms(platforms.filter((p) => p.id !== platform.id))
      } catch (err: any) {
        console.error('Error deleting platform:', err)
        setError('Failed to delete delivery platform')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleSubmit = async (data: any) => {
    try {
      if (editingPlatform) {
        // Update existing platform
        await deliveryPlatformsAPI.updatePlatform(editingPlatform.id, data)
      } else {
        // Create new platform
        await deliveryPlatformsAPI.createPlatform(data)
      }

      // Reload platforms list
      await loadPlatforms(1, '')
      setShowModal(false)
      setEditingPlatform(null)
    } catch (err: any) {
      console.error('Error saving platform:', err)
      throw err
    }
  }

  const paginatedPlatforms = filteredPlatforms.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  const totalPages = Math.ceil(filteredPlatforms.length / itemsPerPage)

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Delivery Platforms</h1>
            <p className="text-sm text-gray-600 mt-1">Manage online food delivery platforms and their branch associations</p>
          </div>
          <button
            onClick={handleAddNew}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={20} />
            Add Platform
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
            placeholder="Search platforms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 outline-none text-gray-900 bg-transparent"
            disabled={loading}
          />
        </div>

        {/* Loading State */}
        {loading && platforms.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <div className="inline-block">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            </div>
            <p className="mt-4 text-gray-600">Loading delivery platforms...</p>
          </div>
        ) : filteredPlatforms.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-gray-600">
              {searchTerm ? 'No platforms found matching your search' : 'No delivery platforms added yet'}
            </p>
          </div>
        ) : (
          <>
            {/* Table */}
            <DataTable
              columns={[
                {
                  header: 'Platform Name',
                  accessor: 'name',
                  render: (val, item) => (
                    <div className="flex items-center gap-3">
                      {item.icon && (
                        <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                          <img src={item.icon} alt="icon" className="w-6 h-6 object-contain" />
                        </div>
                      )}
                      <span className="font-semibold">{val}</span>
                    </div>
                  ),
                },
                {
                  header: 'Commission',
                  accessor: 'commission',
                  render: (val) => (
                    <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-sm font-semibold rounded">
                      {val}%
                    </span>
                  ),
                },
                {
                  header: 'URL',
                  accessor: 'url',
                  render: (val) => (
                    <a
                      href={val}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline truncate block text-sm"
                    >
                      {val}
                    </a>
                  ),
                },
                {
                  header: 'Branches',
                  accessor: 'branches',
                  render: (val) => (
                    <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-sm font-semibold rounded">
                      {val}
                    </span>
                  ),
                },
                {
                  header: 'Status',
                  accessor: 'status',
                  render: (val) => (
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        val === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {val === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  ),
                },
              ]}
              data={paginatedPlatforms}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={filteredPlatforms.length}
                itemsPerPage={itemsPerPage}
              />
            )}
          </>
        )}
      </div>

      {/* Form Modal */}
      {showModal && (
        <DeliveryPlatformFormModal
          platform={editingPlatform}
          onSubmit={handleSubmit}
          onClose={() => {
            setShowModal(false)
            setEditingPlatform(null)
          }}
        />
      )}
    </AdminLayout>
  )
}
