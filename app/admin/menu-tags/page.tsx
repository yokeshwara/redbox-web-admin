'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { DataTable } from '@/components/admin/data-table'
import { Pagination } from '@/components/admin/pagination'
import { Plus, Search, AlertCircle } from 'lucide-react'
import { MenuTagsFormModal } from '@/components/admin/menu-tags-form-modal'
import { menuTagsAPI } from '@/lib/api/menu-tags'

export default function MenuTagsPage() {
  const [tags, setTags] = useState<any[]>([])
  const [filteredTags, setFilteredTags] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingTag, setEditingTag] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const itemsPerPage = 10

  // Load tags from API
  const loadTags = async (page: number = 1, search: string = '') => {
    try {
      setLoading(true)
      setError('')
      const response = await menuTagsAPI.listTags(page, itemsPerPage, search)

      let tagsList = response
      if (response.results) {
        tagsList = response.results
      } else if (response.data) {
        tagsList = response.data
      } else if (Array.isArray(response)) {
        tagsList = response
      }

      const processedTags = (Array.isArray(tagsList) ? tagsList : []).map((tag: any) => ({
        id: tag.id,
        name: tag.name || '',
        menu_items: tag.menu_items || [],
        itemCount: Array.isArray(tag.menu_items) ? tag.menu_items.length : 0,
      }))

      setTags(processedTags)
      setFilteredTags(processedTags)
    } catch (err: any) {
      console.error('Error loading tags:', err)
      setError('Failed to load menu tags')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTags(1, '')
  }, [])

  useEffect(() => {
    const filtered = tags.filter((tag) =>
      tag.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredTags(filtered)
    setCurrentPage(1)
  }, [searchTerm, tags])

  const handleAddNew = () => {
    setEditingTag(null)
    setShowModal(true)
  }

  const handleEdit = async (tag: any) => {
    try {
      setLoading(true)
      const details = await menuTagsAPI.getTag(tag.id)
      setEditingTag(details)
      setShowModal(true)
    } catch (err) {
      console.error('Error fetching tag details:', err)
      setError('Failed to load tag details')
      setEditingTag(tag)
      setShowModal(true)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (tag: any) => {
    if (confirm(`Delete tag "${tag.name}"?`)) {
      try {
        setLoading(true)
        await menuTagsAPI.deleteTag(tag.id)
        setTags(tags.filter((t) => t.id !== tag.id))
      } catch (err: any) {
        console.error('Error deleting tag:', err)
        setError('Failed to delete tag')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleSubmit = async (data: any) => {
    try {
      if (editingTag) {
        await menuTagsAPI.updateTag(editingTag.id, data)
      } else {
        await menuTagsAPI.createTag(data)
      }

      await loadTags(1, '')
      setShowModal(false)
      setEditingTag(null)
    } catch (err: any) {
      console.error('Error saving tag:', err)
      throw err
    }
  }

  const paginatedTags = filteredTags.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  const totalPages = Math.ceil(filteredTags.length / itemsPerPage)

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Menu Tags</h1>
            <p className="text-sm text-gray-600 mt-1">Manage tags for menu items with multi-item selection</p>
          </div>
          <button
            onClick={handleAddNew}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all font-semibold disabled:opacity-50"
          >
            <Plus size={20} />
            Add Tag
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
            placeholder="Search tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 outline-none text-gray-900 bg-transparent"
            disabled={loading}
          />
        </div>

        {/* Loading State */}
        {loading && tags.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <div className="inline-block">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            </div>
            <p className="mt-4 text-gray-600">Loading menu tags...</p>
          </div>
        ) : filteredTags.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-gray-600">
              {searchTerm ? 'No tags found matching your search' : 'No menu tags added yet'}
            </p>
          </div>
        ) : (
          <>
            {/* Table */}
            <DataTable
              columns={[
                {
                  header: 'Tag Name',
                  accessor: 'name',
                  render: (val) => (
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary font-semibold rounded-full">
                      {val}
                    </span>
                  ),
                },
                {
                  header: 'Menu Items',
                  accessor: 'itemCount',
                  render: (val) => (
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded">
                      {val}
                    </span>
                  ),
                },
              ]}
              data={paginatedTags}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={filteredTags.length}
                itemsPerPage={itemsPerPage}
              />
            )}
          </>
        )}
      </div>

      {/* Form Modal */}
      {showModal && (
        <MenuTagsFormModal
          tag={editingTag}
          onSubmit={handleSubmit}
          onClose={() => {
            setShowModal(false)
            setEditingTag(null)
          }}
        />
      )}
    </AdminLayout>
  )
}
