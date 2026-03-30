'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Pagination } from '@/components/admin/pagination'
import { Search, Eye, Trash2, X, Check, Pencil } from 'lucide-react'
import { franchisesAPI } from '@/lib/api/franchises'
import { clearToken } from '@/lib/auth'

const STATUS_OPTIONS = [
  { label: 'All', value: 'All' },
  { label: 'Pending', value: 'enquiry' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Under Review', value: 'active' },
]

function getDisplayStatus(status?: string) {
  switch ((status || '').toLowerCase()) {
    case 'enquiry':
      return 'Pending'
    case 'approved':
      return 'Approved'
    case 'rejected':
      return 'Rejected'
    case 'active':
      return 'Under Review'
    default:
      return status || '-'
  }
}

export default function FranchisesPage() {
  const router = useRouter()
  const [franchises, setFranchises] = useState<any[]>([])
  const [filteredFranchises, setFilteredFranchises] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [viewingFranchise, setViewingFranchise] = useState<any>(null)
  const [editingFranchise, setEditingFranchise] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const itemsPerPage = 10

  // Load initial data from API
  useEffect(() => {
    loadFranchises()
    loadStats()
  }, [currentPage, searchTerm])

  const loadFranchises = async () => {
    try {
      setLoading(true)
      setErrorMessage('')
      const response = await franchisesAPI.listFranchises(currentPage, 200, searchTerm)
      
      if (response.results) {
        setFranchises(response.results)
      } else if (Array.isArray(response)) {
        setFranchises(response)
      } else {
        setFranchises([])
      }
    } catch (error) {
      console.error('Error loading franchises:', error)
      const message = error instanceof Error ? error.message : 'Failed to load franchises'
      if (message.toLowerCase().includes('unauthorized')) {
        clearToken()
        router.replace('/admin/login')
        return
      }
      setErrorMessage(message)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const statsData = await franchisesAPI.getFranchiseStats()
      setStats(statsData)
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  useEffect(() => {
    let filtered = franchises.filter(
      (franchise) =>
        (franchise.full_name || franchise.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        franchise.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (franchise.location || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (franchise.phone || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
    if (statusFilter !== 'All') {
      filtered = filtered.filter((franchise) => (franchise.status || '').toLowerCase() === statusFilter.toLowerCase())
    }
    setFilteredFranchises(filtered)
  }, [searchTerm, statusFilter, franchises])

  const handleDelete = async (franchise: any) => {
    const displayName = franchise.full_name || franchise.name
    if (!confirm(`Are you sure you want to delete ${displayName}'s franchise record?`)) return

    setIsDeleting(true)
    try {
      await franchisesAPI.deleteFranchise(franchise.id)
      
      setFranchises(franchises.filter((f) => f.id !== franchise.id))
      setSuccessMessage(`${displayName}'s franchise deleted`)
      setTimeout(() => setSuccessMessage(''), 3000)
      loadStats()
    } catch (error) {
      console.error('Error deleting franchise:', error)
      const message = error instanceof Error ? error.message : 'Failed to delete franchise'
      if (message.toLowerCase().includes('unauthorized')) {
        clearToken()
        router.replace('/admin/login')
        return
      }
      setErrorMessage(message)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleView = async (franchise: any) => {
    try {
      const detail = await franchisesAPI.getFranchise(franchise.id)
      setViewingFranchise(detail)
    } catch (error) {
      console.error('Error loading franchise detail:', error)
      const message = error instanceof Error ? error.message : 'Failed to load franchise detail'
      if (message.toLowerCase().includes('unauthorized')) {
        clearToken()
        router.replace('/admin/login')
        return
      }
      setErrorMessage(message)
    }
  }

  const handleEdit = async (franchise: any) => {
    try {
      const detail = await franchisesAPI.getFranchise(franchise.id)
      setEditingFranchise({
        ...detail,
        name: detail.name || detail.full_name || '',
        investment_range: detail.investment_range || detail.investment_capacity || '',
        message: detail.message || detail.notes || '',
      })
    } catch (error) {
      console.error('Error loading franchise detail for edit:', error)
      const message = error instanceof Error ? error.message : 'Failed to load franchise detail'
      if (message.toLowerCase().includes('unauthorized')) {
        clearToken()
        router.replace('/admin/login')
        return
      }
      setErrorMessage(message)
    }
  }

  const handleSaveEdit = async () => {
    if (!editingFranchise) return

    setIsSaving(true)
    try {
      const payload = {
        name: editingFranchise.name,
        email: editingFranchise.email,
        phone: editingFranchise.phone,
        location: editingFranchise.location,
        business_experience: editingFranchise.business_experience,
        investment_range: editingFranchise.investment_range,
        status: editingFranchise.status,
        message: editingFranchise.message,
        admin_notes: editingFranchise.admin_notes,
        profile_image: editingFranchise.profile_image instanceof File ? editingFranchise.profile_image : undefined,
      }

      const updated = await franchisesAPI.updateFranchise(editingFranchise.id, payload)
      const merged = {
        ...editingFranchise,
        ...updated,
        full_name: updated.full_name || updated.name || editingFranchise.name,
        investment_capacity: updated.investment_capacity || updated.investment_range || editingFranchise.investment_range,
      }

      setFranchises((current) => current.map((item) => (item.id === editingFranchise.id ? { ...item, ...merged } : item)))
      setEditingFranchise(null)
      setSuccessMessage('Franchise updated successfully')
      setTimeout(() => setSuccessMessage(''), 3000)
      loadStats()
    } catch (error) {
      console.error('Error updating franchise:', error)
      const message = error instanceof Error ? error.message : 'Failed to update franchise'
      if (message.toLowerCase().includes('unauthorized')) {
        clearToken()
        router.replace('/admin/login')
        return
      }
      setErrorMessage(message)
    } finally {
      setIsSaving(false)
    }
  }

  const statusColors: any = {
    'Pending': 'bg-yellow-500/20 text-yellow-500',
    'Approved': 'bg-green-500/20 text-green-500',
    'Rejected': 'bg-red-500/20 text-red-500',
    'Under Review': 'bg-blue-500/20 text-blue-500',
  }

  const columns = [
    { 
      header: 'Name', 
      accessor: 'full_name', 
      width: '180px', 
      render: (value: string) => <span className="font-bold text-gray-900">{value}</span> 
    },
    { 
      header: 'Email', 
      accessor: 'email', 
      width: '220px', 
      render: (value: string) => <span className="text-gray-700 text-sm">{value}</span> 
    },
    { 
      header: 'Phone', 
      accessor: 'phone', 
      width: '150px', 
      render: (value: string) => <span className="text-gray-700 text-sm">{value}</span> 
    },
    { 
      header: 'Location', 
      accessor: 'location', 
      width: '140px', 
      render: (value: string) => <span className="text-gray-700 font-medium">{value}</span> 
    },
    { 
      header: 'Experience', 
      accessor: 'business_experience', 
      width: '150px', 
      render: (value: string) => <span className="text-gray-700 text-sm">{value}</span> 
    },
    { 
      header: 'Investment', 
      accessor: 'investment_capacity', 
      width: '150px', 
      render: (value: string) => <span className="font-semibold text-gray-800 text-sm">{value}</span> 
    },
    {
      header: 'Status',
      accessor: 'status',
      width: '130px',
      render: (value: string) => (
        <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap inline-block ${statusColors[value]}`}>
          {value}
        </span>
      ),
    },
  ]

  return (
    <AdminLayout>
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-lg p-4 md:p-6 shadow-lg flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4 text-white">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold whitespace-nowrap">Franchise Management</h1>
            <p className="text-xs md:text-base text-red-100 mt-1">View and manage franchise records</p>
          </div>
        </div>

        {/* Filters */}
        {errorMessage && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-3 md:gap-4">
          <div className="flex-1 flex items-center gap-2 bg-white border-2 border-primary/30 rounded-lg px-4 py-3 hover:border-primary/60 transition-colors">
            <Search size={18} className="text-primary flex-shrink-0" />
            <input
              type="text"
              placeholder="Search by name, email, phone, or location..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="flex-1 bg-transparent outline-none text-foreground placeholder-muted-foreground"
            />
          </div>
          <div className="flex items-center gap-2 bg-white border-2 border-primary/30 rounded-lg px-4 py-3">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="bg-transparent outline-none text-foreground cursor-pointer"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status.value} value={status.value} className="bg-white text-foreground">
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-3">
              <div className="animate-spin inline-flex items-center justify-center w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full"></div>
              <p className="text-muted-foreground">Loading franchises...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Data Table */}
            <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b-2 border-primary/20">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Location</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Experience</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Investment</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredFranchises.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((franchise) => (
                      <tr key={franchise.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">{franchise.full_name || franchise.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{franchise.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{franchise.location}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{franchise.business_experience}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{franchise.investment_capacity || franchise.investment_range}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${statusColors[getDisplayStatus(franchise.status)]}`}>
                            {getDisplayStatus(franchise.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                          <button
                            onClick={() => void handleView(franchise)}
                            className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors font-semibold flex items-center gap-1"
                          >
                              <Eye size={14} />
                              View
                            </button>
                            <button
                              onClick={() => void handleEdit(franchise)}
                              className="px-3 py-1 text-xs bg-amber-100 text-amber-700 rounded hover:bg-amber-200 transition-colors font-semibold flex items-center gap-1"
                            >
                              <Pencil size={14} />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(franchise)}
                              disabled={isDeleting}
                              className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors font-semibold flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {Math.ceil(filteredFranchises.length / itemsPerPage) > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredFranchises.length / itemsPerPage)}
                onPageChange={setCurrentPage}
                totalItems={filteredFranchises.length}
                itemsPerPage={itemsPerPage}
              />
            )}
          </>
        )}

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatBox label="Total Franchises" value={(stats.total_franchises || stats.total)?.toString() || '0'} />
            <StatBox
              label="Approved"
              value={(stats.approved_count || stats.approved)?.toString() || '0'}
            />
            <StatBox
              label="Pending"
              value={(stats.pending_count || stats.enquiry)?.toString() || '0'}
            />
            <StatBox
              label="Active"
              value={(stats.active_count || stats.active)?.toString() || '0'}
            />
          </div>
        )}
      </div>

      {viewingFranchise && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Franchise Details</h2>
              <button onClick={() => setViewingFranchise(null)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {viewingFranchise.profile_image && (
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-3">Profile Photo</p>
                  <img
                    src={viewingFranchise.profile_image}
                    alt={viewingFranchise.full_name || viewingFranchise.name || 'Franchise applicant'}
                    className="h-40 w-40 rounded-2xl object-cover border border-gray-200 shadow-sm"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-1">Name</p>
                  <p className="text-lg text-gray-900">{viewingFranchise.full_name || viewingFranchise.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-1">Phone</p>
                  <p className="text-lg text-gray-900">{viewingFranchise.phone || '-'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-1">Email</p>
                  <p className="text-lg text-gray-900">{viewingFranchise.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-1">Location</p>
                  <p className="text-lg text-gray-900">{viewingFranchise.location}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-1">Business Experience</p>
                  <p className="text-gray-900">{viewingFranchise.business_experience || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-1">Investment Range</p>
                  <p className="text-gray-900">{viewingFranchise.investment_capacity || viewingFranchise.investment_range || '-'}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 font-semibold mb-1">Status</p>
                <p className="text-gray-900">{getDisplayStatus(viewingFranchise.status)}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 font-semibold mb-1">Message</p>
                <p className="text-gray-900 whitespace-pre-wrap">{viewingFranchise.notes || viewingFranchise.message || '-'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 font-semibold mb-1">Admin Notes</p>
                <p className="text-gray-900 whitespace-pre-wrap">{viewingFranchise.admin_notes || '-'}</p>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setViewingFranchise(null)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {editingFranchise && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Edit Franchise</h2>
              <button onClick={() => setEditingFranchise(null)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={editingFranchise.name || ''}
                  onChange={(e) => setEditingFranchise((current: any) => ({ ...current, name: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={editingFranchise.email || ''}
                  onChange={(e) => setEditingFranchise((current: any) => ({ ...current, email: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                <input
                  type="text"
                  value={editingFranchise.phone || ''}
                  onChange={(e) => setEditingFranchise((current: any) => ({ ...current, phone: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={editingFranchise.location || ''}
                  onChange={(e) => setEditingFranchise((current: any) => ({ ...current, location: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Business Experience</label>
                <input
                  type="text"
                  value={editingFranchise.business_experience || ''}
                  onChange={(e) => setEditingFranchise((current: any) => ({ ...current, business_experience: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Investment Range</label>
                <input
                  type="text"
                  value={editingFranchise.investment_range || ''}
                  onChange={(e) => setEditingFranchise((current: any) => ({ ...current, investment_range: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                <select
                  value={editingFranchise.status || 'enquiry'}
                  onChange={(e) => setEditingFranchise((current: any) => ({ ...current, status: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-primary bg-white"
                >
                  <option value="enquiry">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="active">Under Review</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Profile Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setEditingFranchise((current: any) => ({ ...current, profile_image: file }))
                    }
                  }}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-primary"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                <textarea
                  value={editingFranchise.message || ''}
                  onChange={(e) => setEditingFranchise((current: any) => ({ ...current, message: e.target.value }))}
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-primary resize-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Admin Notes</label>
                <textarea
                  value={editingFranchise.admin_notes || ''}
                  onChange={(e) => setEditingFranchise((current: any) => ({ ...current, admin_notes: e.target.value }))}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-primary resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setEditingFranchise(null)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => void handleSaveEdit()}
                disabled={isSaving}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Message Toast */}
      {successMessage && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <Check size={20} />
          <p className="font-semibold">{successMessage}</p>
        </div>
      )}
    </AdminLayout>
  )
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <p className="text-muted-foreground text-sm mb-2">{label}</p>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </div>
  )
}
