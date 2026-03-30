'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AdminLayout } from '@/components/admin/admin-layout'
import { useRolesPermissions } from '@/lib/hooks/useRolesPermissions'
import { RolesTable } from '@/components/admin/roles-management/roles-table'
import { RoleForm } from '@/components/admin/roles-management/role-form'
import { RolePermissionsModal } from '@/components/admin/roles-management/role-permissions-modal'
import { Plus, ArrowLeft } from 'lucide-react'
import { Role } from '@/lib/types/roles-permissions'

export default function RolesPage() {
  const { roles, isLoading, addRole, updateRole, deleteRole, assignPermissionsToRole } = useRolesPermissions()
  const [showForm, setShowForm] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [showPermissionsModal, setShowPermissionsModal] = useState(false)
  const [selectedRoleForPermissions, setSelectedRoleForPermissions] = useState<Role | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddRole = (data: { name: string; description: string }) => {
    const newRole: Role = {
      id: `role_${Date.now()}`,
      name: data.name,
      type: 'content_manager',
      description: data.description,
      permissions: [],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    addRole(newRole)
    setShowForm(false)
  }

  const handleEditRole = (data: { name: string; description: string }) => {
    if (!editingRole) return
    updateRole(editingRole.id, {
      name: data.name,
      description: data.description,
    })
    setEditingRole(null)
    setShowForm(false)
  }

  const handleManagePermissions = (role: Role) => {
    setSelectedRoleForPermissions(role)
    setShowPermissionsModal(true)
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
            <h1 className="text-4xl font-bold">Roles Management</h1>
            <p className="text-red-100 mt-1">Create and configure roles with custom permissions</p>
          </div>
          <button
            onClick={() => {
              setEditingRole(null)
              setShowForm(true)
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white text-red-600 rounded-lg hover:bg-red-50 font-bold transition-colors whitespace-nowrap"
          >
            <Plus size={20} />
            Add Role
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <input
            type="text"
            placeholder="Search roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>

        {/* Roles Table */}
        <RolesTable
          roles={filteredRoles}
          onEdit={(role) => {
            setEditingRole(role)
            setShowForm(true)
          }}
          onDelete={deleteRole}
          onToggleActive={(roleId, isActive) => updateRole(roleId, { isActive })}
          onManagePermissions={handleManagePermissions}
        />

        {/* Form Modal */}
        {showForm && (
          <RoleForm
            role={editingRole}
            onSubmit={editingRole ? handleEditRole : handleAddRole}
            onClose={() => {
              setShowForm(false)
              setEditingRole(null)
            }}
          />
        )}

        {/* Permissions Modal */}
        {showPermissionsModal && selectedRoleForPermissions && (
          <RolePermissionsModal
            role={selectedRoleForPermissions}
            onAssignPermissions={(permissionIds) => {
              assignPermissionsToRole(selectedRoleForPermissions.id, permissionIds)
              setShowPermissionsModal(false)
              setSelectedRoleForPermissions(null)
            }}
            onClose={() => {
              setShowPermissionsModal(false)
              setSelectedRoleForPermissions(null)
            }}
          />
        )}
      </div>
    </AdminLayout>
  )
}
