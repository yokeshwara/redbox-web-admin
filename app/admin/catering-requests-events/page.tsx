'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Pagination } from '@/components/admin/pagination'
import { Search, Eye, Check, X, Pencil, Trash2 } from 'lucide-react'
import { eventsAPI } from '@/lib/api/events'
import { useToast } from '@/hooks/use-toast'

type CateringRequest = {
  id: string
  name: string
  email: string
  phone: string
  guests: number
  budget: number
  event_date: string
  notes?: string
  status: 'pending' | 'approved' | 'rejected'
  created_at?: string
}

type EditForm = {
  name: string
  email: string
  phone: string
  guests: number
  budget: number
  event_date: string
  notes: string
  status: 'pending' | 'approved' | 'rejected'
}

const initialEditForm: EditForm = {
  name: '',
  email: '',
  phone: '',
  guests: 0,
  budget: 0,
  event_date: '',
  notes: '',
  status: 'pending',
}

export default function CateringRequestsPage() {
  const [requests, setRequests] = useState<CateringRequest[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<CateringRequest | null>(null)
  const [editForm, setEditForm] = useState<EditForm>(initialEditForm)
  const [saving, setSaving] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  const itemsPerPage = 10

  useEffect(() => {
    void fetchCateringRequests()
  }, [])

  const normalizeError = (error: unknown, fallback: string) => {
    if (error instanceof Error && error.message.includes('401')) {
      localStorage.removeItem('authToken')
      router.replace('/admin/login')
      return 'Unauthorized'
    }

    if (error instanceof Error) {
      return error.message || fallback
    }

    return fallback
  }

  const fetchCateringRequests = async () => {
    try {
      setLoading(true)
      const data = await eventsAPI.listCateringRequests(1, 200)
      const requestsArray = Array.isArray(data) ? data : data.results || []
      setRequests(requestsArray)
    } catch (error) {
      console.error('Error fetching catering requests:', error)
      toast({
        title: 'Error',
        description: normalizeError(error, 'Failed to load catering requests'),
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredRequests = useMemo(() => {
    const searchLower = searchTerm.toLowerCase()

    return requests.filter((request) => {
      const matchesSearch =
        request.name?.toLowerCase().includes(searchLower) ||
        request.email?.toLowerCase().includes(searchLower) ||
        request.phone?.toLowerCase().includes(searchLower) ||
        request.notes?.toLowerCase().includes(searchLower)

      const matchesStatus = statusFilter === 'All' || request.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [requests, searchTerm, statusFilter])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter])

  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage)

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
    }
    return colorMap[status] || colorMap.pending
  }

  const handleView = async (requestId: string) => {
    try {
      const data = await eventsAPI.getCateringRequest(requestId)
      setSelectedRequest(data)
      setShowViewModal(true)
    } catch (error) {
      console.error('Error fetching catering request detail:', error)
      toast({
        title: 'Error',
        description: normalizeError(error, 'Failed to load catering request'),
        variant: 'destructive',
      })
    }
  }

  const handleEditOpen = (request: CateringRequest) => {
    setSelectedRequest(request)
    setEditForm({
      name: request.name || '',
      email: request.email || '',
      phone: request.phone || '',
      guests: request.guests || 0,
      budget: request.budget || 0,
      event_date: request.event_date || '',
      notes: request.notes || '',
      status: request.status || 'pending',
    })
    setShowEditModal(true)
  }

  const handleSave = async () => {
    if (!selectedRequest) return

    try {
      setSaving(true)
      await eventsAPI.updateCateringRequest(selectedRequest.id, editForm)
      toast({
        title: 'Success',
        description: 'Catering request updated successfully',
      })
      setShowEditModal(false)
      setSelectedRequest(null)
      await fetchCateringRequests()
    } catch (error) {
      console.error('Error updating catering request:', error)
      toast({
        title: 'Error',
        description: normalizeError(error, 'Failed to update catering request'),
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return

    try {
      await eventsAPI.deleteCateringRequest(deletingId)
      toast({
        title: 'Success',
        description: 'Catering request deleted successfully',
      })
      setShowDeleteModal(false)
      setDeletingId(null)
      await fetchCateringRequests()
    } catch (error) {
      console.error('Error deleting catering request:', error)
      toast({
        title: 'Error',
        description: normalizeError(error, 'Failed to delete catering request'),
        variant: 'destructive',
      })
    }
  }

  const handleStatusUpdate = async (
    request: CateringRequest,
    status: 'approved' | 'rejected'
  ) => {
    try {
      await eventsAPI.updateCateringRequestStatus(request.id, status)
      toast({
        title: 'Success',
        description: `Catering request ${status} successfully`,
      })
      await fetchCateringRequests()
    } catch (error) {
      console.error('Error updating catering request status:', error)
      toast({
        title: 'Error',
        description: normalizeError(error, 'Failed to update catering request status'),
        variant: 'destructive',
      })
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Catering Requests</h1>
            <p className="text-sm text-gray-600 mt-1">Review and manage catering requests</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 flex items-center gap-2 bg-white border-2 border-primary/30 rounded-lg px-4 py-2 hover:border-primary transition-all">
            <Search size={18} className="text-primary" />
            <input
              type="text"
              placeholder="Search by name, email, phone, or notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 outline-none text-gray-900 bg-transparent"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border-2 border-primary/30 rounded-lg focus:outline-none focus:border-primary text-gray-900 bg-white"
          >
            <option value="All">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading catering requests...</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Phone</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Event Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Guests</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Budget</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{request.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{request.email || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{request.phone || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{request.event_date || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{request.guests || 0}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">Rs {request.budget || 0}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(request.status)}`}>
                        {request.status?.charAt(0).toUpperCase() + request.status?.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => void handleView(request.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleEditOpen(request)}
                          className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setDeletingId(request.id)
                            setShowDeleteModal(true)
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                        {request.status === 'pending' && (
                          <>
                            <button
                              onClick={() => void handleStatusUpdate(request, 'approved')}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <Check size={18} />
                            </button>
                            <button
                              onClick={() => void handleStatusUpdate(request, 'rejected')}
                              className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <X size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredRequests.length}
            itemsPerPage={itemsPerPage}
          />
        )}
      </div>

      {showViewModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Catering Request Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="text-gray-900 font-medium">{selectedRequest.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-gray-900 font-medium">{selectedRequest.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="text-gray-900 font-medium">{selectedRequest.phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Event Date</p>
                <p className="text-gray-900 font-medium">{selectedRequest.event_date || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Guests</p>
                <p className="text-gray-900 font-medium">{selectedRequest.guests || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Budget</p>
                <p className="text-gray-900 font-medium">Rs {selectedRequest.budget || 0}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-sm text-gray-600">Notes</p>
                <p className="text-gray-900 font-medium whitespace-pre-wrap">{selectedRequest.notes || 'None'}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-sm text-gray-600">Status</p>
                <p className={`text-sm font-semibold px-2 py-1 rounded-full w-fit ${getStatusColor(selectedRequest.status)}`}>
                  {selectedRequest.status?.charAt(0).toUpperCase() + selectedRequest.status?.slice(1)}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setShowViewModal(false)
                setSelectedRequest(null)
              }}
              className="w-full px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showEditModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Catering Request</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Name</label>
                <input
                  value={editForm.name}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Phone</label>
                <input
                  value={editForm.phone}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, phone: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Event Date</label>
                <input
                  type="date"
                  value={editForm.event_date}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, event_date: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Guests</label>
                <input
                  type="number"
                  min={1}
                  value={editForm.guests}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, guests: Number(e.target.value) || 0 }))}
                  className="w-full border rounded-lg px-3 py-2 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Budget</label>
                <input
                  type="number"
                  min={0}
                  value={editForm.budget}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, budget: Number(e.target.value) || 0 }))}
                  className="w-full border rounded-lg px-3 py-2 text-gray-900"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Notes</label>
                <textarea
                  value={editForm.notes}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, notes: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 text-gray-900"
                  rows={4}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, status: e.target.value as EditForm['status'] }))}
                  className="w-full border rounded-lg px-3 py-2 text-gray-900"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setSelectedRequest(null)
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => void handleSave()}
                disabled={saving}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Delete Catering Request</h2>
            <p className="text-gray-600 mb-6">This will remove the catering request from admin. Continue?</p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeletingId(null)
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => void handleDelete()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
