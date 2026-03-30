'use client'

import { useState, useMemo } from 'react'
import { Role } from '@/lib/types/roles-permissions'
import { DEFAULT_PERMISSIONS, getAllModules } from '@/lib/utils/permissions'
import { X } from 'lucide-react'

interface RolePermissionsModalProps {
  role: Role
  onAssignPermissions: (permissionIds: string[]) => void
  onClose: () => void
}

export function RolePermissionsModal({
  role,
  onAssignPermissions,
  onClose,
}: RolePermissionsModalProps) {
  const [selectedPermissionIds, setSelectedPermissionIds] = useState(
    role.permissions.map((p) => p.id)
  )
  const modules = useMemo(() => getAllModules(), [])

  const togglePermission = (permissionId: string) => {
    setSelectedPermissionIds((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    )
  }

  const toggleModule = (moduleName: string) => {
    const modulePermissions = DEFAULT_PERMISSIONS.filter((p) => p.module === moduleName)
    const allSelected = modulePermissions.every((p) => selectedPermissionIds.includes(p.id))

    if (allSelected) {
      // Deselect all permissions in this module
      setSelectedPermissionIds((prev) =>
        prev.filter((id) => !modulePermissions.some((p) => p.id === id))
      )
    } else {
      // Select all permissions in this module
      setSelectedPermissionIds((prev) => [
        ...new Set([...prev, ...modulePermissions.map((p) => p.id)]),
      ])
    }
  }

  const handleConfirm = () => {
    onAssignPermissions(selectedPermissionIds)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-500 px-6 py-4 text-white flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-2xl font-bold">Manage Permissions for {role.name}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-green-700 rounded transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-6">
            {modules.map((module) => {
              const modulePermissions = DEFAULT_PERMISSIONS.filter((p) => p.module === module)
              const allSelected = modulePermissions.every((p) =>
                selectedPermissionIds.includes(p.id)
              )
              const someSelected = modulePermissions.some((p) =>
                selectedPermissionIds.includes(p.id)
              )

              return (
                <div key={module} className="border-2 border-gray-200 rounded-lg p-4">
                  {/* Module Header */}
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-gray-200">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      indeterminate={someSelected && !allSelected}
                      onChange={() => toggleModule(module)}
                      className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-600"
                    />
                    <h3 className="text-lg font-bold text-gray-900 capitalize">
                      {module.replace('_', ' ')} Management
                    </h3>
                    <span className="ml-auto text-sm text-gray-600">
                      {modulePermissions.filter((p) => selectedPermissionIds.includes(p.id))
                        .length}/{' '}
                      {modulePermissions.length}
                    </span>
                  </div>

                  {/* Module Permissions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {modulePermissions.map((permission) => (
                      <label
                        key={permission.id}
                        className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedPermissionIds.includes(permission.id)}
                          onChange={() => togglePermission(permission.id)}
                          className="w-4 h-4 text-green-600 rounded focus:ring-2 focus:ring-green-600"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 capitalize">
                            {permission.action}
                          </p>
                          <p className="text-xs text-gray-600 truncate">
                            {permission.description}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Summary */}
          <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Permissions Selected:</strong> {selectedPermissionIds.length} out of{' '}
              {DEFAULT_PERMISSIONS.length}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 p-6 border-t border-gray-200 bg-gray-50 sticky bottom-0">
          <button
            onClick={handleConfirm}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold rounded-lg hover:shadow-lg transition-all"
          >
            Save Permissions
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
