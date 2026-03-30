'use client'

import { User, Role } from '@/lib/types/roles-permissions'
import { Edit2, Trash2, Power } from 'lucide-react'
import { useState } from 'react'
import { UserRolesModal } from './user-roles-modal'

interface UsersTableProps {
  users: User[]
  roles: Role[]
  onEdit: (user: User) => void
  onDelete: (userId: string) => void
  onToggleActive: (userId: string, isActive: boolean) => void
  onAssignRoles: (userId: string, roleIds: string[]) => void
}

export function UsersTable({
  users,
  roles,
  onEdit,
  onDelete,
  onToggleActive,
  onAssignRoles,
}: UsersTableProps) {
  const [showRolesModal, setShowRolesModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const handleAssignRoles = (user: User) => {
    setSelectedUser(user)
    setShowRolesModal(true)
  }

  const handleConfirmRoles = (roleIds: string[]) => {
    if (selectedUser) {
      onAssignRoles(selectedUser.id, roleIds)
    }
    setShowRolesModal(false)
    setSelectedUser(null)
  }

  return (
    <>
      <div className="bg-white border-2 border-red-200 rounded-lg overflow-hidden shadow-lg">
        <div className="bg-gradient-to-r from-red-100 to-red-50 px-6 py-4 border-b-2 border-red-200">
          <h3 className="text-lg font-bold text-red-700">All Users ({users.length})</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Name</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Email</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Roles</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Status</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-red-100">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-red-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex flex-wrap gap-1">
                        {user.roles.length > 0 ? (
                          user.roles.map((role) => (
                            <span key={role.id} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                              {role.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500 text-xs">No roles assigned</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {user.isActive ? (
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                          <Power size={14} />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">
                          <Power size={14} />
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleAssignRoles(user)}
                          className="px-3 py-1 text-xs font-bold bg-purple-100 text-purple-600 rounded hover:bg-purple-200 transition-colors"
                        >
                          Assign Roles
                        </button>
                        <button
                          onClick={() => onEdit(user)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit User"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => onToggleActive(user.id, !user.isActive)}
                          className={`p-2 rounded-lg transition-colors ${
                            user.isActive
                              ? 'text-yellow-600 hover:bg-yellow-100'
                              : 'text-green-600 hover:bg-green-100'
                          }`}
                          title={user.isActive ? 'Deactivate' : 'Activate'}
                        >
                          <Power size={18} />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this user?')) {
                              onDelete(user.id)
                            }
                          }}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete User"
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

      {/* User Roles Modal */}
      {showRolesModal && selectedUser && (
        <UserRolesModal
          user={selectedUser}
          roles={roles}
          onConfirm={handleConfirmRoles}
          onClose={() => {
            setShowRolesModal(false)
            setSelectedUser(null)
          }}
        />
      )}
    </>
  )
}
