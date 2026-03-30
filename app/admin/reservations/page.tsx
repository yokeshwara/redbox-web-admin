'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { DataTable } from '@/components/admin/data-table'
import { Pagination } from '@/components/admin/pagination'
import { Search, X, Check, Eye } from 'lucide-react'

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<any[]>([])
  const [filteredReservations, setFilteredReservations] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  
  // Modal states
  const [viewingReservation, setViewingReservation] = useState<any>(null)
  const [rejectingReservation, setRejectingReservation] = useState<any>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [showApproveMessage, setShowApproveMessage] = useState(false)
  const [approvedReservationName, setApprovedReservationName] = useState('')

  const itemsPerPage = 10

  useEffect(() => {
    const mockReservations = [
      {
        id: 1,
        name: 'Rajesh Kumar',
        phone: '+91-9876543210',
        email: 'rajesh@example.com',
        branch: 'Downtown Branch',
        guests: 4,
        date: '2024-03-15',
        time: '19:00',
        specialRequest: 'Window seat preferred',
        status: 'confirmed',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: 2,
        name: 'Priya Sharma',
        phone: '+91-9876543211',
        email: 'priya@example.com',
        branch: 'Westside Branch',
        guests: 2,
        date: '2024-03-16',
        time: '20:00',
        specialRequest: '',
        status: 'pending',
        createdAt: new Date(),
      },
      {
        id: 3,
        name: 'Amit Patel',
        phone: '+91-9876543212',
        email: 'amit@example.com',
        branch: 'Downtown Branch',
        guests: 6,
        date: '2024-03-17',
        time: '18:30',
        specialRequest: 'Birthday celebration',
        status: 'pending',
        createdAt: new Date(),
      },
    ]
    setReservations(mockReservations)
    setFilteredReservations(mockReservations)
  }, [])

  useEffect(() => {
    let filtered = reservations.filter((res) =>
      res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.phone.includes(searchTerm) ||
      res.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (statusFilter !== 'All') {
      filtered = filtered.filter((res) => res.status === statusFilter)
    }

    setFilteredReservations(filtered)
    setCurrentPage(1)
  }, [searchTerm, statusFilter, reservations])

  const handleViewDetails = (reservation: any) => {
    setViewingReservation(reservation)
  }

  const handleApprove = (reservation: any) => {
    setApprovedReservationName(reservation.name)
    setShowApproveMessage(true)
    setReservations(
      reservations.map((r) =>
        r.id === reservation.id ? { ...r, status: 'confirmed' } : r
      )
    )
    setTimeout(() => setShowApproveMessage(false), 3000)
  }

  const handleOpenRejectModal = (reservation: any) => {
    setRejectingReservation(reservation)
    setRejectionReason('')
  }

  const handleRejectSubmit = () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection')
      return
    }
    
    setReservations(
      reservations.map((r) =>
        r.id === rejectingReservation.id 
          ? { ...r, status: 'cancelled', rejectionReason } 
          : r
      )
    )
    setRejectingReservation(null)
    setRejectionReason('')
  }

  const paginatedReservations = filteredReservations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage)

  const getStatusColor = (status: string) => {
    const colorMap: any = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
      completed: 'bg-blue-100 text-blue-700',
    }
    return colorMap[status] || colorMap.pending
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reservations</h1>
            <p className="text-sm text-gray-600 mt-1">View and manage table reservations</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 flex items-center gap-2 bg-white border-2 border-primary/30 rounded-lg px-4 py-2 hover:border-primary transition-all">
            <Search size={18} className="text-primary" />
            <input
              type="text"
              placeholder="Search by name, phone, or email..."
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
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Table */}
        <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b-2 border-primary/20">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Phone</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Branch</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Guests</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Date & Time</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedReservations.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-600">
                      No reservations found
                    </td>
                  </tr>
                ) : (
                  paginatedReservations.map((reservation) => (
                    <tr key={reservation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{reservation.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{reservation.phone}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{reservation.branch}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{reservation.guests}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{reservation.date} @ {reservation.time}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(reservation.status)}`}>
                          {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewDetails(reservation)}
                            className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors font-semibold flex items-center gap-1"
                          >
                            <Eye size={14} />
                            View
                          </button>
                          {reservation.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(reservation)}
                                className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors font-semibold flex items-center gap-1"
                              >
                                <Check size={14} />
                                Approve
                              </button>
                              <button
                                onClick={() => handleOpenRejectModal(reservation)}
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
            totalItems={filteredReservations.length}
            itemsPerPage={itemsPerPage}
          />
        )}
      </div>

      {/* View Details Modal */}
      {viewingReservation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Reservation Details</h2>
              <button
                onClick={() => setViewingReservation(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-1">Name</p>
                  <p className="text-lg text-gray-900">{viewingReservation.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-1">Phone</p>
                  <p className="text-lg text-gray-900">{viewingReservation.phone}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-1">Email</p>
                  <p className="text-lg text-gray-900">{viewingReservation.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-1">Branch</p>
                  <p className="text-lg text-gray-900">{viewingReservation.branch}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-1">Number of Guests</p>
                  <p className="text-lg text-gray-900">{viewingReservation.guests}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-1">Status</p>
                  <p className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(viewingReservation.status)}`}>
                    {viewingReservation.status.charAt(0).toUpperCase() + viewingReservation.status.slice(1)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-1">Date</p>
                  <p className="text-lg text-gray-900">{viewingReservation.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-1">Time</p>
                  <p className="text-lg text-gray-900">{viewingReservation.time}</p>
                </div>
              </div>

              {viewingReservation.specialRequest && (
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-1">Special Request</p>
                  <p className="text-lg text-gray-900">{viewingReservation.specialRequest}</p>
                </div>
              )}

              {viewingReservation.rejectionReason && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700 font-semibold mb-1">Rejection Reason</p>
                  <p className="text-red-700">{viewingReservation.rejectionReason}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setViewingReservation(null)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectingReservation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Reject Reservation</h2>
              <button
                onClick={() => {
                  setRejectingReservation(null)
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
                  Please provide a reason for rejecting this reservation from <span className="font-semibold">{rejectingReservation.name}</span>
                </p>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g., No tables available, restaurant closed, etc."
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-gray-900"
                  rows={4}
                />
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setRejectingReservation(null)
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
          <p className="font-semibold">Reservation from {approvedReservationName} approved successfully!</p>
        </div>
      )}
    </AdminLayout>
  )
}
