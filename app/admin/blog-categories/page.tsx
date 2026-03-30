'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { DataTable } from '@/components/admin/data-table'
import { Pagination } from '@/components/admin/pagination'
import { Plus, Search } from 'lucide-react'
import { CRUDModal } from '@/components/admin/crud-modal'

export default function BlogCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [filteredCategories, setFilteredCategories] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [formData, setFormData] = useState({ name: '', slug: '', description: '' })

  const itemsPerPage = 10

  useEffect(() => {
    const mockCategories = [
      { id: 1, name: 'Food Tips', slug: 'food-tips', description: 'Food preparation and cooking tips', postCount: 8 },
      { id: 2, name: 'Restaurant News', slug: 'restaurant-news', description: 'Latest restaurant updates and news', postCount: 5 },
      { id: 3, name: 'Recipes', slug: 'recipes', description: 'Delicious recipes and cooking guides', postCount: 12 },
      { id: 4, name: 'Nutrition', slug: 'nutrition', description: 'Nutrition and health related articles', postCount: 6 },
    ]
    setCategories(mockCategories)
    setFilteredCategories(mockCategories)
  }, [])

  useEffect(() => {
    const filtered = categories.filter((cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredCategories(filtered)
    setCurrentPage(1)
  }, [searchTerm, categories])

  const handleAddNew = () => {
    setEditingCategory(null)
    setFormData({ name: '', slug: '', description: '' })
    setShowModal(true)
  }

  const handleEdit = (category: any) => {
    setEditingCategory(category)
    setFormData({ name: category.name, slug: category.slug, description: category.description })
    setShowModal(true)
  }

  const handleDelete = (category: any) => {
    if (confirm(`Delete category "${category.name}"?`)) {
      setCategories(categories.filter((c) => c.id !== category.id))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    const slug = formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-')

    if (editingCategory) {
      setCategories(
        categories.map((c) =>
          c.id === editingCategory.id
            ? { ...c, ...formData, slug }
            : c
        )
      )
    } else {
      const newCategory = {
        id: Math.max(...categories.map((c) => c.id), 0) + 1,
        name: formData.name,
        slug,
        description: formData.description,
        postCount: 0,
      }
      setCategories([...categories, newCategory])
    }
    setShowModal(false)
  }

  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage)

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Blog Categories</h1>
            <p className="text-sm text-gray-600 mt-1">Manage blog post categories</p>
          </div>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all font-semibold"
          >
            <Plus size={20} />
            Add Category
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-2 bg-white border-2 border-primary/30 rounded-lg px-4 py-2 hover:border-primary transition-all">
          <Search size={18} className="text-primary" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 outline-none text-gray-900 bg-transparent"
          />
        </div>

        {/* Table */}
        <DataTable
          columns={[
            { header: 'Category Name', accessor: 'name' },
            { header: 'Slug', accessor: 'slug' },
            { header: 'Description', accessor: 'description' },
            { header: 'Posts', accessor: 'postCount' },
          ]}
          data={paginatedCategories}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredCategories.length}
            itemsPerPage={itemsPerPage}
          />
        )}
      </div>

      {/* Modal */}
      <CRUDModal
        isOpen={showModal}
        title="Blog Category"
        isEditing={!!editingCategory}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Category Name *</label>
            <input
              type="text"
              placeholder="e.g., Food Tips"
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
              placeholder="e.g., food-tips"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-3 py-2 border-2 border-primary/30 rounded-lg focus:outline-none focus:border-primary text-gray-900"
            />
            <p className="text-xs text-gray-600 mt-1">Leave empty to auto-generate from category name</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Description</label>
            <textarea
              placeholder="Category description..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border-2 border-primary/30 rounded-lg focus:outline-none focus:border-primary text-gray-900"
              rows={3}
            />
          </div>
        </div>
      </CRUDModal>
    </AdminLayout>
  )
}
