'use client'

import { useState, useEffect } from 'react'
import { X, Upload } from 'lucide-react'
import { FormError } from './form-error'
import { validateFranchiseForm } from '@/lib/validation'

interface FranchiseFormModalProps {
  franchise?: any
  onSubmit: (data: any) => void
  onClose: () => void
}

export function FranchiseFormModal({ franchise, onSubmit, onClose }: FranchiseFormModalProps) {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    location: '',
    business_experience: '',
    investment_capacity: '',
    notes: '',
    status: 'Pending',
  })
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (franchise) {
      setFormData({
        full_name: franchise.full_name || '',
        email: franchise.email || '',
        phone: franchise.phone || '',
        location: franchise.location || '',
        business_experience: franchise.business_experience || '',
        investment_capacity: franchise.investment_capacity || '',
        notes: franchise.notes || '',
        status: franchise.status || 'Pending',
      })
      if (franchise.profile_image) {
        setImagePreview(franchise.profile_image)
      }
    }
  }, [franchise])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfileImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const validation = validateFranchiseForm(formData)
    
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }
    
    setErrors({})
    setIsLoading(true)
    
    const submitData = {
      ...formData,
      profile_image: profileImage,
    }
    
    onSubmit(submitData)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="modal-card max-w-2xl w-full max-h-[95vh] overflow-y-auto overflow-x-hidden" style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">
            {franchise ? 'Edit Franchise' : 'Add New Franchise'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Profile Image */}
          <div className="space-y-2">
            <label className="input-label">Profile Image</label>
            <div className="space-y-4">
              {imagePreview && (
                <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-300">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <label className="border-2 border-dashed border-primary/40 rounded-lg p-6 text-center cursor-pointer hover:bg-primary/5 hover:border-primary/60 transition-all bg-gradient-to-br from-white to-primary/3 block">
                <div className="flex flex-col items-center gap-2">
                  <Upload className="text-primary" size={32} />
                  <div>
                    <p className="font-semibold text-foreground">Upload Profile Image</p>
                    <p className="text-xs text-gray-600">JPG, PNG, WebP up to 5MB</p>
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="input-label">Full Name <span className="text-primary ml-1">*</span></label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary bg-white text-gray-900"
                  required
                />
                <FormError errors={errors} fieldName="full_name" />
              </div>

              <div>
                <label className="input-label">Email <span className="text-primary ml-1">*</span></label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary bg-white text-gray-900"
                  required
                />
                <FormError errors={errors} fieldName="email" />
              </div>

              <div>
                <label className="input-label">Phone Number <span className="text-primary ml-1">*</span></label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91-9876543210"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary bg-white text-gray-900"
                  required
                />
                <FormError errors={errors} fieldName="phone" />
              </div>

              <div>
                <label className="input-label">Location <span className="text-primary ml-1">*</span></label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter city/location"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary bg-white text-gray-900"
                  required
                />
                <FormError errors={errors} fieldName="location" />
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Business Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="input-label">Business Experience <span className="text-primary ml-1">*</span></label>
                <select
                  name="business_experience"
                  value={formData.business_experience}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary bg-white text-gray-900"
                  required
                >
                  <option value="">Select experience</option>
                  <option value="Less than 1 year">Less than 1 year</option>
                  <option value="1-2 years">1-2 years</option>
                  <option value="2-5 years">2-5 years</option>
                  <option value="5-10 years">5-10 years</option>
                  <option value="10+ years">10+ years</option>
                </select>
                <FormError errors={errors} fieldName="business_experience" />
              </div>

              <div>
                <label className="input-label">Investment Capacity <span className="text-primary ml-1">*</span></label>
                <select
                  name="investment_capacity"
                  value={formData.investment_capacity}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary bg-white text-gray-900"
                  required
                >
                  <option value="">Select capacity</option>
                  <option value="5-10 lakhs">5-10 lakhs</option>
                  <option value="10-20 lakhs">10-20 lakhs</option>
                  <option value="20-30 lakhs">20-30 lakhs</option>
                  <option value="30-50 lakhs">30-50 lakhs</option>
                  <option value="50+ lakhs">50+ lakhs</option>
                </select>
                <FormError errors={errors} fieldName="investment_capacity" />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Additional Information</h3>
            <div className="space-y-2">
              <label className="input-label">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any additional notes or requirements..."
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary bg-white text-gray-900 resize-none"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <label className="input-label">Status <span className="text-primary ml-1">*</span></label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary bg-white text-gray-900"
                required
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Under Review">Under Review</option>
              </select>
              <FormError errors={errors} fieldName="status" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t border-border sticky bottom-0 bg-white p-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : franchise ? 'Update Franchise' : 'Add Franchise'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
