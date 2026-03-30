'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Pagination } from '@/components/admin/pagination'
import { Search, X, Check, Eye, Edit2, Trash2 } from 'lucide-react'
import { contactAPI, type ContactEnquiry, type ContactStatus } from '@/lib/api/contact'
import { clearToken } from '@/lib/auth'
import { usersAPI } from '@/lib/api/users'

type UiStatusFilter = 'all' | ContactStatus
type AdminUserOption = { id: string; full_name: string; email: string }

const statusLabels: Record<ContactStatus, string> = {
  new: 'New',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
}

const statusColors: Record<ContactStatus, string> = {
  new: 'bg-blue-100 text-blue-800 font-semibold',
  in_progress: 'bg-yellow-100 text-yellow-800 font-semibold',
  resolved: 'bg-green-100 text-green-800 font-semibold',
  closed: 'bg-gray-200 text-gray-800 font-semibold',
}

function formatDate(value?: string) {
  if (!value) return '-'
  return new Date(value).toLocaleString()
}

export default function ContactEnquiryPage() {
  const router = useRouter()
  const [enquiries, setEnquiries] = useState<ContactEnquiry[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<UiStatusFilter>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [viewingEnquiry, setViewingEnquiry] = useState<ContactEnquiry | null>(null)
  const [editingEnquiry, setEditingEnquiry] = useState<ContactEnquiry | null>(null)
  const [editStatus, setEditStatus] = useState<ContactStatus>('new')
  const [editAssignedTo, setEditAssignedTo] = useState('')
  const [editAdminNotes, setEditAdminNotes] = useState('')
  const [adminUsers, setAdminUsers] = useState<AdminUserOption[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const itemsPerPage = 10

  const pushSuccess = (message: string) => {
    setSuccessMessage(message)
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  const loadEnquiries = async () => {
    setIsFetching(true)
    setErrorMessage('')
    try {
      const results = await contactAPI.listEnquiries(1, 200)
      setEnquiries(results)
    } catch (error) {
      console.error('Error fetching contact enquiries:', error)
      const message = error instanceof Error ? error.message : 'Failed to load contact enquiries'
      if (message.toLowerCase().includes('unauthorized')) {
        clearToken()
        router.replace('/admin/login')
        return
      }
      setErrorMessage(message)
    } finally {
      setIsFetching(false)
    }
  }

  useEffect(() => {
    void loadEnquiries()
  }, [])

  useEffect(() => {
    const loadAdminUsers = async () => {
      try {
        const result = await usersAPI.list(1, 200)
        const users = result?.data?.results || result?.results || []
        setAdminUsers(users)
      } catch (error) {
        console.error('Error fetching admin users:', error)
      }
    }

    void loadAdminUsers()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter])

  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((enquiry) => {
      const matchesSearch =
        enquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (enquiry.subject || '').toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'all' || enquiry.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [enquiries, searchTerm, statusFilter])

  const paginatedEnquiries = filteredEnquiries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleViewDetails = async (enquiry: ContactEnquiry) => {
    setIsLoading(true)
    try {
      const detail = await contactAPI.getEnquiry(enquiry.id)
      setViewingEnquiry(detail)
    } catch (error) {
      console.error('Error fetching enquiry details:', error)
      const message = error instanceof Error ? error.message : 'Failed to fetch enquiry details'
      if (message.toLowerCase().includes('unauthorized')) {
        clearToken()
        router.replace('/admin/login')
        return
      }
      setErrorMessage(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditClick = (enquiry: ContactEnquiry) => {
    setEditingEnquiry(enquiry)
    setEditStatus(enquiry.status)
    setEditAssignedTo(enquiry.assigned_to || '')
    setEditAdminNotes(enquiry.admin_notes || '')
  }

  const updateEnquiryStatus = async (enquiry: ContactEnquiry, nextStatus: ContactStatus) => {
    setIsLoading(true)
    try {
      const updated = await contactAPI.updateEnquiry(enquiry.id, { status: nextStatus })
      setEnquiries((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
      setViewingEnquiry((prev) => (prev && prev.id === updated.id ? updated : prev))
      pushSuccess(`${updated.name}'s status updated to ${statusLabels[updated.status]}`)
      setEditingEnquiry(null)
    } catch (error) {
      console.error('Error updating enquiry:', error)
      const message = error instanceof Error ? error.message : 'Failed to update enquiry'
      if (message.toLowerCase().includes('unauthorized')) {
        clearToken()
        router.replace('/admin/login')
        return
      }
      setErrorMessage(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateStatus = async () => {
    if (!editingEnquiry) return

    setIsLoading(true)
    setErrorMessage('')
    try {
      let updated = editingEnquiry

      if (updated.status !== editStatus) {
        updated = await contactAPI.updateEnquiry(updated.id, { status: editStatus })
      }

      if ((updated.assigned_to || '') !== editAssignedTo) {
        updated = await contactAPI.assignEnquiry(updated.id, editAssignedTo || null)
      }

      if ((updated.admin_notes || '') !== editAdminNotes) {
        updated = await contactAPI.updateNotes(updated.id, editAdminNotes)
      }

      setEnquiries((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
      setViewingEnquiry((prev) => (prev && prev.id === updated.id ? updated : prev))
      pushSuccess(`${updated.name}'s enquiry updated`)
      setEditingEnquiry(null)
    } catch (error) {
      console.error('Error updating enquiry:', error)
      const message = error instanceof Error ? error.message : 'Failed to update enquiry'
      if (message.toLowerCase().includes('unauthorized')) {
        clearToken()
        router.replace('/admin/login')
        return
      }
      setErrorMessage(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResolve = async (enquiry: ContactEnquiry) => {
    await updateEnquiryStatus(enquiry, 'resolved')
  }

  const handleDelete = async (enquiry: ContactEnquiry) => {
    if (!confirm(`Delete enquiry from ${enquiry.name}?`)) return

    setIsLoading(true)
    try {
      await contactAPI.deleteEnquiry(enquiry.id)
      setEnquiries((prev) => prev.filter((item) => item.id !== enquiry.id))
      setViewingEnquiry((prev) => (prev?.id === enquiry.id ? null : prev))
      setEditingEnquiry((prev) => (prev?.id === enquiry.id ? null : prev))
      pushSuccess(`${enquiry.name}'s enquiry deleted`)
    } catch (error) {
      console.error('Error deleting enquiry:', error)
      const message = error instanceof Error ? error.message : 'Failed to delete enquiry'
      if (message.toLowerCase().includes('unauthorized')) {
        clearToken()
        router.replace('/admin/login')
        return
      }
      setErrorMessage(message)
    } finally {
      setIsLoading(false)
    }
  }

  const getAssignedUserLabel = (assignedTo?: string | null) => {
    if (!assignedTo) return 'Unassigned'
    const matchedUser = adminUsers.find((user) => user.id === assignedTo)
    return matchedUser ? `${matchedUser.full_name} (${matchedUser.email})` : assignedTo
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Contact Enquiries</h1>
            <p className="text-sm text-gray-600 mt-1">View and manage customer enquiries</p>
          </div>
        </div>

        {(errorMessage || successMessage) && (
          <div className={`rounded-lg px-4 py-3 text-sm font-medium ${errorMessage ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
            {errorMessage || successMessage}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 flex items-center gap-2 bg-white border-2 border-primary/30 rounded-lg px-4 py-2 hover:border-primary transition-all">
            <Search size={18} className="text-primary" />
            <input
              type="text"
              placeholder="Search by name, email or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 outline-none text-gray-900 bg-transparent"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as UiStatusFilter)}
            className="px-4 py-2 border-2 border-primary/30 rounded-lg focus:outline-none focus:border-primary text-gray-900 bg-white"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b-2 border-primary/20">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Phone</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Subject</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Created</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isFetching ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-600">
                      Loading enquiries...
                    </td>
                  </tr>
                ) : paginatedEnquiries.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-600">
                      No enquiries found
                    </td>
                  </tr>
                ) : (
                  paginatedEnquiries.map((enquiry) => (
                    <tr key={enquiry.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{enquiry.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{enquiry.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{enquiry.phone || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{enquiry.subject || '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[enquiry.status]}`}>
                          {statusLabels[enquiry.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{formatDate(enquiry.created_at)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => void handleViewDetails(enquiry)}
                            className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors font-semibold flex items-center gap-1"
                          >
                            <Eye size={14} />
                            View
                          </button>
                          <button
                            onClick={() => handleEditClick(enquiry)}
                            className="px-3 py-1 text-xs bg-amber-100 text-amber-700 rounded hover:bg-amber-200 transition-colors font-semibold flex items-center gap-1"
                          >
                            <Edit2 size={14} />
                            Edit
                          </button>
                          <button
                            onClick={() => void handleDelete(enquiry)}
                            className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors font-semibold flex items-center gap-1"
                          >
                            <Trash2 size={14} />
                            Delete
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

        {Math.ceil(filteredEnquiries.length / itemsPerPage) > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredEnquiries.length / itemsPerPage)}
            onPageChange={setCurrentPage}
            totalItems={filteredEnquiries.length}
            itemsPerPage={itemsPerPage}
          />
        )}
      </div>

      {viewingEnquiry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Enquiry Details</h2>
              <button onClick={() => setViewingEnquiry(null)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-1">Name</p>
                  <p className="text-lg text-gray-900">{viewingEnquiry.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-1">Phone</p>
                  <p className="text-lg text-gray-900">{viewingEnquiry.phone || '-'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-1">Email</p>
                  <p className="text-lg text-gray-900">{viewingEnquiry.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-1">Status</p>
                  <p className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${statusColors[viewingEnquiry.status]}`}>
                    {statusLabels[viewingEnquiry.status]}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 font-semibold mb-1">Subject</p>
                <p className="text-lg text-gray-900">{viewingEnquiry.subject || '-'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 font-semibold mb-1">Message</p>
                <p className="text-gray-900 leading-relaxed">{viewingEnquiry.message || '-'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 font-semibold mb-1">Created</p>
                <p className="text-gray-900">{formatDate(viewingEnquiry.created_at)}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 font-semibold mb-1">Assigned To</p>
                <p className="text-gray-900">{getAssignedUserLabel(viewingEnquiry.assigned_to)}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 font-semibold mb-1">Admin Notes</p>
                <p className="text-gray-900 whitespace-pre-wrap">{viewingEnquiry.admin_notes || '-'}</p>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-200">
              {viewingEnquiry.status !== 'resolved' && (
                <button
                  onClick={() => void handleResolve(viewingEnquiry)}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Check size={18} />
                  Resolve
                </button>
              )}
              <button
                onClick={() => void handleDelete(viewingEnquiry)}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 size={18} />
                Delete
              </button>
              <button
                onClick={() => setViewingEnquiry(null)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {editingEnquiry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Edit Enquiry Status</h2>
              <button onClick={() => setEditingEnquiry(null)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-700 font-semibold mb-2">Name: {editingEnquiry.name}</p>
                <p className="text-sm text-gray-600 mb-4">Subject: {editingEnquiry.subject || '-'}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as ContactStatus)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-gray-900"
                >
                  <option value="new">New</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Assigned To</label>
                <select
                  value={editAssignedTo}
                  onChange={(e) => setEditAssignedTo(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-gray-900"
                >
                  <option value="">Unassigned</option>
                  {adminUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.full_name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Admin Notes</label>
                <textarea
                  value={editAdminNotes}
                  onChange={(e) => setEditAdminNotes(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-gray-900 resize-none"
                  placeholder="Add internal notes for this enquiry"
                />
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setEditingEnquiry(null)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => void handleUpdateStatus()}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? 'Updating...' : (
                  <>
                    <Check size={18} />
                    Update
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
