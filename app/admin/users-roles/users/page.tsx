'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AdminLayout } from '@/components/admin/admin-layout'
import { useRolesPermissions } from '@/lib/hooks/useRolesPermissions'
import { UsersTable } from '@/components/admin/users-management/users-table'
import { UserForm } from '@/components/admin/users-management/user-form'
import { Plus, ArrowLeft } from 'lucide-react'
import { User } from '@/lib/types/roles-permissions'

export default function UsersPage() {
  const { users, roles, isLoading, addUser, updateUser, deleteUser, assignRolesToUser } = useRolesPermissions()
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddUser = (data: { name: string; email: string; password: string; roleIds: string[] }) => {
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: data.name,
      email: data.email,
      password: data.password,
      roles: roles.filter((r) => data.roleIds.includes(r.id)),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    addUser(newUser)
    setShowForm(false)
  }

  const handleEditUser = (data: { name: string; email: string; password: string; roleIds: string[] }) => {
    if (!editingUser) return
    updateUser(editingUser.id, {
      name: data.name,
      email: data.email,
      password: data.password,
      roles: roles.filter((r) => data.roleIds.includes(r.id)),
    })
    setEditingUser(null)
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
          className="flex items-center gap-2 px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors font-semibold"
        >
          <ArrowLeft size={20} />
          Back
        </Link>

        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-lg p-6 shadow-lg text-white flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold">Users Management</h1>
            <p className="text-red-100 mt-1">Manage admin users, assign roles, and control access</p>
          </div>
          <button
            onClick={() => {
              setEditingUser(null)
              setShowForm(true)
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white text-red-600 rounded-lg hover:bg-red-50 font-bold transition-colors whitespace-nowrap"
          >
            <Plus size={20} />
            Add User
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>

        {/* Users Table */}
        <UsersTable
          users={filteredUsers}
          roles={roles}
          onEdit={(user) => {
            setEditingUser(user)
            setShowForm(true)
          }}
          onDelete={deleteUser}
          onToggleActive={(userId, isActive) => updateUser(userId, { isActive })}
          onAssignRoles={assignRolesToUser}
        />

        {/* Form Modal */}
        {showForm && (
          <UserForm
            user={editingUser}
            roles={roles}
            onSubmit={editingUser ? handleEditUser : handleAddUser}
            onClose={() => {
              setShowForm(false)
              setEditingUser(null)
            }}
          />
        )}
      </div>
    </AdminLayout>
  )
}
