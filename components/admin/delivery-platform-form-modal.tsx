'use client'

import { useState, useEffect } from 'react'
import { X, Loader } from 'lucide-react'
import { MultiSelect } from '@/components/admin/multi-select'
import { branchesAPI } from '@/lib/api/branches'

interface DeliveryPlatformFormModalProps {
  platform?: any
  onSubmit: (data: any) => Promise<void>
  onClose: () => void
}

export function DeliveryPlatformFormModal({
  platform,
  onSubmit,
  onClose,
}: DeliveryPlatformFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    commission: '',
    status: 'active',
    icon: '',
    branches: [] as string[],
  })

  const [branches, setBranches] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [iconPreview, setIconPreview] = useState<string | null>(null)

  // Initialize form with existing data
  useEffect(() => {
    if (platform) {
      setFormData({
        name: platform.name || '',
        url: platform.url || '',
        commission: platform.commission?.toString() || '',
        status: platform.status || 'active',
        icon: platform.icon || '',
        branches: Array.isArray(platform.branches)
          ? platform.branches.map((b: any) => (typeof b === 'string' ? b : b.id))
          : [],
      })
      if (platform.icon && typeof platform.icon === 'string') {
        setIconPreview(platform.icon)
      }
    }
  }, [platform])

  // Load branches on mount
  useEffect(() => {
    const loadBranches = async () => {
      try {
        setLoading(true)
        const response = await branchesAPI.listBranches(1, 100)
        let branchList = response
        if (response.results) {
          branchList = response.results
        } else if (response.data) {
          branchList = response.data
        }

        setBranches(Array.isArray(branchList) ? branchList : [])
      } catch (err) {
        console.error('Error loading branches:', err)
        setError('Failed to load branches')
      } finally {
        setLoading(false)
      }
    }

    loadBranches()
  }, [])

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, icon: file })
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setIconPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      setError('Platform name is required')
      return
    }

    if (!formData.url.trim()) {
      setError('URL is required')
      return
    }

    try {
      setSubmitting(true)
      setError('')

      const submitData = {
        name: formData.name,
        url: formData.url,
        commission: formData.commission ? parseFloat(formData.commission) : 0,
        status: formData.status,
        icon: formData.icon,
        branches: formData.branches,
      }

      await onSubmit(submitData)
    } catch (err: any) {
      console.error('Error submitting form:', err)
      setError(err.message || 'Failed to save delivery platform')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {platform ? 'Edit Delivery Platform' : 'Add New Delivery Platform'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            disabled={submitting}
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Alert */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Platform Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Platform Name *
            </label>
            <input
              type="text"
              placeholder="e.g., Swiggy"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value })
                setError('')
              }}
              className="w-full px-3 py-2 border-2 border-primary/30 rounded-lg focus:outline-none focus:border-primary text-gray-900"
              required
            />
          </div>

          {/* Platform URL */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Platform URL *
            </label>
            <input
              type="url"
              placeholder="https://example.com"
              value={formData.url}
              onChange={(e) => {
                setFormData({ ...formData, url: e.target.value })
                setError('')
              }}
              className="w-full px-3 py-2 border-2 border-primary/30 rounded-lg focus:outline-none focus:border-primary text-gray-900"
              required
            />
          </div>

          {/* Commission */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Commission (%)
            </label>
            <input
              type="number"
              placeholder="e.g., 25"
              value={formData.commission}
              onChange={(e) => setFormData({ ...formData, commission: e.target.value })}
              step="0.01"
              min="0"
              max="100"
              className="w-full px-3 py-2 border-2 border-primary/30 rounded-lg focus:outline-none focus:border-primary text-gray-900"
            />
          </div>

          {/* Platform Icon */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Platform Icon
            </label>
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleIconChange}
                  className="w-full px-3 py-2 border-2 border-primary/30 rounded-lg focus:outline-none focus:border-primary text-gray-900 text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, SVG (recommended size: 100x100px)</p>
              </div>
              {iconPreview && (
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <img src={iconPreview} alt="icon preview" className="w-full h-full object-contain p-2" />
                </div>
              )}
            </div>
          </div>

          {/* Branches Multi-Select */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Associated Branches
            </label>
            <MultiSelect
              items={branches}
              selectedIds={formData.branches}
              onSelectionChange={(ids) => setFormData({ ...formData, branches: ids })}
              getLabel={(item) => item.name}
              getValue={(item) => item.id}
              placeholder="Select branches..."
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Select one or more branches this platform operates in
            </p>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border-2 border-primary/30 rounded-lg focus:outline-none focus:border-primary text-gray-900"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-all font-semibold disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting && <Loader size={18} className="animate-spin" />}
              {submitting ? 'Saving...' : platform ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
