'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { DataTable } from '@/components/admin/data-table'
import { Pagination } from '@/components/admin/pagination'
import { Plus, Search, AlertCircle } from 'lucide-react'
import { MenuCategoryFormModal } from '@/components/admin/menu-category-form-modal'
// import { menuCategoriesAPI } from '@/lib/api/menu-categories'

export default function MenuCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [filteredCategories, setFilteredCategories] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const itemsPerPage = 10

  // Static categories for hiding API
  const staticCategories = [
    {
      id: '1',
      name: 'Noodles',
      description: 'High protein noodles',
      image: 'http://res.cloudinary.com/dzdeqpivt/image/upload/v1773154946/q5uwibvybr2t18r6t5as.png',
      status: 'inactive',
      items: 4,
    },
    {
      id: '2',
      name: 'Sandwich',
      description: 'Club sandwich',
      image: 'http://res.cloudinary.com/dzdeqpivt/image/upload/v1773154829/w8sgye4vkcpuezfzklws.png',
      status: 'inactive',
      items: 1,
    },
    {
      id: '3',
      name: 'Pizza',
      description: 'Oven Pizza',
      image: 'http://res.cloudinary.com/dzdeqpivt/image/upload/v1773154684/eu1vqpuzvq2vxqtfk62a.png',
      status: 'inactive',
      items: 1,
    },
    {
      id: '4',
      name: 'Burger',
      description: 'Home Burger',
      image: 'http://res.cloudinary.com/dzdeqpivt/image/upload/v1773153533/ggsttd51ub2lxuqwxiqb.png',
      status: 'inactive',
      items: 1,
    },
    {
      id: '5',
      name: 'Burger',
      description: 'Home Burger',
      image: '',
      status: 'active',
      items: 0,
    },
    {
      id: '6',
      name: 'Noodles',
      description: 'Tasty food',
      image: '',
      status: 'active',
      items: 9,
    },
  ]

  // Load categories
  const loadCategories = async () => {
    setLoading(true)
    setError('')
    try {
      // Uncomment to use API in future
      /*
      const response = await menuCategoriesAPI.listCategories(1, itemsPerPage, '')
      let categoriesList = []
      if (response?.data?.results) {
        categoriesList = response.data.results
      } else if (Array.isArray(response)) {
        categoriesList = response
      }
      const processedCategories = categoriesList.map((cat: any) => ({
        id: cat.id,
        name: cat.name || '',
        description: cat.description || '',
        image: cat.icon_url || cat.icon || '',
        status: cat.status ? 'active' : 'inactive',
        items: cat.items_count || 0,
      }))
      setCategories(processedCategories)
      setFilteredCategories(processedCategories)
      */

      // Using static data while API is hidden
      setCategories(staticCategories)
      setFilteredCategories(staticCategories)
    } catch (err) {
      console.error('Error loading categories:', err)
      setError('Failed to load menu categories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  // Filter categories by search
  useEffect(() => {
    const filtered = categories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredCategories(filtered)
    setCurrentPage(1)
  }, [searchTerm, categories])

  const handleAddNew = () => {
    setEditingCategory(null)
    setShowModal(true)
  }

  const handleEdit = (category: any) => {
    setEditingCategory(category)
    setShowModal(true)
  }

  const handleDelete = (category: any) => {
    if (confirm(`Delete category "${category.name}"?`)) {
      setCategories(categories.filter((c) => c.id !== category.id))
    }
  }

  const handleSubmit = (data: any) => {
    if (editingCategory) {
      setCategories(
        categories.map((cat) => (cat.id === editingCategory.id ? { ...cat, ...data } : cat))
      )
    } else {
      const newCategory = {
        id: (categories.length + 1).toString(),
        ...data,
      }
      setCategories([...categories, newCategory])
    }
    setShowModal(false)
    setEditingCategory(null)
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
            <h1 className="text-3xl font-bold text-gray-900">Menu Categories</h1>
            <p className="text-sm text-gray-600 mt-1">Organize menu items into categories</p>
          </div>
          <button
            onClick={handleAddNew}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all font-semibold disabled:opacity-50"
          >
            <Plus size={20} />
            Add Category
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
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 outline-none text-gray-900 bg-transparent"
            disabled={loading}
          />
        </div>

        {/* Loading / Empty States */}
        {loading && categories.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <div className="inline-block">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            </div>
            <p className="mt-4 text-gray-600">Loading menu categories...</p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-gray-600">
              {searchTerm ? 'No categories found matching your search' : 'No menu categories added yet'}
            </p>
          </div>
        ) : (
          <>
            {/* Table */}
            <DataTable
              columns={[
                {
                  header: 'Image',
                  accessor: 'image',
                  render: (val) => (
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      {val ? (
                        <img src={val} alt="category" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-lg">📁</span>
                      )}
                    </div>
                  ),
                  width: '70px',
                },
                { header: 'Category Name', accessor: 'name' },
                {
                  header: 'Description',
                  accessor: 'description',
                  render: (val) => <div className="text-sm text-gray-600 line-clamp-2">{val || '-'}</div>,
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
          </>
        )}
      </div>

      {/* Form Modal */}
      {showModal && (
        <MenuCategoryFormModal
          category={editingCategory}
          onSubmit={handleSubmit}
          onClose={() => {
            setShowModal(false)
            setEditingCategory(null)
          }}
        />
      )}
    </AdminLayout>
  )
}