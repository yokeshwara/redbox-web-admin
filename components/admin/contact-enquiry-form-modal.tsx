'use client'

import { useState, useEffect } from 'react'
import { X, MessageCircle, Users, FileText } from 'lucide-react'

interface ContactEnquiryFormModalProps {
  enquiry?: any
  onSubmit: (data: any) => void
  onClose: () => void
}

export function ContactEnquiryFormModal({ enquiry, onSubmit, onClose }: ContactEnquiryFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    status: 'New',
  })

  useEffect(() => {
    if (enquiry) {
      setFormData(enquiry)
    }
  }, [enquiry])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const statuses = ['New', 'In Progress', 'Resolved']

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="modal-card max-w-3xl w-full max-h-[95vh] overflow-y-auto">

        {/* Header */}
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-xl">
              <MessageCircle size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {enquiry ? 'Edit Enquiry' : 'Add Contact Enquiry'}
              </h2>
              <p className="text-sm text-white/80 mt-0.5">Manage customer and partner enquiries</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8">

          {/* Personal Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b-2 border-primary/20">
              <Users size={20} className="text-primary" />
              <h3 className="text-lg font-bold text-foreground">Personal Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                required
              />
              <FormInput
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@example.com"
                required
              />
              <FormInput
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91-9876543210"
                required
              />
            </div>
          </div>

          {/* Enquiry Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b-2 border-primary/20">
              <FileText size={20} className="text-primary" />
              <h3 className="text-lg font-bold text-foreground">Enquiry Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g., Partnership Inquiry"
                required
              />
              <div className="form-group">
                <label className="input-label">
                  Status <span className="text-primary">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="input-field"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <FormInput
              label="Message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Enter enquiry details..."
              textarea
              required
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-8 border-t-2 border-border w-full">
            <button
              type="submit"
              className="btn-primary flex-1 py-3 w-full sm:w-auto"
            >
              {enquiry ? '✓ Update Enquiry' : '+ Add Enquiry'}
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
