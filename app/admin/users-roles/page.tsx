'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Users, Lock, ShieldAlert } from 'lucide-react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { useRolesPermissions } from '@/lib/hooks/useRolesPermissions'
import { DEFAULT_PERMISSIONS } from '@/lib/utils/permissions'

export default function UsersRolesPage() {
  const { users = [], roles = [], isLoading } = useRolesPermissions()
  const permissions = DEFAULT_PERMISSIONS || []

  return (
    <AdminLayout>
      <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-lg p-6 shadow-lg text-white">
        <h1 className="text-4xl font-bold">Users & Roles</h1>
        <p className="text-red-100 mt-1">Manage system users, roles, and permissions</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Users Card */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Users</p>
              <p className="text-4xl font-bold text-gray-900 mt-2">{users.length}</p>
            </div>
            <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="text-blue-600" size={28} />
            </div>
          </div>
        </div>

        {/* Total Roles Card */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Roles</p>
              <p className="text-4xl font-bold text-gray-900 mt-2">{roles.length}</p>
            </div>
            <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center">
              <Lock className="text-purple-600" size={28} />
            </div>
          </div>
        </div>

        {/* Total Permissions Card */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Permissions</p>
              <p className="text-4xl font-bold text-gray-900 mt-2">{permissions.length}</p>
            </div>
            <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center">
              <ShieldAlert className="text-green-600" size={28} />
            </div>
          </div>
        </div>
      </div>

      {/* Management Sections */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Management Sections</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Roles Management Card */}
          <Link href="/admin/users-roles/roles" className="group">
            <div className="bg-white border-2 border-purple-400 rounded-xl p-6 shadow-sm hover:shadow-lg hover:border-purple-500 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Roles Management</h3>
                  <p className="text-gray-600 text-sm mt-2">Create and configure roles with custom permissions</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <Lock className="text-purple-600" size={20} />
                </div>
              </div>
              <div className="text-red-600 font-bold hover:text-red-700 flex items-center gap-1">
                Manage →
              </div>
            </div>
          </Link>

          {/* Users Management Card */}
          <Link href="/admin/users-roles/users" className="group">
            <div className="bg-white border-2 border-blue-400 rounded-xl p-6 shadow-sm hover:shadow-lg hover:border-blue-500 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Users Management</h3>
                  <p className="text-gray-600 text-sm mt-2">Manage admin users, assign roles, and control access</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <Users className="text-blue-600" size={20} />
                </div>
              </div>
              <div className="text-red-600 font-bold hover:text-red-700 flex items-center gap-1">
                Manage →
              </div>
            </div>
          </Link>

          {/* Permissions Management Card */}
          <Link href="/admin/users-roles/permissions" className="group">
            <div className="bg-white border-2 border-green-400 rounded-xl p-6 shadow-sm hover:shadow-lg hover:border-green-500 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Permissions</h3>
                  <p className="text-gray-600 text-sm mt-2">Define and manage system permissions</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <ShieldAlert className="text-green-600" size={20} />
                </div>
              </div>
              <div className="text-red-600 font-bold hover:text-red-700 flex items-center gap-1">
                Manage →
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
    </AdminLayout>
  )
}
