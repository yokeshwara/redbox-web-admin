'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { DataTable } from '@/components/admin/data-table'
import { Pagination } from '@/components/admin/pagination'
import { Plus, Search } from 'lucide-react'
import { CRUDModal } from '@/components/admin/crud-modal'

export default function BlogTagsPage() {
  const [tags, setTags] = useState<any[]>([])
  const [filteredTags, setFilteredTags] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingTag, setEditingTag] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [formData, setFormData] = useState({ name: '', slug: '' })

  const itemsPerPage = 10

  useEffect(() => {
    const mockTags = [
      { id: 1, name: 'Cooking', slug: 'cooking', postCount: 12 },
      { id: 2, name: 'Healthy Eating', slug: 'healthy-eating', postCount: 8 },
      { id: 3, name: 'Indian Cuisine', slug: 'indian-cuisine', postCount: 15 },
      { id: 4, name: 'Tips', slug: 'tips', postCount: 10 },
      { id: 5, name: 'Restaurant', slug: 'restaurant', postCount: 6 },
    ]
    setTags(mockTags)
    setFilteredTags(mockTags)
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
    setFormData({ name: '', slug: '' })
    setShowModal(true)
  }

  const handleEdit = (tag: any) => {
    setEditingTag(tag)
    setFormData({ name: tag.name, slug: tag.slug })
    setShowModal(true)
  }

  const handleDelete = (tag: any) => {
    if (confirm(`Delete tag "${tag.name}"?`)) {
      setTags(tags.filter((t) => t.id !== tag.id))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    const slug = formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-')

    if (editingTag) {
      setTags(
        tags.map((t) =>
          t.id === editingTag.id
            ? { ...t, name: formData.name, slug }
            : t
        )
      )
    } else {
      const newTag = {
        id: Math.max(...tags.map((t) => t.id), 0) + 1,
        name: formData.name,
        slug,
        postCount: 0,
      }
      setTags([...tags, newTag])
    }
    setShowModal(false)
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
            <h1 className="text-3xl font-bold text-gray-900">Blog Tags</h1>
            <p className="text-sm text-gray-600 mt-1">Manage blog post tags</p>
          </div>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all font-semibold"
          >
            <Plus size={20} />
            Add Tag
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-2 bg-white border-2 border-primary/30 rounded-lg px-4 py-2 hover:border-primary transition-all">
          <Search size={18} className="text-primary" />
          <input
            type="text"
            placeholder="Search tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 outline-none text-gray-900 bg-transparent"
          />
        </div>

        {/* Table */}
        <DataTable
          columns={[
            { header: 'Tag Name', accessor: 'name' },
            { header: 'Slug', accessor: 'slug' },
            { header: 'Posts', accessor: 'postCount' },
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
      </div>

      {/* Modal */}
      <CRUDModal
        isOpen={showModal}
        title="Blog Tag"
        isEditing={!!editingTag}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Tag Name *</label>
            <input
              type="text"
              placeholder="e.g., Cooking"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border-2 border-primary/30 rounded-lg focus:outline-none focus:border-primary text-gray-900"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">URL Slug</label>
            <input
              type="text"
              placeholder="e.g., cooking"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-3 py-2 border-2 border-primary/30 rounded-lg focus:outline-none focus:border-primary text-gray-900"
            />
            <p className="text-xs text-gray-600 mt-1">Leave empty to auto-generate from tag name</p>
          </div>
        </div>
      </CRUDModal>
    </AdminLayout>
  )
}
