'use client'

import { useState, useEffect } from 'react'
import { X, Tag } from 'lucide-react'

interface PromotionFormModalProps {
  item?: any
  onSubmit: (data: any) => void
  onClose: () => void
}

export function PromotionFormModal({ item, onSubmit, onClose }: PromotionFormModalProps) {
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'Percentage',
    value: '',
    minOrder: '',
    maxDiscount: '',
    usageLimit: '',
    startDate: '',
    endDate: '',
    description: '',
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
      value: parseInt(formData.value),
      minOrder: parseInt(formData.minOrder),
      maxDiscount: parseInt(formData.maxDiscount),
      usageLimit: parseInt(formData.usageLimit),
    })
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="modal-card max-w-3xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-xl">
              <Tag size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {item ? 'Edit Promotion' : 'Add Promotion'}
              </h2>
              <p className="text-sm text-white/80 mt-0.5">Manage promotional codes and discounts</p>
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
              <Tag size={20} className="text-primary" />
              <h3 className="text-lg font-bold text-foreground">Promotion Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Promo Code *"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="e.g., SUMMER20, WELCOME10"
                required
              />
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Discount Type *</label>
                <select
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white border-2 border-primary/30 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  required
                >
                  <option value="Percentage">Percentage (%)</option>
                  <option value="Fixed">Fixed Amount (₹)</option>
                </select>
              </div>
            </div>

            <FormInput
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g., Summer sale promotion on all items"
              textarea
            />
          </div>

          {/* Discount Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">Discount Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label={`Discount Value (${formData.discountType === 'Percentage' ? '%' : '₹'}) *`}
                name="value"
                type="number"
                value={formData.value}
                onChange={handleChange}
                placeholder="0"
                required
              />
              <FormInput
                label="Max Discount Amount (₹) *"
                name="maxDiscount"
                type="number"
                value={formData.maxDiscount}
                onChange={handleChange}
                placeholder="0"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Min Order Amount (₹) *"
                name="minOrder"
                type="number"
                value={formData.minOrder}
                onChange={handleChange}
                placeholder="0"
                required
              />
              <FormInput
                label="Usage Limit *"
                name="usageLimit"
                type="number"
                value={formData.usageLimit}
                onChange={handleChange}
                placeholder="0"
                required
              />
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">Validity Period</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Start Date *"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
              <FormInput
                label="End Date *"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </div>
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
              <option value="Expired">Expired</option>
            </select>
          </div>

          {/* Summary Box */}
          <div className="p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg border-2 border-primary/20">
            <h4 className="font-semibold text-foreground mb-2">Promotion Summary</h4>
            <p className="text-sm text-foreground">
              Code: <span className="font-bold text-primary">{formData.code || 'PROMO'}</span>
              {' '} | {' '}
              Discount: <span className="font-bold text-primary">
                {formData.value}{formData.discountType === 'Percentage' ? '%' : '₹'}
              </span>
              {' '} | {' '}
              Min Order: <span className="font-bold text-primary">₹{formData.minOrder || '0'}</span>
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-8 border-t-2 border-border w-full">
            <button
              type="submit"
              className="btn-primary flex-1 py-3 w-full sm:w-auto"
            >
              {item ? '✓ Update Promotion' : '+ Add Promotion'}
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
