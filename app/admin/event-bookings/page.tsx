'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Pagination } from '@/components/admin/pagination'
import { Search, Eye, Check, X } from 'lucide-react'
import { eventsAPI } from '@/lib/api/events'
import { useToast } from '@/hooks/use-toast'

export default function EventBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [filteredBookings, setFilteredBookings] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [editingBooking, setEditingBooking] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [showRejectionModal, setShowRejectionModal] = useState(false)
  const [rejectionData, setRejectionData] = useState<any>({ bookingId: null, reason: '' })
  const { toast } = useToast()

  const itemsPerPage = 10

  // Fetch event bookings from API
  useEffect(() => {
    fetchEventBookings()
  }, [])

  const fetchEventBookings = async () => {
    try {
      setLoading(true)
      const data = await eventsAPI.listEventBookings(1, 100)
      const bookingsArray = Array.isArray(data) ? data : data.results || []
      setBookings(bookingsArray)
      setFilteredBookings(bookingsArray)
    } catch (error) {
      console.error('Error fetching event bookings:', error)
      toast({
        title: 'Error',
        description: 'Failed to load event bookings',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let filtered = bookings.filter((booking) =>
      booking.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (statusFilter !== 'All') {
      filtered = filtered.filter((booking) => booking.status === statusFilter)
    }

    setFilteredBookings(filtered)
    setCurrentPage(1)
  }, [searchTerm, statusFilter, bookings])

  const handleApprove = async (booking: any) => {
    try {
      await eventsAPI.updateEventBookingStatus(booking.id, 'confirmed')
      toast({
        title: 'Success',
        description: 'Booking approved successfully',
      })
      fetchEventBookings()
    } catch (error) {
      console.error('Error approving booking:', error)
      toast({
        title: 'Error',
        description: 'Failed to approve booking',
        variant: 'destructive',
      })
    }
  }

  const handleRejectClick = (booking: any) => {
    setRejectionData({ bookingId: booking.id, reason: '' })
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
      await eventsAPI.updateEventBookingStatus(rejectionData.bookingId, 'rejected', rejectionData.reason)
      toast({
        title: 'Success',
        description: 'Booking rejected successfully',
      })
      setShowRejectionModal(false)
      fetchEventBookings()
    } catch (error) {
      console.error('Error rejecting booking:', error)
      toast({
        title: 'Error',
        description: 'Failed to reject booking',
        variant: 'destructive',
      })
    }
  }

  const handleView = (booking: any) => {
    setEditingBooking(booking)
    setShowModal(true)
  }

  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage)

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
            <h1 className="text-3xl font-bold text-gray-900">Event Bookings</h1>
            <p className="text-sm text-gray-600 mt-1">Review and manage event bookings</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 flex items-center gap-2 bg-white border-2 border-primary/30 rounded-lg px-4 py-2 hover:border-primary transition-all">
            <Search size={18} className="text-primary" />
            <input
              type="text"
              placeholder="Search bookings..."
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
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading event bookings...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Event Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Customer</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Guests</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{booking.event_name || booking.eventName || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{booking.customer_name || booking.customerName || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{booking.email || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{booking.guest_count || booking.guestCount || 0}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                          {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleView(booking)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye size={18} />
                          </button>
                          {booking.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(booking)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Approve"
                              >
                                <Check size={18} />
                              </button>
                              <button
                                onClick={() => handleRejectClick(booking)}
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
            totalItems={filteredBookings.length}
            itemsPerPage={itemsPerPage}
          />
        )}
      </div>

      {/* Booking Details Modal */}
      {showModal && editingBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Booking Details</h2>
            <div className="space-y-3 mb-6">
              <div>
                <p className="text-sm text-gray-600">Event Name</p>
                <p className="text-gray-900 font-medium">{editingBooking.event_name || editingBooking.eventName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Customer</p>
                <p className="text-gray-900 font-medium">{editingBooking.customer_name || editingBooking.customerName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-gray-900 font-medium">{editingBooking.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="text-gray-900 font-medium">{editingBooking.phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Guest Count</p>
                <p className="text-gray-900 font-medium">{editingBooking.guest_count || editingBooking.guestCount || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className={`text-sm font-semibold px-2 py-1 rounded-full w-fit ${getStatusColor(editingBooking.status)}`}>
                  {editingBooking.status?.charAt(0).toUpperCase() + editingBooking.status?.slice(1)}
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
            <h2 className="text-xl font-bold text-gray-900 mb-4">Reject Booking</h2>
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
