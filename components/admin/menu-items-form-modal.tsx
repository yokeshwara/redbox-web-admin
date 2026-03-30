import { useState, useRef, useEffect } from 'react'
import { X, Upload, Plus, Trash2 } from 'lucide-react'
import { menuCategoriesAPI } from '@/lib/api/menu-categories'
import { menuTagsAPI } from '@/lib/api/menu-tags'

interface MenuItemsFormModalProps {
  item?: any
  onSubmit: (data: any) => Promise<void>
  onClose: () => void
}

export function MenuItemsFormModal({ item, onSubmit, onClose }: MenuItemsFormModalProps) {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    description: item?.description || '',
    category: item?.category || '',
    food_type: item?.food_type || 'veg',
    base_price: item?.base_price || '',
    status: item?.status || 'available',
    is_special: item?.is_special || false,
    is_combo: item?.is_combo || false,
    rating: item?.rating || '',
    tags: item?.tags || [],
    addons: item?.addons || [],
    image: null as File | null,
  })

  const [imagePreview, setImagePreview] = useState<string>(item?.image || '')
  const [categories, setCategories] = useState<any[]>([])
  const [tags, setTags] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load categories and tags
  useEffect(() => {
    const loadData = async () => {
      try {
        const [catsRes, tagsRes] = await Promise.all([
          menuCategoriesAPI.listCategories(1, 100),
          menuTagsAPI.listTags(1, 100),
        ])

        setCategories(Array.isArray(catsRes) ? catsRes : catsRes.results || [])
        setTags(Array.isArray(tagsRes) ? tagsRes : tagsRes.results || [])
      } catch (err) {
        console.error('Error loading data:', err)
      }
    }

    loadData()
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, image: file })
      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddAddon = () => {
    setFormData({
      ...formData,
      addons: [...formData.addons, { name: '', price: '' }],
    })
  }

  const handleRemoveAddon = (index: number) => {
    setFormData({
      ...formData,
      addons: formData.addons.filter((_, i) => i !== index),
    })
  }

  const handleAddonChange = (index: number, field: string, value: string) => {
    const newAddons = [...formData.addons]
    newAddons[index] = { ...newAddons[index], [field]: value }
    setFormData({ ...formData, addons: newAddons })
  }

  const handleTagToggle = (tagId: string, tagName: string) => {
    const existingIndex = formData.tags.findIndex((t: any) => t.id === tagId)
    if (existingIndex > -1) {
      setFormData({
        ...formData,
        tags: formData.tags.filter((_, i) => i !== existingIndex),
      })
    } else {
      setFormData({
        ...formData,
        tags: [...formData.tags, { id: tagId, name: tagName }],
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.category || !formData.base_price) {
      setError('Name, category, and base price are required')
      return
    }

    try {
      setLoading(true)
      setError('')

      const submitData = {
        ...formData,
        tags: formData.tags.map((t: any) => t.id || t),
      }

      await onSubmit(submitData)
    } catch (err: any) {
      setError(err.message || 'Failed to save menu item')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 bg-white">
          <h2 className="text-xl font-bold text-gray-900">
            {item ? 'Edit Menu Item' : 'Add Menu Item'}
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

          {/* Item Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Item Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Butter Chicken"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-gray-900"
              required
              disabled={loading}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Item description..."
              rows={3}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-gray-900"
              disabled={loading}
            />
          </div>

          {/* Category & Food Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Category *
              </label>
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

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Food Type *
              </label>
              <select
                value={formData.food_type}
                onChange={(e) => setFormData({ ...formData, food_type: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-gray-900"
                disabled={loading}
              >
                <option value="veg">Vegetarian</option>
                <option value="non_veg">Non-Vegetarian</option>
              </select>
            </div>
          </div>

          {/* Base Price & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Base Price *
              </label>
              <input
                type="number"
                value={formData.base_price}
                onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-gray-900"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-gray-900"
                disabled={loading}
              >
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Rating (0-5)
            </label>
            <input
              type="number"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
              placeholder="4.5"
              step="0.1"
              min="0"
              max="5"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-gray-900"
              disabled={loading}
            />
          </div>

          {/* Checkboxes */}
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_special}
                onChange={(e) => setFormData({ ...formData, is_special: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300"
                disabled={loading}
              />
              <span className="text-sm font-semibold text-gray-900">Mark as Special</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_combo}
                onChange={(e) => setFormData({ ...formData, is_combo: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300"
                disabled={loading}
              />
              <span className="text-sm font-semibold text-gray-900">Is Combo</span>
            </label>
          </div>

          {/* Tags Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Tags
            </label>
            <div className="space-y-2 max-h-32 overflow-y-auto border-2 border-gray-300 rounded-lg p-3">
              {tags.length > 0 ? (
                tags.map((tag: any) => (
                  <label key={tag.id} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.tags.some((t: any) => t.id === tag.id)}
                      onChange={() => handleTagToggle(tag.id, tag.name)}
                      className="w-4 h-4 rounded border-gray-300"
                      disabled={loading}
                    />
                    <span className="text-sm text-gray-900">{tag.name}</span>
                  </label>
                ))
              ) : (
                <p className="text-sm text-gray-500">No tags available</p>
              )}
            </div>
          </div>

          {/* Add-ons */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-gray-900">Add-ons</label>
              <button
                type="button"
                onClick={handleAddAddon}
                className="flex items-center gap-1 text-sm text-primary hover:bg-primary/10 px-2 py-1 rounded transition-colors"
                disabled={loading}
              >
                <Plus size={14} />
                Add Add-on
              </button>
            </div>

            <div className="space-y-3">
              {formData.addons.map((addon: any, index: number) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add-on name"
                    value={addon.name}
                    onChange={(e) => handleAddonChange(index, 'name', e.target.value)}
                    className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-gray-900"
                    disabled={loading}
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={addon.price}
                    onChange={(e) => handleAddonChange(index, 'price', e.target.value)}
                    step="0.01"
                    min="0"
                    className="w-28 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-gray-900"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveAddon(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    disabled={loading}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Item Image
            </label>
            <div className="space-y-3">
              {imagePreview && (
                <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, image: null })
                      setImagePreview('')
                      if (fileInputRef.current) fileInputRef.current.value = ''
                    }}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors"
                disabled={loading}
              >
                <Upload size={16} />
                Choose Image
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

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
              {loading ? 'Saving...' : item ? 'Update Item' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
