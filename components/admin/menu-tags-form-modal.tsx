import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { menuItemsAPI } from '@/lib/api/menu-items'

interface MenuTagsFormModalProps {
  tag?: any
  onSubmit: (data: any) => Promise<void>
  onClose: () => void
}

export function MenuTagsFormModal({ tag, onSubmit, onClose }: MenuTagsFormModalProps) {
  const [formData, setFormData] = useState({
    name: tag?.name || '',
    menu_items: tag?.menu_items || [],
  })

  const [menuItems, setMenuItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  // Load menu items
  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        const response = await menuItemsAPI.listItems(1, 100)
        let itemsList = response
        if (response.results) {
          itemsList = response.results
        } else if (response.data) {
          itemsList = response.data
        } else if (Array.isArray(response)) {
          itemsList = response
        }

        setMenuItems(Array.isArray(itemsList) ? itemsList : [])
      } catch (err) {
        console.error('Error loading menu items:', err)
      }
    }

    loadMenuItems()
  }, [])

  const handleItemToggle = (itemId: string, itemName: string) => {
    const existingIndex = formData.menu_items.findIndex(
      (item: any) => (typeof item === 'string' ? item === itemId : item.id === itemId)
    )

    if (existingIndex > -1) {
      setFormData({
        ...formData,
        menu_items: formData.menu_items.filter((_, i) => i !== existingIndex),
      })
    } else {
      setFormData({
        ...formData,
        menu_items: [...formData.menu_items, itemId],
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      setError('Tag name is required')
      return
    }

    try {
      setLoading(true)
      setError('')
      await onSubmit(formData)
    } catch (err: any) {
      setError(err.message || 'Failed to save tag')
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const isItemSelected = (itemId: string) =>
    formData.menu_items.some((item: any) => (typeof item === 'string' ? item === itemId : item.id === itemId))

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 bg-white">
          <h2 className="text-xl font-bold text-gray-900">
            {tag ? 'Edit Menu Tag' : 'Add Menu Tag'}
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

          {/* Tag Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Tag Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Spicy, Vegetarian, Popular"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-gray-900"
              required
              disabled={loading}
            />
          </div>

          {/* Menu Items Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Select Menu Items
            </label>

            {/* Search */}
            <div className="mb-3">
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-gray-900"
                disabled={loading}
              />
            </div>

            {/* Selected Items Summary */}
            {formData.menu_items.length > 0 && (
              <div className="mb-3 p-3 bg-primary/5 rounded-lg">
                <p className="text-sm font-semibold text-gray-900 mb-2">
                  Selected Items: {formData.menu_items.length}
                </p>
                <div className="flex flex-wrap gap-2">
                  {formData.menu_items.map((itemId: string) => {
                    const item = menuItems.find((i) => i.id === itemId)
                    return item ? (
                      <span
                        key={itemId}
                        className="bg-primary text-white text-xs px-2 py-1 rounded-full font-semibold"
                      >
                        {item.name}
                      </span>
                    ) : null
                  })}
                </div>
              </div>
            )}

            {/* Items List */}
            <div className="space-y-2 max-h-64 overflow-y-auto border-2 border-gray-300 rounded-lg p-3">
              {filteredItems.length > 0 ? (
                filteredItems.map((item: any) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={isItemSelected(item.id)}
                      onChange={() => handleItemToggle(item.id, item.name)}
                      className="w-4 h-4 rounded border-gray-300"
                      disabled={loading}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                      {item.description && (
                        <p className="text-xs text-gray-500">{item.description}</p>
                      )}
                    </div>
                    {item.base_price && (
                      <span className="text-sm font-semibold text-primary">₹{item.base_price}</span>
                    )}
                  </label>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  {searchTerm ? 'No items found' : 'No menu items available'}
                </p>
              )}
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
              {loading ? 'Saving...' : tag ? 'Update Tag' : 'Add Tag'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
