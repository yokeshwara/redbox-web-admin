'use client'

import { useState, useEffect } from 'react'
import { X, Upload, Plus, Trash2, Star, UtensilsCrossed } from 'lucide-react'

interface MenuFormModalProps {
  item?: any
  onSubmit: (data: any) => void
  onClose: () => void
}

export function MenuFormModal({ item, onSubmit, onClose }: MenuFormModalProps) {

  const normalizeCategory = (value: any) => {
    if (!value) return 'Appetizers'

    const formatted = value.toString().toLowerCase().replace(/\s/g, '')

    const map: any = {
      appetizers: 'Appetizers',
      maincourse: 'Main Course',
      rice: 'Rice',
      bread: 'Bread',
      desserts: 'Desserts',
      beverages: 'Beverages',
    }

    return map[formatted] || 'Appetizers'
  }

  const [formData, setFormData] = useState({
    name: '',
    category: 'Appetizers',
    branch: 'Downtown Branch',
    price: '',
    type: 'Veg',
    availability: 'Available',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
    description: '',
    rating: 0,
    tags: [] as string[],
    isCombo: false,
    isSpecial: false,
    addons: [] as { name: string; price: number }[],
  })

  const [newTag, setNewTag] = useState('')
  const [newAddonName, setNewAddonName] = useState('')
  const [newAddonPrice, setNewAddonPrice] = useState('')

  useEffect(() => {
    if (item) {
      setFormData((prev) => ({
        ...prev,
        ...item,
        category: normalizeCategory(item.category),
      }))
    }
  }, [item])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'category' ? normalizeCategory(value) : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag],
      }))
      setNewTag('')
    }
  }

  const removeTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }))
  }

  const addAddon = () => {
    if (newAddonName.trim() && newAddonPrice) {
      setFormData((prev) => ({
        ...prev,
        addons: [...prev.addons, { name: newAddonName, price: parseFloat(newAddonPrice) }],
      }))
      setNewAddonName('')
      setNewAddonPrice('')
    }
  }

  const removeAddon = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      addons: prev.addons.filter((_, i) => i !== index),
    }))
  }

  const categories = ['Appetizers', 'Main Course', 'Rice', 'Bread', 'Desserts', 'Beverages']
  const branches = ['Downtown Branch', 'Westside Branch', 'Eastend Branch']
  const availableTags = ['bestseller', 'spicy', 'healthy', 'creamy', 'favorite', 'mild', 'glutenfree']

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="modal-card max-w-3xl w-full max-h-[95vh] overflow-y-auto">
        
        {/* Header */}
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-xl">
              <UtensilsCrossed size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {item ? 'Edit Menu Item' : 'Add Menu Item'}
              </h2>
              <p className="text-sm text-white/80 mt-0.5">Manage menu items and offerings</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8">

          {/* Basic Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b-2 border-primary/20">
              <Star size={20} className="text-primary" />
              <h3 className="text-lg font-bold text-foreground">Basic Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Item Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter item name"
              />

              {/* ✅ FIXED CATEGORY DROPDOWN */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Category</label>
                <select
                  name="category"
                  value={formData.category || 'Appetizers'}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white text-black border-2 border-primary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                >
                  {categories.map((cat) => (
                    <option
                      key={cat}
                      value={cat}
                      style={{ color: '#000', backgroundColor: '#fff' }}
                    >
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <FormInput
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter item description"
              textarea
            />
          </div>

          {/* Pricing & Availability */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b-2 border-primary/20">
              <Upload size={20} className="text-primary" />
              <h3 className="text-lg font-bold text-foreground">Pricing & Availability</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <FormInput
                label="Price (₹)"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                placeholder="0"
              />
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white border-2 border-primary/30 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                >
                  <option value="Veg">Veg</option>
                  <option value="Non-Veg">Non-Veg</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Status</label>
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white border-2 border-primary/30 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                >
                  <option value="Available">Available</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="flex gap-4 p-4 bg-secondary/50 rounded-lg">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isSpecial}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isSpecial: e.target.checked }))}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium text-foreground">Mark as Special/New</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isCombo}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isCombo: e.target.checked }))}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium text-foreground">Is Combo Deal</span>
              </label>
            </div>
          </div>

          {/* Tags */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Tags & Labels</h3>
            <div className="flex gap-2 mb-4 flex-wrap">
              {formData.tags.map((tag, index) => (
                <div key={index} className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="hover:bg-primary/80 rounded-full p-0.5"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <select
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="flex-1 px-4 py-2 bg-white border-2 border-primary/30 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              >
                <option value="">Select a tag...</option>
                {availableTags.map((tag) => (
                  <option key={tag} value={tag} className="bg-white">
                    {tag}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all flex items-center gap-2"
              >
                <Plus size={18} />
                Add
              </button>
            </div>
          </div>

          {/* Addons */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Add-ons & Extras</h3>
            {formData.addons.length > 0 && (
              <div className="space-y-2 mb-4">
                {formData.addons.map((addon, index) => (
                  <div key={index} className="flex items-center justify-between bg-secondary/50 p-3 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{addon.name}</p>
                      <p className="text-sm text-muted-foreground">₹{addon.price}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAddon(index)}
                      className="p-2 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <FormInput
                label="Add-on Name"
                value={newAddonName}
                onChange={(e) => setNewAddonName(e.target.value)}
                placeholder="e.g., Extra Cheese"
              />
              <FormInput
                label="Price (₹)"
                type="number"
                value={newAddonPrice}
                onChange={(e) => setNewAddonPrice(e.target.value)}
                placeholder="0"
              />
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={addAddon}
                  className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 font-semibold"
                >
                  <Plus size={18} />
                  Add Add-on
                </button>
              </div>
            </div>
          </div>

          {/* Rating */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Rating</h3>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={(e) => setFormData((prev) => ({ ...prev, rating: parseFloat(e.target.value) }))}
                className="flex-1"
              />
              <div className="flex items-center gap-2 min-w-fit">
                <Star size={20} className="text-yellow-500 fill-yellow-500" />
                <span className="text-xl font-bold text-foreground">{formData.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-8 border-t-2 border-border w-full">
            <button
              type="submit"
              className="btn-primary flex-1 py-3 w-full sm:w-auto"
            >
              {item ? '✓ Update Item' : '+ Add Item'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1 py-3 w-full sm:w-auto"
            >
              ✕ Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function FormInput({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
  textarea = false,
}: any) {
  return (
    <div className="form-group">
      <label className="input-label">
        {label}
        {required && <span className="text-primary ml-1">*</span>}
      </label>
      {textarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="input-field resize-none"
          rows={3}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="input-field"
        />
      )}
    </div>
  )
}
