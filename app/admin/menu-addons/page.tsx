'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { DataTable } from '@/components/admin/data-table'
import { Pagination } from '@/components/admin/pagination'
import { Plus, Search, AlertCircle } from 'lucide-react'
import { MenuAddonsFormModal } from '@/components/admin/menu-addons-form-modal'
import { MenuAddonCategoryFormModal } from '@/components/admin/menu-addon-category-form-modal'
import { menuAddonsAPI } from '@/lib/api/menu-addons'
import { menuAddonCategoriesAPI } from '@/lib/api/menu-addon-categories'

export default function MenuAddonsPage() {
  const [addons, setAddons] = useState<any[]>([])
  const [filteredAddons, setFilteredAddons] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddonModal, setShowAddonModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [editingAddon, setEditingAddon] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const itemsPerPage = 10

  // Load addons from API
  const loadAddons = async (page: number = 1, search: string = '') => {
    try {
      setLoading(true)
      setError('')
      const response = await menuAddonsAPI.listAddons(page, itemsPerPage, search)

      let addonsList = response
      if (response.results) {
        addonsList = response.results
      } else if (response.data) {
        addonsList = response.data
      } else if (Array.isArray(response)) {
        addonsList = response
      }

      const processedAddons = (Array.isArray(addonsList) ? addonsList : []).map((addon: any) => ({
        id: addon.id,
        name: addon.name || '',
        category: addon.category || '',
        categoryName: addon.categoryName || '',
        price_type: addon.price_type || 'free',
        price: addon.price || 0,
      }))

      setAddons(processedAddons)
      setFilteredAddons(processedAddons)
    } catch (err: any) {
      console.error('Error loading addons:', err)
      setError('Failed to load menu add-ons')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAddons(1, '')
  }, [])

  useEffect(() => {
    const filtered = addons.filter((addon) =>
      addon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      addon.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredAddons(filtered)
    setCurrentPage(1)
  }, [searchTerm, addons])

  const handleAddAddon = () => {
    setEditingAddon(null)
    setShowAddonModal(true)
  }

  const handleEditAddon = async (addon: any) => {
    try {
      setLoading(true)
      const details = await menuAddonsAPI.getAddon(addon.id)
      setEditingAddon(details)
      setShowAddonModal(true)
    } catch (err) {
      console.error('Error fetching addon details:', err)
      setError('Failed to load add-on details')
      setEditingAddon(addon)
      setShowAddonModal(true)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAddon = async (addon: any) => {
    if (confirm(`Delete add-on "${addon.name}"?`)) {
      try {
        setLoading(true)
        await menuAddonsAPI.deleteAddon(addon.id)
        setAddons(addons.filter((a) => a.id !== addon.id))
      } catch (err: any) {
        console.error('Error deleting addon:', err)
        setError('Failed to delete add-on')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleSubmitAddon = async (data: any) => {
    try {
      if (editingAddon) {
        await menuAddonsAPI.updateAddon(editingAddon.id, data)
      } else {
        await menuAddonsAPI.createAddon(data)
      }

      await loadAddons(1, '')
      setShowAddonModal(false)
      setEditingAddon(null)
    } catch (err: any) {
      console.error('Error saving addon:', err)
      throw err
    }
  }

  const handleSubmitCategory = async (data: any) => {
    try {
      await menuAddonCategoriesAPI.createCategory(data)
      setShowCategoryModal(false)
    } catch (err: any) {
      console.error('Error saving category:', err)
      throw err
    }
  }

  const paginatedAddons = filteredAddons.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  const totalPages = Math.ceil(filteredAddons.length / itemsPerPage)

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Menu Add-ons</h1>
            <p className="text-sm text-gray-600 mt-1">Manage extra options for menu items (paid or free)</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowCategoryModal(true)}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:shadow-lg transition-all font-semibold disabled:opacity-50"
            >
              <Plus size={20} />
              Add Category
            </button>
            <button
              onClick={handleAddAddon}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all font-semibold disabled:opacity-50"
            >
              <Plus size={20} />
              Add Add-on
            </button>
          </div>
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
            placeholder="Search add-ons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 outline-none text-gray-900 bg-transparent"
            disabled={loading}
          />
        </div>

        {/* Loading State */}
        {loading && addons.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <div className="inline-block">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            </div>
            <p className="mt-4 text-gray-600">Loading add-ons...</p>
          </div>
        ) : filteredAddons.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-gray-600">
              {searchTerm ? 'No add-ons found matching your search' : 'No menu add-ons added yet'}
            </p>
          </div>
        ) : (
          <>
            {/* Table */}
            <DataTable
              columns={[
                {
                  header: 'Add-on Name',
                  accessor: 'name',
                  render: (val) => <p className="font-semibold text-gray-900">{val}</p>,
                },
                {
                  header: 'Category',
                  accessor: 'categoryName',
                  render: (val) => (
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm font-semibold">
                      {val || '-'}
                    </span>
                  ),
                },
                {
                  header: 'Price Type',
                  accessor: 'price_type',
                  render: (val) => (
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        val === 'free'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {val === 'free' ? 'Free' : 'Paid'}
                    </span>
                  ),
                },
                {
                  header: 'Price',
                  accessor: 'price',
                  render: (val, row) =>
                    row.price_type === 'free' ? (
                      <span className="text-gray-500">No charge</span>
                    ) : (
                      <p className="font-bold text-gray-900">₹{val}</p>
                    ),
                },
              ]}
              data={paginatedAddons}
              onEdit={handleEditAddon}
              onDelete={handleDeleteAddon}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={filteredAddons.length}
                itemsPerPage={itemsPerPage}
              />
            )}
          </>
        )}
      </div>

      {/* Add-on Form Modal */}
      {showAddonModal && (
        <MenuAddonsFormModal
          addon={editingAddon}
          onSubmit={handleSubmitAddon}
          onClose={() => {
            setShowAddonModal(false)
            setEditingAddon(null)
          }}
          onOpenCategoryModal={() => {
            setShowCategoryModal(true)
          }}
        />
      )}

      {/* Category Form Modal */}
      {showCategoryModal && (
        <MenuAddonCategoryFormModal
          onSubmit={handleSubmitCategory}
          onClose={() => setShowCategoryModal(false)}
        />
      )}
    </AdminLayout>
  )
}
