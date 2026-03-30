'use client'

import { useState } from 'react'
import { User, Role } from '@/lib/types/roles-permissions'
import { X } from 'lucide-react'

interface UserRolesModalProps {
  user: User
  roles: Role[]
  onConfirm: (roleIds: string[]) => void
  onClose: () => void
}

export function UserRolesModal({ user, roles, onConfirm, onClose }: UserRolesModalProps) {
  const [selectedRoleIds, setSelectedRoleIds] = useState(user.roles.map((r) => r.id))

  const toggleRole = (roleId: string) => {
    setSelectedRoleIds((prev) =>
      prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]
    )
  }

  const handleConfirm = () => {
    if (selectedRoleIds.length === 0) {
      alert('Please select at least one role')
      return
    }
    onConfirm(selectedRoleIds)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-500 px-6 py-4 text-white flex items-center justify-between">
          <h2 className="text-2xl font-bold">Assign Roles to {user.name}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-purple-700 rounded transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="space-y-3">
            {roles.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No roles available</p>
            ) : (
              roles.map((role) => (
                <label
                  key={role.id}
                  className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 cursor-pointer transition-all"
                >
                  <input
                    type="checkbox"
                    checked={selectedRoleIds.includes(role.id)}
                    onChange={() => toggleRole(role.id)}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-600"
                  />
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">{role.name}</p>
                    <p className="text-sm text-gray-600">{role.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {role.permissions.length} permissions
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    role.isActive
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {role.isActive ? 'Active' : 'Inactive'}
                  </span>
                </label>
              ))
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleConfirm}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold rounded-lg hover:shadow-lg transition-all"
          >
            Assign Selected Roles
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
