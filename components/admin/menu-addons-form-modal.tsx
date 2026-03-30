import { useState, useEffect } from 'react'
import { X, Plus } from 'lucide-react'
import { menuAddonCategoriesAPI } from '@/lib/api/menu-addon-categories'

interface MenuAddonsFormModalProps {
  addon?: any
  onSubmit: (data: any) => Promise<void>
  onClose: () => void
  onOpenCategoryModal?: () => void
}

export function MenuAddonsFormModal({
  addon,
  onSubmit,
  onClose,
  onOpenCategoryModal,
}: MenuAddonsFormModalProps) {
  const [formData, setFormData] = useState({
    name: addon?.name || '',
    category: addon?.category || '',
    price_type: addon?.price_type || 'free',
    price: addon?.price || '',
  })

  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Load addon categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await menuAddonCategoriesAPI.listCategories(1, 100)

        let categoriesList = response
        if (response.results) {
          categoriesList = response.results
        } else if (response.data) {
          categoriesList = response.data
        } else if (Array.isArray(response)) {
          categoriesList = response
        }

        setCategories(Array.isArray(categoriesList) ? categoriesList : [])
      } catch (err) {
        console.error('Error loading addon categories:', err)
      }
    }

    loadCategories()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.category) {
      setError('Addon name and category are required')
      return
    }

    if (formData.price_type === 'paid' && !formData.price) {
      setError('Price is required for paid add-ons')
      return
    }

    try {
      setLoading(true)
      setError('')

      const submitData = {
        ...formData,
        price: formData.price_type === 'free' ? null : parseFloat(formData.price),
      }

      await onSubmit(submitData)
    } catch (err: any) {
      setError(err.message || 'Failed to save add-on')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 bg-white">
          <h2 className="text-xl font-bold text-gray-900">
            {addon ? 'Edit Add-on' : 'Add Menu Add-on'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Add-on Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Add-on Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Extra Cheese, Extra Sauce"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-gray-900"
              required
              disabled={loading}
            />
          </div>

          {/* Category */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-gray-900">
                Category *
              </label>
              {onOpenCategoryModal && (
                <button
                  type="button"
                  onClick={onOpenCategoryModal}
                  className="flex items-center gap-1 text-sm text-primary hover:bg-primary/10 px-2 py-1 rounded transition-colors"
                  disabled={loading}
                >
                  <Plus size={14} />
                  Add Category
                </button>
              )}
            </div>

            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-gray-900"
              required
              disabled={loading}
            >
              <option value="">Select Category</option>
              {categories.map((cat: any) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Price Type *
            </label>
            <div className="flex gap-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="price_type"
                  value="free"
                  checked={formData.price_type === 'free'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price_type: e.target.value,
                      price: '',
                    })
                  }
                  className="w-4 h-4 rounded border-gray-300"
                  disabled={loading}
                />
                <span className="text-sm font-semibold text-gray-900">Free</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="price_type"
                  value="paid"
                  checked={formData.price_type === 'paid'}
                  onChange={(e) => setFormData({ ...formData, price_type: e.target.value })}
                  className="w-4 h-4 rounded border-gray-300"
                  disabled={loading}
                />
                <span className="text-sm font-semibold text-gray-900">Paid</span>
              </label>
            </div>
          </div>

          {/* Price (only show if paid) */}
          {formData.price_type === 'paid' && (
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Price *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-gray-900"
                required={formData.price_type === 'paid'}
                disabled={loading}
              />
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all font-semibold disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Saving...' : addon ? 'Update Add-on' : 'Add Add-on'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
