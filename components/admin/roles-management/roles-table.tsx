'use client'

import { Role } from '@/lib/types/roles-permissions'
import { Edit2, Trash2, Power, Lock } from 'lucide-react'

interface RolesTableProps {
  roles: Role[]
  onEdit: (role: Role) => void
  onDelete: (roleId: string) => void
  onToggleActive: (roleId: string, isActive: boolean) => void
  onManagePermissions: (role: Role) => void
}

export function RolesTable({
  roles,
  onEdit,
  onDelete,
  onToggleActive,
  onManagePermissions,
}: RolesTableProps) {
  return (
    <div className="bg-white border-2 border-red-200 rounded-lg overflow-hidden shadow-lg">
      <div className="bg-gradient-to-r from-red-100 to-red-50 px-6 py-4 border-b-2 border-red-200">
        <h3 className="text-lg font-bold text-red-700">All Roles ({roles.length})</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Role Name</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Type</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Description</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Permissions</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Status</th>
              <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-red-100">
            {roles.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No roles found
                </td>
              </tr>
            ) : (
              roles.map((role) => (
                <tr key={role.id} className="hover:bg-red-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{role.name}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold capitalize">
                      {role.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 line-clamp-2">{role.description}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">
                      {role.permissions.length} permissions
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {role.isActive ? (
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
                        onClick={() => onManagePermissions(role)}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                        title="Manage Permissions"
                      >
                        <Lock size={18} />
                      </button>
                      <button
                        onClick={() => onEdit(role)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Edit Role"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => onToggleActive(role.id, !role.isActive)}
                        className={`p-2 rounded-lg transition-colors ${
                          role.isActive
                            ? 'text-yellow-600 hover:bg-yellow-100'
                            : 'text-green-600 hover:bg-green-100'
                        }`}
                        title={role.isActive ? 'Deactivate' : 'Activate'}
                      >
                        <Power size={18} />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this role?')) {
                            onDelete(role.id)
                          }
                        }}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Delete Role"
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
  )
}
