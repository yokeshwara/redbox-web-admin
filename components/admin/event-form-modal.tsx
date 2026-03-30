'use client'

import { useState, useEffect } from 'react'
import { X, Calendar } from 'lucide-react'

interface EventFormModalProps {
  item?: any
  onSubmit: (data: any) => void
  onClose: () => void
}

export function EventFormModal({ item, onSubmit, onClose }: EventFormModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Birthday Parties',
    description: '',
    maxGuests: '',
    minPrice: '',
    maxPrice: '',
    image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=600&h=400&fit=crop',
    features: '',
    bookings: 0,
    status: 'Active',
  })

  useEffect(() => {
    if (item) {
      setFormData(item)
    }
  }, [item])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      maxGuests: parseInt(formData.maxGuests),
      minPrice: parseInt(formData.minPrice),
      maxPrice: parseInt(formData.maxPrice),
    })
  }

  const categories = ['Corporate Events', 'Birthday Parties', 'Private Dining', 'Wedding', 'Anniversary', 'Engagement']

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="modal-card max-w-3xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-xl">
              <Calendar size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {item ? 'Edit Event' : 'Add Event'}
              </h2>
              <p className="text-sm text-white/80 mt-0.5">Manage event packages and bookings</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Event Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b-2 border-primary/20">
              <Calendar size={20} className="text-primary" />
              <h3 className="text-lg font-bold text-foreground">Event Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Event Title *"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter event title"
                required
              />
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white border-2 border-primary/30 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-white text-foreground">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <FormInput
              label="Description *"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the event package..."
              textarea
              required
            />
          </div>

          {/* Pricing & Capacity */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b-2 border-primary/20">
              <Calendar size={20} className="text-primary" />
              <h3 className="text-lg font-bold text-foreground">Pricing & Capacity</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInput
                label="Max Guests *"
                name="maxGuests"
                type="number"
                value={formData.maxGuests}
                onChange={handleChange}
                placeholder="0"
                required
              />
              <FormInput
                label="Min Price (₹) *"
                name="minPrice"
                type="number"
                value={formData.minPrice}
                onChange={handleChange}
                placeholder="0"
                required
              />
              <FormInput
                label="Max Price (₹) *"
                name="maxPrice"
                type="number"
                value={formData.maxPrice}
                onChange={handleChange}
                placeholder="0"
                required
              />
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">Features & Amenities</h3>
            <FormInput
              label="Features (comma-separated)"
              name="features"
              value={formData.features}
              onChange={handleChange}
              placeholder="e.g., Custom Menus, Group Packages, Dedicated Staff"
              textarea
            />
          </div>

          {/* Event Image */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">Event Image URL</h3>
            <FormInput
              label="Image URL"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
            {formData.image && (
              <div className="flex justify-center pt-4">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-48 h-32 rounded-lg object-cover border-2 border-primary/20"
                />
              </div>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Status *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white border-2 border-primary/30 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              required
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-8 border-t-2 border-border w-full">
            <button
              type="submit"
              className="btn-primary flex-1 py-3 w-full sm:w-auto"
            >
              {item ? '✓ Update Event' : '+ Add Event'}
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
