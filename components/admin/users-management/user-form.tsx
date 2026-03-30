'use client'

import { useState } from 'react'
import { User, Role } from '@/lib/types/roles-permissions'
import { X } from 'lucide-react'

interface UserFormProps {
  user: User | null
  roles: Role[]
  onSubmit: (data: { name: string; email: string; password: string; roleIds: string[] }) => void
  onClose: () => void
}

export function UserForm({ user, roles, onSubmit, onClose }: UserFormProps) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: user?.password || '',
    roleIds: user?.roles.map((r) => r.id) || [],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!formData.password.trim()) newErrors.password = 'Password is required'
    if (formData.roleIds.length === 0) newErrors.roles = 'At least one role is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const toggleRole = (roleId: string) => {
    setFormData((prev) => ({
      ...prev,
      roleIds: prev.roleIds.includes(roleId)
        ? prev.roleIds.filter((id) => id !== roleId)
        : [...prev.roleIds, roleId],
    }))
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-500 px-6 py-4 text-white flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-2xl font-bold">{user ? 'Edit User' : 'Add New User'}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-red-700 rounded transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter user name"
            />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter user email"
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Password *</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter password"
            />
            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* Roles Selection */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">Assign Roles *</label>
            <div className="space-y-2 border border-gray-300 rounded-lg p-4 bg-gray-50">
              {roles.length === 0 ? (
                <p className="text-gray-500 text-sm">No roles available</p>
              ) : (
                roles.map((role) => (
                  <label key={role.id} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-100 rounded transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.roleIds.includes(role.id)}
                      onChange={() => toggleRole(role.id)}
                      className="w-4 h-4 text-red-600 rounded focus:ring-2 focus:ring-red-600"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{role.name}</p>
                      <p className="text-xs text-gray-600">{role.description}</p>
                    </div>
                  </label>
                ))
              )}
            </div>
            {errors.roles && <p className="text-red-600 text-sm mt-1">{errors.roles}</p>}
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold rounded-lg hover:shadow-lg transition-all"
            >
              {user ? 'Update User' : 'Create User'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
