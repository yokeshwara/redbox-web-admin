'use client'

import { useEffect, useState } from 'react'
import { X, Star, MessageSquare, Upload } from 'lucide-react'

interface TestimonialFormModalProps {
  item?: any
  onSubmit: (data: any) => Promise<void> | void
  onClose: () => void
}

export function TestimonialFormModal({ item, onSubmit, onClose }: TestimonialFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 5,
    review: '',
    image: null as File | null,
    imagePreview: '',
    status: 'pending',
    display_on_homepage: true,
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        email: item.email || '',
        rating: Number(item.rating || 5),
        review: item.review || item.text || '',
        image: null,
        imagePreview: item.image || item.image_url || '',
        status: (item.status || 'pending').toLowerCase(),
        display_on_homepage: item.display_on_homepage ?? true,
      })
    }
  }, [item])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFormData((prev) => ({
      ...prev,
      image: file,
      imagePreview: URL.createObjectURL(file),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await onSubmit({
        ...formData,
        rating: Number(formData.rating),
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="modal-card max-w-2xl w-full max-h-[95vh] overflow-y-auto">
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-xl">
              <MessageSquare size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{item ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
              <p className="text-sm text-white/80 mt-0.5">Manage customer testimonials and reviews</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b-2 border-primary/20">
              <MessageSquare size={20} className="text-primary" />
              <h3 className="text-lg font-bold text-foreground">Customer Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput label="Customer Name *" name="name" value={formData.name} onChange={handleChange} placeholder="Enter customer name" required />
              <FormInput label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Enter email address" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b-2 border-primary/20">
              <Star size={20} className="text-primary" />
              <h3 className="text-lg font-bold text-foreground">Review Details</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Rating *</label>
              <div className="flex items-center gap-6">
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={formData.rating}
                  onChange={(e) => setFormData((prev) => ({ ...prev, rating: parseInt(e.target.value) }))}
                  className="flex-1"
                />
                <div className="flex items-center gap-2 min-w-fit">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={24}
                      className={i < formData.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                    />
                  ))}
                </div>
              </div>
            </div>

            <FormInput
              label="Review Text *"
              name="review"
              value={formData.review}
              onChange={handleChange}
              placeholder="Write the customer review..."
              textarea
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Status *</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white border-2 border-primary/30 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                >
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Homepage Visibility</label>
                <label className="flex items-center gap-3 rounded-lg border-2 border-primary/20 bg-white px-4 py-3">
                  <input
                    type="checkbox"
                    name="display_on_homepage"
                    checked={formData.display_on_homepage}
                    onChange={handleChange}
                  />
                  <span className="text-sm text-gray-700">Display on homepage</span>
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">Profile Image</h3>
            {formData.imagePreview ? (
              <div className="space-y-3">
                <img
                  src={formData.imagePreview}
                  alt="Preview"
                  className="h-24 w-24 rounded-full object-cover border-2 border-primary/20"
                />
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white">
                  <Upload size={16} />
                  Change Image
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
            ) : (
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-dashed border-primary/30 px-4 py-6 text-primary">
                <Upload size={18} />
                Upload Profile Image
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-8 border-t-2 border-border w-full">
            <button type="submit" disabled={saving} className="btn-primary flex-1 py-3 w-full sm:w-auto">
              {saving ? 'Saving...' : item ? 'Update Testimonial' : 'Add Testimonial'}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary flex-1 py-3 w-full sm:w-auto">
              Cancel
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
          rows={4}
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
