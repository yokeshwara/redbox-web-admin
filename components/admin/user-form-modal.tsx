'use client'

import { useState, useEffect } from 'react'
import { X, Eye, EyeOff } from 'lucide-react'
import { FormError } from './form-error'
import { validateUserForm } from '@/lib/validation'

interface UserFormModalProps {
  user?: any
  onSubmit: (data: any) => void
  onClose: () => void
}

export function UserFormModal({ user, onSubmit, onClose }: UserFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Staff',
    branch: 'Downtown Branch',
    status: 'Active',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    if (user) {
      setFormData({ ...user, password: '' })
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    const validation = validateUserForm(formData)
    
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }
    
    // Clear errors on successful validation
    setErrors({})
    
    if (user && !formData.password) {
      const { password, ...dataToSubmit } = formData
      onSubmit(dataToSubmit)
    } else {
      onSubmit(formData)
    }
  }

  const roles = ['Administrator', 'Branch Manager', 'Content Manager', 'Staff']
  const branches = ['All Branches', 'Downtown Branch', 'Westside Branch', 'Eastend Branch']
  const statuses = ['Active', 'Inactive']

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="modal-card max-w-3xl w-full max-h-[95vh] overflow-y-auto">

        {/* Header */}
        <div className="modal-header bg-gradient-to-r from-red-600 to-red-500">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-xl">
              <X size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {user ? 'Edit User' : 'Add New User'}
              </h2>
              <p className="text-sm text-white/80 mt-0.5">Manage staff users and permissions</p>
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
            <h3 className="text-lg font-bold text-foreground">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FormInput
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                />
                <FormError errors={errors} fieldName="name" />
              </div>
              <div>
                <FormInput
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="user@redbox.com"
                  required
                />
                <FormError errors={errors} fieldName="email" />
              </div>
              <div>
                <FormInput
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91-9876543210"
                  required
                />
                <FormError errors={errors} fieldName="phone" />
              </div>
            </div>
          </div>

          {/* Credentials */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">
              {user ? 'Update Password' : 'Credentials'}
            </h3>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Password
                {user && (
                  <span className="text-xs text-muted-foreground ml-2">
                    (Leave empty to keep current)
                  </span>
                )}
                {!user && <span className="text-destructive ml-1">*</span>}
              </label>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={
                    user ? 'Leave empty to keep current' : 'Enter secure password'
                  }
                  className="w-full px-4 py-2 bg-white border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all pr-12"
                  required={!user}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>

          {/* Role & Assignment */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">
              Role & Assignment
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    Role <span className="text-primary">*</span>
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  >
                    {roles.map((role) => (
                      <option key={role} value={role} className="bg-white text-foreground">
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
                <FormError errors={errors} fieldName="role" />
              </div>

              <div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    Branch <span className="text-primary">*</span>
                  </label>
                  <select
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  >
                    {branches.map((branch) => (
                      <option key={branch} value={branch} className="bg-white text-foreground">
                        {branch}
                      </option>
                    ))}
                  </select>
                </div>
                <FormError errors={errors} fieldName="branch" />
              </div>

            </div>
          </div>

          {/* Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">Status</h3>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Account Status
              </label>
              <div className="flex gap-4">
                {statuses.map((status) => (
                  <label key={status} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value={status}
                      checked={formData.status === status}
                      onChange={handleChange}
                      className="w-4 h-4 accent-primary cursor-pointer"
                    />
                    <span className="text-foreground">{status}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Role Info */}
          <div className="p-4 bg-secondary/30 border border-border rounded-lg">
            <p className="text-sm text-foreground">
              <strong>Selected Role:</strong> {formData.role}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {formData.role === 'Administrator' &&
                'Full system access with all permissions'}
              {formData.role === 'Branch Manager' &&
                'Can manage assigned branch and its staff'}
              {formData.role === 'Content Manager' &&
                'Can manage website content and announcements'}
              {formData.role === 'Staff' &&
                'Limited permissions for assigned branch operations'}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-8 border-t-2 border-border w-full">
            <button
              type="submit"
              className="btn-primary flex-1 py-3 w-full sm:w-auto"
            >
              {user ? '✓ Update User' : '+ Add User'}
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
}: any) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-primary ml-1">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 bg-white border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        required={required}
      />
    </div>
  )
}
