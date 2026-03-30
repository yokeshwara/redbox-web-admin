'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { DataTable } from '@/components/admin/data-table'
import { Pagination } from '@/components/admin/pagination'
import { Plus, Search } from 'lucide-react'
import { CRUDModal } from '@/components/admin/crud-modal'
import { featuredDishesAPI } from '@/lib/api/featured-dishes'
import { useToast } from '@/hooks/use-toast'

function resolveAssetUrl(value?: string | null) {
  if (!value) return ''
  if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:')) {
    return value
  }

  const normalized = value.startsWith('/') ? value.slice(1) : value
  return `https://res.cloudinary.com/dzdeqpivt/${normalized}`
}

export default function FeaturedDishesPage() {
  const { toast } = useToast()
  const categoryOptions = [
    { value: 'starter', label: 'Starter' },
    { value: 'main_course', label: 'Main Course' },
    { value: 'dessert', label: 'Dessert' },
    { value: 'beverage', label: 'Beverage' },
  ]
  const [dishes, setDishes] = useState<any[]>([])
  const [filteredDishes, setFilteredDishes] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingDish, setEditingDish] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    category: 'main_course',
    price: '',
    description: '',
    is_featured: true,
    image: null as File | null,
    imagePreview: '',
  })

  const itemsPerPage = 10

  const formatCategoryLabel = (value: string) =>
    value
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase())

  useEffect(() => {
    loadDishes()
  }, [])

  const loadDishes = async () => {
    setLoading(true)
    try {
      const data = await featuredDishesAPI.list(1, 100)
      const dishesList = Array.isArray(data) ? data : data.results || []
      setDishes(dishesList)
      setFilteredDishes(dishesList)
    } catch (error: any) {
      console.error('Error loading dishes:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to load featured dishes',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const filtered = dishes.filter((dish) =>
      dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dish.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredDishes(filtered)
    setCurrentPage(1)
  }, [searchTerm, dishes])

  const handleAddNew = () => {
    setEditingDish(null)
    setFormData({
      name: '',
      category: 'main_course',
      price: '',
      description: '',
      is_featured: true,
      image: null,
      imagePreview: '',
    })
    setShowModal(true)
  }

const handleEdit = async (dish: any) => {
  try {
    setLoading(true)

    const response = await featuredDishesAPI.get(dish.id)

    console.log("API RESPONSE:", response)

    // normalize response structure
    const apiData = response?.data || response
    const dishData = Array.isArray(apiData?.data)
      ? apiData.data[0]
      : Array.isArray(apiData)
      ? apiData[0]
      : apiData

    console.log("DISH DATA:", dishData)

    if (!dishData) {
      toast({
        title: "Error",
        description: "Dish not found",
        variant: "destructive",
      })
      return
    }

    setEditingDish(dishData)

    setFormData({
      name: dishData.name ?? "",
      category: dishData.category ?? "main_course",
      price: dishData.price ? String(dishData.price) : "",
      description: dishData.description ?? "",
      is_featured: dishData.is_featured ?? true,
      image: null,
      imagePreview: resolveAssetUrl(dishData.image_url || dishData.image),
    })

    setShowModal(true)

  } catch (error: any) {
    console.error("Edit API error:", error)

    toast({
      title: "Error",
      description: error.message || "Failed to fetch dish",
      variant: "destructive",
    })
  } finally {
    setLoading(false)
  }
}


  const handleDelete = async (dish: any) => {
    if (confirm(`Delete "${dish.name}"?`)) {
      try {
        await featuredDishesAPI.delete(dish.id)
        setDishes(dishes.filter((d) => d.id !== dish.id))
        toast({
          title: 'Success',
          description: 'Dish deleted successfully',
        })
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to delete dish',
          variant: 'destructive',
        })
      }
    }
  }

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  try {
    setSubmitting(true)

    if (!formData.name || !formData.price || !formData.category) {
      toast({
        title: "Error",
        description: "Name, category and price are required",
        variant: "destructive",
      })
      return
    }

    const payload = new FormData()
    payload.append('name', formData.name.trim())
    payload.append('category', formData.category)
    payload.append('price', String(parseFloat(formData.price)))
    payload.append('description', formData.description.trim())
    payload.append('is_featured', String(formData.is_featured))

    if (formData.image instanceof File) {
      payload.append('image', formData.image)
    }

    if (editingDish) {
      // UPDATE DISH
      await featuredDishesAPI.update(editingDish.id, payload)

      toast({
        title: "Success",
        description: "Dish updated successfully",
      })
    } else {
      // CREATE DISH
      await featuredDishesAPI.create(payload)

      toast({
        title: "Success",
        description: "Dish created successfully",
      })
    }

    setShowModal(false)

    // reload table
    loadDishes()

  } catch (error: any) {
    console.error(error)

    toast({
      title: "Error",
      description: error.message || "Failed to save dish",
      variant: "destructive",
    })
  } finally {
    setSubmitting(false)
  }
}

  const paginatedDishes = filteredDishes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  const totalPages = Math.ceil(filteredDishes.length / itemsPerPage)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: typeof reader.result === 'string' ? reader.result : '',
      }))
    }
    reader.readAsDataURL(file)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Featured Dishes</h1>
            <p className="text-sm text-gray-600 mt-1">Manage featured menu items on homepage</p>
          </div>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all font-semibold"
          >
            <Plus size={20} />
            Add Dish
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-2 bg-white border-2 border-primary/30 rounded-lg px-4 py-2 hover:border-primary transition-all">
          <Search size={18} className="text-primary" />
          <input
            type="text"
            placeholder="Search dishes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 outline-none text-gray-900 bg-transparent"
          />
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-gray-500">Loading featured dishes...</p>
          </div>
        ) : (
          <DataTable
            columns={[
              {
                header: 'Image',
                accessor: 'image_url',
                render: (_val, row) => {
                  const src = resolveAssetUrl(row.image_url || row.image)
                  return src ? (
                    <img
                      src={src}
                      alt={row.name}
                      className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-lg border border-dashed border-gray-300 bg-gray-50" />
                  )
                },
              },
              { header: 'Dish Name', accessor: 'name' },
              {
                header: 'Category',
                accessor: 'category',
                render: (val) => formatCategoryLabel(String(val || '')),
              },
              { header: 'Price (₹)', accessor: 'price' },
              {
                header: 'Featured',
                accessor: 'is_featured',
                render: (val) => (
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${val ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {val ? 'Yes' : 'No'}
                  </span>
                ),
              },
              { header: 'Description', accessor: 'description' },
            ]}
            data={paginatedDishes}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredDishes.length}
            itemsPerPage={itemsPerPage}
          />
        )}
      </div>

      {/* Modal */}
      <CRUDModal
        isOpen={showModal}
        title="Featured Dish"
        isEditing={!!editingDish}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        isLoading={submitting}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Dish Name *</label>
            <input
              type="text"
              placeholder="e.g., Butter Chicken"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border-2 border-primary/30 rounded-lg focus:outline-none focus:border-primary text-gray-900"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border-2 border-primary/30 rounded-lg focus:outline-none focus:border-primary text-gray-900"
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

  

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Price (₹) *</label>
              <input
                type="number"
                placeholder="e.g., 350"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                step="10"
                min="0"
                className="w-full px-3 py-2 border-2 border-primary/30 rounded-lg focus:outline-none focus:border-primary text-gray-900"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Description</label>
            <textarea
              placeholder="Dish description..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border-2 border-primary/30 rounded-lg focus:outline-none focus:border-primary text-gray-900"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Dish Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border-2 border-primary/30 rounded-lg focus:outline-none focus:border-primary text-gray-900"
            />
            {formData.imagePreview ? (
              <div className="mt-3 space-y-2">
                <img
                  src={formData.imagePreview}
                  alt="Dish preview"
                  className="h-32 w-full rounded-lg object-cover border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      image: null,
                      imagePreview: '',
                    }))
                  }
                  className="text-sm font-semibold text-red-600 hover:text-red-700"
                >
                  Remove image
                </button>
              </div>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              checked={formData.is_featured}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              className="w-4 h-4 rounded"
            />
            <label htmlFor="featured" className="text-sm font-semibold text-gray-900">
              Mark as Featured
            </label>
          </div>
        </div>
      </CRUDModal>
    </AdminLayout>
  )
}
