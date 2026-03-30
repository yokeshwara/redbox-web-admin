'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { DataTable } from '@/components/admin/data-table'
import { Pagination } from '@/components/admin/pagination'
import { Plus, Search } from 'lucide-react'
import { UserFormModal } from '@/components/admin/user-form-modal'
import { usersAPI } from '@/lib/api/users'
import { useToast } from '@/hooks/use-toast'

export default function UsersPage() {
  const { toast } = useToast()
  const [users, setUsers] = useState<any[]>([])
  const [filteredUsers, setFilteredUsers] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const itemsPerPage = 5

  // Load users from API
  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setLoading(true)
    try {
      const data = await usersAPI.list(1, 100)
      const usersList = Array.isArray(data) ? data : data.results || []
      setUsers(usersList)
      setFilteredUsers(usersList)
    } catch (error: any) {
      console.error('Error loading users:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to load users',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let filtered = users.filter(
      (user) =>
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    if (roleFilter !== 'All') {
      filtered = filtered.filter((user) => user.role === roleFilter)
    }
    setFilteredUsers(filtered)
  }, [searchTerm, roleFilter, users])

  const handleAddUser = async (formData: any) => {
    setSubmitting(true)
    try {
      if (editingUser) {
        const updated = await usersAPI.update(editingUser.id, formData)
        setUsers(users.map((u) => (u.id === editingUser.id ? updated : u)))
        toast({
          title: 'Success',
          description: 'User updated successfully',
        })
      } else {
        const newUser = await usersAPI.create(formData)
        setUsers([...users, newUser])
        toast({
          title: 'Success',
          description: 'User created successfully',
        })
      }
      setEditingUser(null)
      setShowModal(false)
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save user',
        variant: 'destructive',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (user: any) => {
    setEditingUser(user)
    setShowModal(true)
  }

  const handleDelete = async (user: any) => {
    if (confirm(`Are you sure you want to delete ${user.full_name}?`)) {
      try {
        await usersAPI.delete(user.id)
        setUsers(users.filter((u) => u.id !== user.id))
        toast({
          title: 'Success',
          description: 'User deleted successfully',
        })
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to delete user',
          variant: 'destructive',
        })
      }
    }
  }

  const roles = ['All', 'Administrator', 'Branch Manager', 'Staff', 'Content Manager']

  const columns = [
    { header: 'Name', accessor: 'full_name', width: '180px', render: (value: string) => <span className="font-semibold text-black">{value}</span> },
    { header: 'Email', accessor: 'email', width: '220px', render: (value: string) => <span className="text-gray-700">{value}</span> },
    { header: 'Phone', accessor: 'phone', width: '150px', render: (value: string) => <span className="text-gray-700">{value}</span> },
    { header: 'Role', accessor: 'role', width: '160px', render: (value: string) => (
      <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap inline-block ${getRoleColor(value)}`}>
        {value}
      </span>
    ) },
  ]

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center py-12">
          <p className="text-gray-500">Loading users...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-lg p-4 md:p-6 shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-white">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold whitespace-nowrap">User & Role Management</h1>
            <p className="text-xs md:text-base text-red-100 mt-1">Manage staff users and permissions</p>
          </div>
          <button
            onClick={() => {
              setEditingUser(null)
              setShowModal(true)
            }}
            className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-white text-red-600 rounded-lg font-bold hover:bg-red-50 transition-all shadow-md whitespace-nowrap"
          >
            <Plus size={18} className="md:block hidden" />
            <Plus size={16} className="md:hidden" />
            <span className="text-sm md:text-base">Add User</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 md:gap-4">
          <div className="flex-1 flex items-center gap-2 bg-white border-2 border-primary/30 rounded-lg px-4 py-3 hover:border-primary/60 transition-colors">
            <Search size={18} className="text-primary flex-shrink-0" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent outline-none text-foreground placeholder-muted-foreground"
            />
          </div>
          <div className="flex items-center gap-2 bg-white border-2 border-primary/30 rounded-lg px-4 py-3">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-transparent outline-none text-foreground cursor-pointer"
            >
              {roles.map((role) => (
                <option key={role} value={role} className="bg-white text-foreground">
                  {role}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Mobile: Add User Button */}
        <div className="md:hidden">
          <button
            onClick={() => {
              setEditingUser(null)
              setShowModal(true)
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-all shadow-md"
          >
            <Plus size={16} />
            <span>Add User</span>
          </button>
        </div>

        {/* Data Table */}
        <div className="border-2 border-primary/30 rounded-lg overflow-hidden">
          <DataTable
            columns={columns}
            data={filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredUsers.length / itemsPerPage)}
            onPageChange={setCurrentPage}
            totalItems={filteredUsers.length}
            itemsPerPage={itemsPerPage}
          />
        </div>

        {/* Role Permissions Info */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Role Permissions Guide</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PermissionBox
              role="Administrator"
              permissions={['Full system access', 'Manage all branches', 'Manage users and roles', 'View all reports']}
            />
            <PermissionBox
              role="Branch Manager"
              permissions={['Manage assigned branch', 'View branch reports', 'Manage branch staff', 'Update branch details']}
            />
            <PermissionBox
              role="Content Manager"
              permissions={['Manage website content', 'Update banners and text', 'Manage contact info', 'View analytics']}
            />
            <PermissionBox
              role="Staff"
              permissions={['View branch operations', 'Update menu availability', 'View basic reports', 'Limited to assigned branch']}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatBox label="Total Users" value={users.length.toString()} />
          <StatBox label="Administrators" value={users.filter((u) => u.role === 'ADMIN' || u.role === 'Administrator').length.toString()} />
          <StatBox label="Branch Managers" value={users.filter((u) => u.role === 'MANAGER' || u.role === 'Branch Manager').length.toString()} />
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <UserFormModal
          user={editingUser}
          isSubmitting={submitting}
          onSubmit={handleAddUser}
          onClose={() => {
            setShowModal(false)
            setEditingUser(null)
          }}
        />
      )}
    </AdminLayout>
  )
}

function getRoleColor(role: string): string {
  const colors: any = {
    Administrator: 'bg-red-500/20 text-red-500',
    'Branch Manager': 'bg-blue-500/20 text-blue-500',
    'Content Manager': 'bg-purple-500/20 text-purple-500',
    Staff: 'bg-green-500/20 text-green-500',
  }
  return colors[role] || 'bg-gray-500/20 text-gray-500'
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <p className="text-muted-foreground text-sm mb-2">{label}</p>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </div>
  )
}

function PermissionBox({ role, permissions }: any) {
  return (
    <div className="p-4 bg-gradient-to-br from-red-600 to-red-500 rounded-lg border-2 border-red-400 shadow-md">
      <h4 className="font-semibold text-white mb-3">{role}</h4>
      <ul className="space-y-2">
        {permissions.map((perm: string, idx: number) => (
          <li key={idx} className="flex items-start gap-2 text-sm text-white">
            <span className="text-white mt-1">✓</span>
            <span>{perm}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
