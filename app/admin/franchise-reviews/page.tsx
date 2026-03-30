'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Pagination } from '@/components/admin/pagination'
import { Search, X, Check, Eye, Edit2, Star } from 'lucide-react'
import { franchiseAPI } from '@/lib/api/franchise'

export default function FranchiseReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([])
  const [filteredReviews, setFilteredReviews] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [viewingReview, setViewingReview] = useState<any>(null)
  const [editingReview, setEditingReview] = useState<any>(null)
  const [editStatus, setEditStatus] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const itemsPerPage = 5

  // Load initial data
  useEffect(() => {
    loadReviews()
  }, [])

  const loadReviews = async () => {
    try {
      setIsLoading(true)
      // In production, call the API
      // const data = await franchiseAPI.listReviews()
      
      // Mock data for now
      const mockReviews = [
        {
          id: '1',
          franchise_name: 'Raj\'s RedBox',
          reviewer_name: 'Anil Kumar',
          reviewer_email: 'anil@example.com',
          rating: 4.5,
          review: 'Great franchise experience with excellent support',
          status: 'Approved',
          date: '2024-03-01',
        },
        {
          id: '2',
          franchise_name: 'Delhi RedBox',
          reviewer_name: 'Priya Sharma',
          reviewer_email: 'priya@example.com',
          rating: 3.0,
          review: 'Good service but needs improvement in delivery time',
          status: 'Pending',
          date: '2024-02-28',
        },
        {
          id: '3',
          franchise_name: 'Mumbai RedBox',
          reviewer_name: 'Vikram Patel',
          reviewer_email: 'vikram@example.com',
          rating: 5.0,
          review: 'Outstanding franchise model, highly recommended',
          status: 'Approved',
          date: '2024-02-27',
        },
        {
          id: '4',
          franchise_name: 'Bangalore RedBox',
          reviewer_name: 'Sneha Reddy',
          reviewer_email: 'sneha@example.com',
          rating: 2.0,
          review: 'Not satisfied with the profitability model',
          status: 'Rejected',
          date: '2024-02-26',
        },
        {
          id: '5',
          franchise_name: 'Chennai RedBox',
          reviewer_name: 'Arjun Singh',
          reviewer_email: 'arjun@example.com',
          rating: 4.0,
          review: 'Good business opportunity with decent ROI',
          status: 'Pending',
          date: '2024-02-25',
        },
      ]
      setReviews(mockReviews)
      setFilteredReviews(mockReviews)
    } catch (error) {
      console.error('Error loading reviews:', error)
      alert('Failed to load reviews')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let filtered = reviews.filter(
      (review) =>
        review.franchise_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.reviewer_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    if (statusFilter !== 'All') {
      filtered = filtered.filter((review) => review.status === statusFilter)
    }
    setFilteredReviews(filtered)
    setCurrentPage(1)
  }, [searchTerm, statusFilter, reviews])

  const handleViewDetails = (review: any) => {
    setViewingReview(review)
  }

  const handleEditClick = (review: any) => {
    setEditingReview(review)
    setEditStatus(review.status)
  }

  const handleUpdateStatus = async () => {
    if (!editingReview) return

    setIsLoading(true)
    try {
      // In production, call the API
      // await franchiseAPI.updateReview(editingReview.id, { status: editStatus })
      
      setReviews(
        reviews.map((r) =>
          r.id === editingReview.id ? { ...r, status: editStatus } : r
        )
      )
      setSuccessMessage(`Review status updated to ${editStatus}`)
      setTimeout(() => setSuccessMessage(''), 3000)
      setEditingReview(null)
    } catch (error) {
      console.error('Error updating review:', error)
      alert('Failed to update review')
    } finally {
      setIsLoading(false)
    }
  }

  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const statusColors: { [key: string]: string } = {
    'Approved': 'bg-green-100 text-green-700 font-semibold',
    'Pending': 'bg-yellow-100 text-yellow-700 font-semibold',
    'Rejected': 'bg-red-100 text-red-700 font-semibold',
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            className={i < Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        ))}
        <span className="text-xs text-gray-600 ml-1">({rating})</span>
      </div>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Franchise Reviews</h1>
            <p className="text-sm text-gray-600 mt-1">Review and manage franchise feedback</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 flex items-center gap-2 bg-white border-2 border-primary/30 rounded-lg px-4 py-2 hover:border-primary transition-all">
            <Search size={18} className="text-primary" />
            <input
              type="text"
              placeholder="Search by franchise or reviewer name..."
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
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {/* Table */}
        <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b-2 border-primary/20">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Franchise</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Reviewer</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Rating</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Review</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedReviews.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-600">
                      No reviews found
                    </td>
                  </tr>
                ) : (
                  paginatedReviews.map((review) => (
                    <tr key={review.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{review.franchise_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{review.reviewer_name}</td>
                      <td className="px-6 py-4">{renderStars(review.rating)}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">{review.review}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[review.status] || 'bg-gray-100 text-gray-800'}`}>
                          {review.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{review.date}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewDetails(review)}
                            className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors font-semibold flex items-center gap-1"
                          >
                            <Eye size={14} />
                            View
                          </button>
                          <button
                            onClick={() => handleEditClick(review)}
                            className="px-3 py-1 text-xs bg-amber-100 text-amber-700 rounded hover:bg-amber-200 transition-colors font-semibold flex items-center gap-1"
                          >
                            <Edit2 size={14} />
                            Edit
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

        {/* Pagination */}
        {Math.ceil(filteredReviews.length / itemsPerPage) > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredReviews.length / itemsPerPage)}
            onPageChange={setCurrentPage}
            totalItems={filteredReviews.length}
            itemsPerPage={itemsPerPage}
          />
        )}
      </div>

      {/* View Details Modal */}
      {viewingReview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Review Details</h2>
              <button onClick={() => setViewingReview(null)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-1">Franchise</p>
                  <p className="text-lg text-gray-900">{viewingReview.franchise_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-1">Rating</p>
                  <div>{renderStars(viewingReview.rating)}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-1">Reviewer Name</p>
                  <p className="text-lg text-gray-900">{viewingReview.reviewer_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-1">Email</p>
                  <p className="text-lg text-gray-900">{viewingReview.reviewer_email}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 font-semibold mb-1">Status</p>
                <p className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${statusColors[viewingReview.status]}`}>
                  {viewingReview.status}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 font-semibold mb-1">Review</p>
                <p className="text-gray-900 leading-relaxed">{viewingReview.review}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 font-semibold mb-1">Date</p>
                <p className="text-gray-900">{viewingReview.date}</p>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setViewingReview(null)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Status Modal */}
      {editingReview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Edit Review Status</h2>
              <button onClick={() => setEditingReview(null)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-700 font-semibold mb-2">Franchise: {editingReview.franchise_name}</p>
                <p className="text-sm text-gray-600 mb-4">Reviewer: {editingReview.reviewer_name}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-gray-900"
                >
                  <option value="Approved">Approved</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setEditingReview(null)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? 'Updating...' : <>
                  <Check size={18} />
                  Update
                </>}
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
