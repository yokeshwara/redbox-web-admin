'use client'

import { useState, useEffect } from 'react'
import { X, Zap, Upload } from 'lucide-react'
import { MultiSelect } from './multi-select'
import { FormError } from './form-error'
import { branchesAPI } from '@/lib/api/branches'

const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com/dzdeqpivt/'

function resolveAssetUrl(value?: string | null) {
  if (!value) return ''
  if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:')) {
    return value
  }
  const normalized = value.startsWith('/') ? value.slice(1) : value
  return `${CLOUDINARY_BASE_URL}${normalized}`
}

interface FacilitiesFormModalProps {
  facility?: any
  onSubmit: (data: any) => Promise<void>
  onClose: () => void
}

export function FacilitiesFormModal({
  facility,
  onSubmit,
  onClose,
}: FacilitiesFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: null as File | null,
    iconPreview: '',
    branches: [] as string[],
  })

  const [branches, setBranches] = useState<{ label: string; value: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [branchesLoading, setBranchesLoading] = useState(true)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [submitError, setSubmitError] = useState('')

  // Load branches on mount
  useEffect(() => {
    const loadBranches = async () => {
      try {
        setBranchesLoading(true)
        const response = await branchesAPI.listBranches(1, 100)
        
        // Handle different response formats
        let branchesList = response
        if (response.results) {
          branchesList = response.results
        } else if (Array.isArray(response)) {
          branchesList = response
        }

        const branchOptions = (Array.isArray(branchesList) ? branchesList : []).map((branch: any) => ({
          label: branch.name || branch.title || '',
          value: branch.id || '',
        }))
        
        setBranches(branchOptions)
      } catch (error) {
        console.error('Failed to load branches:', error)
        setSubmitError('Failed to load branches list')
      } finally {
        setBranchesLoading(false)
      }
    }

    loadBranches()
  }, [])

  // Load facility data if editing
  useEffect(() => {
    if (facility) {
      setFormData({
        name: facility.name || '',
        description: facility.description || '',
        icon: null,
        iconPreview: resolveAssetUrl(facility.icon_url || facility.icon || ''),
        branches: facility.branches || [],
      })
    }
  }, [facility])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        icon: file,
        iconPreview: URL.createObjectURL(file),
      }))
    }
  }

  const handleRemoveIcon = () => {
    setFormData((prev) => ({
      ...prev,
      icon: null,
      iconPreview: '',
    }))
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Facility name is required'
    }

    if (formData.branches.length === 0) {
      newErrors.branches = 'Select at least one branch'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError('')

    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)

      const submitData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        branches: formData.branches,
      } as any

      if (formData.icon) {
        submitData.icon = formData.icon
      }

      await onSubmit(submitData)
      setFormData({
        name: '',
        description: '',
        icon: null,
        iconPreview: '',
        branches: [],
      })
    } catch (error: any) {
      setSubmitError(error.message || 'Failed to save facility')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-primary to-secondary text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Zap size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {facility ? 'Edit Facility' : 'Add New Facility'}
              </h2>
              <p className="text-sm text-white/80 mt-0.5">Manage branch facilities and amenities</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {submitError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {submitError}
            </div>
          )}

          {/* Facility Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Facility Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="e.g., Free WiFi"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-gray-900 placeholder-gray-500"
            />
            <FormError errors={errors} fieldName="name" />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Description
            </label>
            <textarea
              name="description"
              placeholder="e.g., Free high-speed WiFi available at all branch locations"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-gray-900 placeholder-gray-500 resize-none"
            />
          </div>

          {/* Icon Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Facility Icon
            </label>
            <div className="flex gap-4">
              <div className="flex-1">
                {formData.iconPreview ? (
                  <div className="space-y-3">
                    <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden border-2 border-primary/30 flex items-center justify-center">
                      <img
                        src={formData.iconPreview}
                        alt="Icon preview"
                        className="w-full h-full object-contain p-2"
                      />
                    </div>
                    <div className="flex gap-2">
                      <label className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 cursor-pointer text-center font-semibold transition-colors">
                        Change Icon
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleIconChange}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={handleRemoveIcon}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-semibold transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-primary/40 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors bg-gradient-to-br from-primary/5 to-secondary/5">
                    <Upload size={32} className="mx-auto text-primary/60 mb-2" />
                    <p className="text-sm text-gray-700 font-semibold">Click to upload icon</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleIconChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Branches Multi-Select */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Branches <span className="text-red-500">*</span>
            </label>
            <MultiSelect
              value={formData.branches}
              onChange={(branches) => {
                setFormData((prev) => ({ ...prev, branches }))
                if (errors.branches) {
                  setErrors((prev) => {
                    const newErrors = { ...prev }
                    delete newErrors.branches
                    return newErrors
                  })
                }
              }}
              options={branches}
              placeholder="Select branches to add this facility"
              isLoading={branchesLoading}
              maxHeight={350}
            />
            <FormError errors={errors} fieldName="branches" />
            {formData.branches.length > 0 && (
              <p className="text-xs text-gray-600 mt-2">
                {formData.branches.length} branch{formData.branches.length !== 1 ? 'es' : ''} selected
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : facility ? 'Update Facility' : 'Create Facility'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
