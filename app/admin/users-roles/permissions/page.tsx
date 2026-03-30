'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AdminLayout } from '@/components/admin/admin-layout'
import { useRolesPermissions } from '@/lib/hooks/useRolesPermissions'
import { Plus, Edit2, Trash2, ArrowLeft } from 'lucide-react'
import { Permission } from '@/lib/types/roles-permissions'

export default function PermissionsPage() {
  const { permissions = [], isLoading, addPermission, updatePermission, deletePermission } = useRolesPermissions()
  const [showForm, setShowForm] = useState(false)
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({ module: '', action: '', description: '' })

  const filteredPermissions = permissions.filter(
    (permission) =>
      permission.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddPermission = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.module.trim() || !formData.action.trim()) return

    const newPermission: Permission = {
      id: `${formData.module}_${formData.action}`,
      module: formData.module as any,
      action: formData.action as any,
      description: formData.description,
    }

    addPermission(newPermission)
    setFormData({ module: '', action: '', description: '' })
    setShowForm(false)
  }

  const handleEditPermission = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingPermission || !formData.module.trim() || !formData.action.trim()) return

    updatePermission(editingPermission.id, {
      module: formData.module,
      action: formData.action,
      description: formData.description,
    })
    setFormData({ module: '', action: '', description: '' })
    setEditingPermission(null)
    setShowForm(false)
  }

  const startEdit = (permission: Permission) => {
    setEditingPermission(permission)
    setFormData({ module: permission.module, action: permission.action, description: permission.description })
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({ module: '', action: '', description: '' })
    setEditingPermission(null)
    setShowForm(false)
  }

  if (isLoading) {
    return <AdminLayout>Loading...</AdminLayout>
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <Link
          href="/admin/users-roles"
          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors font-semibold"
        >
          <ArrowLeft size={20} />
          Back
        </Link>

        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-lg p-6 shadow-lg text-white flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold">Permissions</h1>
            <p className="text-red-100 mt-1">Define and manage system permissions</p>
          </div>
          <button
            onClick={() => {
              setEditingPermission(null)
              setFormData({ module: '', action: '', description: '' })
              setShowForm(true)
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white text-red-600 rounded-lg hover:bg-red-50 font-bold transition-colors whitespace-nowrap"
          >
            <Plus size={20} />
            Add Permission
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <input
            type="text"
            placeholder="Search permissions by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>

        {/* Permissions Table */}
        <div className="bg-white border-2 border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Module</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Action</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Description</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPermissions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      No permissions found.
                    </td>
                  </tr>
                ) : (
                  filteredPermissions.map((permission) => (
                    <tr key={permission.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900">{permission.module}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          {permission.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{permission.description}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => startEdit(permission)}
                            className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-blue-600"
                            title="Edit permission"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => deletePermission(permission.id)}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                            title="Delete permission"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {editingPermission ? 'Edit Permission' : 'Add New Permission'}
              </h2>

              <form onSubmit={editingPermission ? handleEditPermission : handleAddPermission} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Module *</label>
                  <input
                    type="text"
                    value={formData.module}
                    onChange={(e) => setFormData({ ...formData, module: e.target.value })}
                    placeholder="e.g., users, blog, testimonial"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Action *</label>
                  <select
                    value={formData.action}
                    onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                    required
                  >
                    <option value="">Select action</option>
                    <option value="view">View</option>
                    <option value="create">Create</option>
                    <option value="edit">Edit</option>
                    <option value="delete">Delete</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe what this permission allows..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition-colors"
                  >
                    {editingPermission ? 'Update' : 'Create'} Permission
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
