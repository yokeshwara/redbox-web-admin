'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { DataTable } from '@/components/admin/data-table'
import { Pagination } from '@/components/admin/pagination'
import { Plus, Search, AlertCircle } from 'lucide-react'
import { MenuItemsFormModal } from '@/components/admin/menu-items-form-modal'
import { menuItemsAPI } from '@/lib/api/menu-items'

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<any[]>([])
  const [filteredItems, setFilteredItems] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const itemsPerPage = 10

  // Load menu items from API
  const loadMenuItems = async (page: number = 1, search: string = '', category: string = '') => {
    try {
      setLoading(true)
      setError('')
      const response = await menuItemsAPI.listItems(page, itemsPerPage, search, category)

      let itemsList = response
      if (response.results) {
        itemsList = response.results
      } else if (response.data) {
        itemsList = response.data
      } else if (Array.isArray(response)) {
        itemsList = response
      }

      const processedItems = (Array.isArray(itemsList) ? itemsList : []).map((item: any) => ({
        id: item.id,
        name: item.name || '',
        description: item.description || '',
        category: item.category || '',
        food_type: item.food_type || 'veg',
        base_price: item.base_price || 0,
        status: item.status || 'available',
        is_special: item.is_special || false,
        is_combo: item.is_combo || false,
        rating: item.rating || 0,
        image: item.image || '',
        tags: item.tags || [],
        addons: item.add_ons || [],
      }))

      setMenuItems(processedItems)
      setFilteredItems(processedItems)
    } catch (err: any) {
      console.error('Error loading menu items:', err)
      setError('Failed to load menu items')
    } finally {
      setLoading(false)
    }
  }

  // Load initial data
  useEffect(() => {
    loadMenuItems(1, '', '')
  }, [])

  useEffect(() => {
    let filtered = menuItems.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    if (categoryFilter) {
      filtered = filtered.filter((item) => item.category === categoryFilter)
    }
    setFilteredItems(filtered)
    setCurrentPage(1)
  }, [searchTerm, categoryFilter, menuItems])

  const handleAddItem = async (formData: any) => {
    try {
      if (editingItem) {
        await menuItemsAPI.updateItem(editingItem.id, formData)
      } else {
        await menuItemsAPI.createItem(formData)
      }

      await loadMenuItems(1, '')
      setShowModal(false)
      setEditingItem(null)
    } catch (err: any) {
      console.error('Error saving item:', err)
      throw err
    }
  }

  const handleEdit = async (item: any) => {
    try {
      setLoading(true)
      const details = await menuItemsAPI.getItem(item.id)
      setEditingItem(details)
      setShowModal(true)
    } catch (err) {
      console.error('Error fetching item details:', err)
      setError('Failed to load item details')
      setEditingItem(item)
      setShowModal(true)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (item: any) => {
    if (confirm(`Are you sure you want to delete ${item.name}?`)) {
      try {
        setLoading(true)
        await menuItemsAPI.deleteItem(item.id)
        setMenuItems(menuItems.filter((i) => i.id !== item.id))
      } catch (err: any) {
        console.error('Error deleting item:', err)
        setError('Failed to delete menu item')
      } finally {
        setLoading(false)
      }
    }
  }

  const categories = Array.from(new Set(menuItems.map((item) => item.category).filter(Boolean)))

  const columns = [
    {
      header: 'Image',
      accessor: 'image',
      width: '90px',
      render: (value: string, row: any) => (
        <div className="flex items-center justify-center">
          {value ? (
            <img
              src={value}
              alt={row.name}
              className="w-14 h-14 rounded-lg object-cover shadow-sm"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          ) : (
            <div className="w-14 h-14 rounded-lg bg-gray-200 flex items-center justify-center text-xs text-gray-500">
              No Image
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Item Name',
      accessor: 'name',
      render: (value: string, row: any) => (
        <div>
          <p className="font-semibold text-gray-900">{value}</p>
          {row.tags?.length > 0 && (
            <div className="flex gap-1 mt-1 flex-wrap">
              {row.tags.slice(0, 2).map((tag: any) => (
                <span
                  key={typeof tag === 'string' ? tag : tag.id}
                  className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded font-semibold"
                >
                  {typeof tag === 'string' ? tag : tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Category',
      accessor: 'category',
      render: (value: string) => (
        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm font-semibold">
          {value}
        </span>
      ),
    },
    {
      header: 'Price',
      accessor: 'base_price',
      render: (value: number) => (
        <p className="font-bold text-gray-900">₹{value}</p>
      ),
    },
    {
      header: 'Type',
      accessor: 'food_type',
      render: (value: string) => (
        <span
          className={`px-2 py-1 rounded text-xs font-semibold ${
            value === 'veg' || value === 'Veg'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {value === 'veg' || value === 'Veg' ? 'Veg' : 'Non-Veg'}
        </span>
      ),
    },
    {
      header: 'Rating',
      accessor: 'rating',
      render: (value: number) => (
        <div className="flex items-center gap-1">
          <span className="text-yellow-500">⭐</span>
          <span className="font-bold text-gray-900">{value}</span>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (value: string) => (
        <span
          className={`px-2 py-1 rounded text-xs font-semibold ${
            value === 'available'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {value === 'available' ? 'Available' : 'Unavailable'}
        </span>
      ),
    },
  ]

  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage)

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Menu Items</h1>
            <p className="text-sm text-gray-600 mt-1">Manage restaurant menu items with categories, pricing, and add-ons</p>
          </div>
          <button
            onClick={() => {
              setEditingItem(null)
              setShowModal(true)
            }}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all font-semibold disabled:opacity-50"
          >
            <Plus size={20} />
            Add Item
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

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 flex items-center gap-2 bg-white border-2 border-primary/30 rounded-lg px-4 py-2 hover:border-primary transition-all">
            <Search size={18} className="text-primary" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 outline-none text-gray-900 bg-transparent"
              disabled={loading}
            />
          </div>
          {categories.length > 0 && (
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border-2 border-primary/30 rounded-lg focus:outline-none focus:border-primary text-gray-900 bg-white"
              disabled={loading}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Loading State */}
        {loading && menuItems.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <div className="inline-block">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            </div>
            <p className="mt-4 text-gray-600">Loading menu items...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-gray-600">
              {searchTerm ? 'No items found matching your search' : 'No menu items added yet'}
            </p>
          </div>
        ) : (
          <>
            {/* Table */}
            <DataTable
              columns={columns}
              data={paginatedItems}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={filteredItems.length}
                itemsPerPage={itemsPerPage}
              />
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <MenuItemsFormModal
          item={editingItem}
          onSubmit={handleAddItem}
          onClose={() => {
            setShowModal(false)
            setEditingItem(null)
          }}
        />
      )}
    </AdminLayout>
  )
}
