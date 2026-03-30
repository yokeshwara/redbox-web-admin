'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Pagination } from '@/components/admin/pagination'
import { Search, X, Check, Eye } from 'lucide-react'

export default function CateringRequestsPage() {
  const [requests, setRequests] = useState<any[]>([])
  const [filteredRequests, setFilteredRequests] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [viewingRequest, setViewingRequest] = useState<any>(null)
  const [rejectingRequest, setRejectingRequest] = useState<any>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [showApproveMessage, setShowApproveMessage] = useState(false)
  const [approvedRequestName, setApprovedRequestName] = useState('')

  const itemsPerPage = 10

  useEffect(() => {
    const mockRequests = [
      {
        id: 1,
        customerName: 'Rajesh Kumar',
        email: 'rajesh@example.com',
        phone: '+91-9876543210',
        eventDate: '2024-04-15',
        guestCount: 150,
        budget: 50000,
        description: 'Corporate event catering',
        status: 'pending',
        createdAt: new Date(),
      },
      {
        id: 2,
        customerName: 'Priya Sharma',
        email: 'priya@example.com',
        phone: '+91-9876543211',
        eventDate: '2024-04-20',
        guestCount: 75,
        budget: 25000,
        description: 'Wedding reception catering',
        status: 'pending',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
    ]
    setRequests(mockRequests)
    setFilteredRequests(mockRequests)
  }, [])

  useEffect(() => {
    let filtered = requests.filter((req) =>
      req.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.phone.includes(searchTerm)
    )

    if (statusFilter !== 'All') {
      filtered = filtered.filter((req) => req.status === statusFilter)
    }

    setFilteredRequests(filtered)
    setCurrentPage(1)
  }, [searchTerm, statusFilter, requests])

  const handleViewDetails = (request: any) => {
    setViewingRequest(request)
  }

  const handleApprove = (request: any) => {
    setApprovedRequestName(request.customerName)
    setShowApproveMessage(true)
    setRequests(
      requests.map((r) =>
        r.id === request.id ? { ...r, status: 'approved' } : r
      )
    )
    setTimeout(() => setShowApproveMessage(false), 3000)
  }

  const handleOpenRejectModal = (request: any) => {
    setRejectingRequest(request)
    setRejectionReason('')
  }

  const handleRejectSubmit = () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection')
      return
    }

    setRequests(
      requests.map((r) =>
        r.id === rejectingRequest.id
          ? { ...r, status: 'rejected', rejectionReason }
          : r
      )
    )
    setRejectingRequest(null)
    setRejectionReason('')
  }

  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage)

  const getStatusColor = (status: string) => {
    const colorMap: any = {
      pending: 'bg-yellow-100 text-yellow-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
    }
    return colorMap[status] || colorMap.pending
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Catering Requests</h1>
            <p className="text-sm text-gray-600 mt-1">View and manage catering requests</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 flex items-center gap-2 bg-white border-2 border-primary/30 rounded-lg px-4 py-2 hover:border-primary transition-all">
            <Search size={18} className="text-primary" />
            <input
              type="text"
              placeholder="Search requests..."
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

        {/* Table */}
        <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b-2 border-primary/20">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Guests</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Budget</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Event Date</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedRequests.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-600">
                      No requests found
                    </td>
                  </tr>
                ) : (
                  paginatedRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{request.customerName}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{request.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{request.guestCount}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">₹{request.budget}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{request.eventDate}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(request.status)}`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewDetails(request)}
                            className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors font-semibold flex items-center gap-1"
                          >
                            <Eye size={14} />
                            View
                          </button>
                          {request.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(request)}
                                className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors font-semibold flex items-center gap-1"
                              >
                                <Check size={14} />
                                Approve
                              </button>
                              <button
                                onClick={() => handleOpenRejectModal(request)}
                                className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors font-semibold"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
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

      {/* View Details Modal */}
      {viewingRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Catering Request Details</h2>
              <button
                onClick={() => setViewingRequest(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-1">Name</p>
                  <p className="text-lg text-gray-900">{viewingRequest.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-1">Phone</p>
                  <p className="text-lg text-gray-900">{viewingRequest.phone}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-1">Email</p>
                  <p className="text-lg text-gray-900">{viewingRequest.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-1">Status</p>
                  <p className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(viewingRequest.status)}`}>
                    {viewingRequest.status.charAt(0).toUpperCase() + viewingRequest.status.slice(1)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-1">Event Date</p>
                  <p className="text-lg text-gray-900">{viewingRequest.eventDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-1">Guest Count</p>
                  <p className="text-lg text-gray-900">{viewingRequest.guestCount}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 font-semibold mb-1">Budget</p>
                <p className="text-lg text-gray-900">₹{viewingRequest.budget}</p>
              </div>

              {viewingRequest.description && (
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-1">Description</p>
                  <p className="text-gray-900">{viewingRequest.description}</p>
                </div>
              )}

              {viewingRequest.rejectionReason && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700 font-semibold mb-1">Rejection Reason</p>
                  <p className="text-red-700">{viewingRequest.rejectionReason}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setViewingRequest(null)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectingRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Reject Request</h2>
              <button
                onClick={() => {
                  setRejectingRequest(null)
                  setRejectionReason('')
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-700 mb-3">
                  Please provide a reason for rejecting this request from <span className="font-semibold">{rejectingRequest.customerName}</span>
                </p>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g., Not available on that date, budget constraints, etc."
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-gray-900"
                  rows={4}
                />
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setRejectingRequest(null)
                  setRejectionReason('')
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Message Toast */}
      {showApproveMessage && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg animate-pulse z-50">
          <p className="font-semibold">Request from {approvedRequestName} approved successfully!</p>
        </div>
      )}
    </AdminLayout>
  )
}
