'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Pagination } from '@/components/admin/pagination'
import { Search, Eye, Check, X } from 'lucide-react'
import { eventsAPI } from '@/lib/api/events'
import { useToast } from '@/hooks/use-toast'

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<any[]>([])
  const [filteredReservations, setFilteredReservations] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [selectedReservation, setSelectedReservation] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [showRejectionModal, setShowRejectionModal] = useState(false)
  const [rejectionData, setRejectionData] = useState<any>({ reservationId: null, reason: '' })
  const { toast } = useToast()

  const itemsPerPage = 10

  // Fetch reservations from API
  useEffect(() => {
    fetchReservations()
  }, [])

  const fetchReservations = async () => {
    try {
      setLoading(true)
      const data = await eventsAPI.listReservations(1, 100)
      const reservationsArray = Array.isArray(data) ? data : data.results || []
      setReservations(reservationsArray)
      setFilteredReservations(reservationsArray)
    } catch (error) {
      console.error('Error fetching reservations:', error)
      toast({
        title: 'Error',
        description: 'Failed to load reservations',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let filtered = reservations.filter((reservation) => {
      const name = reservation.customer_name || reservation.name || ''
      const email = reservation.email || ''
      const searchLower = searchTerm.toLowerCase()
      return name.toLowerCase().includes(searchLower) || email.toLowerCase().includes(searchLower)
    })

    if (statusFilter !== 'All') {
      filtered = filtered.filter((reservation) => reservation.status === statusFilter)
    }

    setFilteredReservations(filtered)
    setCurrentPage(1)
  }, [searchTerm, statusFilter, reservations])

  const handleApprove = async (reservation: any) => {
    try {
      await eventsAPI.updateReservationStatus(reservation.id, 'approved')
      toast({
        title: 'Success',
        description: 'Reservation approved successfully',
      })
      fetchReservations()
    } catch (error) {
      console.error('Error approving reservation:', error)
      toast({
        title: 'Error',
        description: 'Failed to approve reservation',
        variant: 'destructive',
      })
    }
  }

  const handleRejectClick = (reservation: any) => {
    setRejectionData({ reservationId: reservation.id, reason: '' })
    setShowRejectionModal(true)
  }

  const handleReject = async () => {
    if (!rejectionData.reason.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide a reason for rejection',
        variant: 'destructive',
      })
      return
    }

    try {
      await eventsAPI.updateReservationStatus(rejectionData.reservationId, 'rejected', rejectionData.reason)
      toast({
        title: 'Success',
        description: 'Reservation rejected successfully',
      })
      setShowRejectionModal(false)
      fetchReservations()
    } catch (error) {
      console.error('Error rejecting reservation:', error)
      toast({
        title: 'Error',
        description: 'Failed to reject reservation',
        variant: 'destructive',
      })
    }
  }

  const handleView = (reservation: any) => {
    setSelectedReservation(reservation)
    setShowModal(true)
  }

  const paginatedReservations = filteredReservations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage)

  const getStatusColor = (status: string) => {
    const colorMap: any = {
      pending: 'bg-yellow-100 text-yellow-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
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
            <p className="text-sm text-gray-600 mt-1">Review and manage event reservations</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 flex items-center gap-2 bg-white border-2 border-primary/30 rounded-lg px-4 py-2 hover:border-primary transition-all">
            <Search size={18} className="text-primary" />
            <input
              type="text"
              placeholder="Search reservations..."
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
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading reservations...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Phone</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Guests</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedReservations.map((reservation) => (
                    <tr key={reservation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{reservation.customer_name || reservation.name || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{reservation.email || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{reservation.phone || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{reservation.guest_count || reservation.guests || 0}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(reservation.status)}`}>
                          {reservation.status?.charAt(0).toUpperCase() + reservation.status?.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleView(reservation)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye size={18} />
                          </button>
                          {reservation.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(reservation)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Approve"
                              >
                                <Check size={18} />
                              </button>
                              <button
                                onClick={() => handleRejectClick(reservation)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
          </>
        )}

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

      {/* Reservation Details Modal */}
      {showModal && selectedReservation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Reservation Details</h2>
            <div className="space-y-3 mb-6">
              <div>
                <p className="text-sm text-gray-600">Customer Name</p>
                <p className="text-gray-900 font-medium">{selectedReservation.customer_name || selectedReservation.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-gray-900 font-medium">{selectedReservation.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="text-gray-900 font-medium">{selectedReservation.phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Guest Count</p>
                <p className="text-gray-900 font-medium">{selectedReservation.guest_count || selectedReservation.guests || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Special Requests</p>
                <p className="text-gray-900 font-medium">{selectedReservation.special_requests || selectedReservation.notes || 'None'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className={`text-sm font-semibold px-2 py-1 rounded-full w-fit ${getStatusColor(selectedReservation.status)}`}>
                  {selectedReservation.status?.charAt(0).toUpperCase() + selectedReservation.status?.slice(1)}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="w-full px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Rejection Reason Modal */}
      {showRejectionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Reject Reservation</h2>
            <p className="text-sm text-gray-600 mb-4">Please provide a reason for rejection:</p>
            <textarea
              value={rejectionData.reason}
              onChange={(e) => setRejectionData({ ...rejectionData, reason: e.target.value })}
              placeholder="Enter rejection reason..."
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-gray-900 resize-none"
              rows={4}
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowRejectionModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
