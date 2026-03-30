'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { DataTable } from '@/components/admin/data-table'
import { Pagination } from '@/components/admin/pagination'
import { Search, Trash2, Star, Plus, Edit2, AlertCircle } from 'lucide-react'
import { CRUDModal } from '@/components/admin/crud-modal'
import { branchReviewsAPI } from '@/lib/api/branch-reviews'
import { branchesAPI } from '@/lib/api/branches'

export default function BranchReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([])
  const [filteredReviews, setFilteredReviews] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [editingReview, setEditingReview] = useState<any>(null)
  const [branches, setBranches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    customer_name: '',
    branch: '',
    rating: 5,
    review_text: '',
    display_on_website: true,
  })

  const itemsPerPage = 10

  // Load branches
  const loadBranches = async () => {
    try {
      const response = await branchesAPI.listBranches(1, 100)
      let branchesList = response
      if (response.results) {
        branchesList = response.results
      } else if (Array.isArray(response)) {
        branchesList = response
      }
      setBranches(Array.isArray(branchesList) ? branchesList : [])
    } catch (err) {
      console.error('Failed to load branches:', err)
    }
  }

  // Load reviews from API
  const loadReviews = async (page: number = 1, search: string = '') => {
    try {
      setLoading(true)
      setError('')
      const response = await branchReviewsAPI.listReviews(page, itemsPerPage, search)
      
      let reviewsList = response
      if (response.results) {
        reviewsList = response.results
      } else if (Array.isArray(response)) {
        reviewsList = response
      }

      const processedReviews = (Array.isArray(reviewsList) ? reviewsList : []).map((review: any) => ({
        id: review.id,
        customer_name: review.customer_name || '',
        branch: review.branch || '',
        branch_name: review.branch_name || '',
        rating: review.rating || 5,
        review_text: review.review_text || '',
        display_on_website: review.display_on_website || false,
        created_at: review.created_at || new Date().toISOString().split('T')[0],
      }))

      setReviews(processedReviews)
      setFilteredReviews(processedReviews)
    } catch (err: any) {
      console.error('Error loading reviews:', err)
      setError('Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBranches()
    loadReviews(1, '')
  }, [])

  useEffect(() => {
    const filtered = reviews.filter((rev) =>
      rev.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rev.branch_name || rev.branch).toLowerCase().includes(searchTerm.toLowerCase()) ||
      rev.review_text.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredReviews(filtered)
    setCurrentPage(1)
  }, [searchTerm, reviews])

  const handleAddNew = () => {
    setEditingReview(null)
    setFormData({
      customer_name: '',
      branch: branches.length > 0 ? branches[0].id : '',
      rating: 5,
      review_text: '',
      display_on_website: true,
    })
    setShowModal(true)
  }

  const handleEdit = async (review: any) => {
    try {
      setLoading(true)
      const details = await branchReviewsAPI.getReview(review.id)
      setEditingReview(details)
      setFormData({
        customer_name: details.customer_name || '',
        branch: details.branch || '',
        branch_name: details.branch_name || '',
        rating: details.rating || 5,
        review_text: details.review_text || '',
        display_on_website: details.display_on_website || false,
      })
      setShowModal(true)
    } catch (err) {
      console.error('Error fetching review details:', err)
      setEditingReview(review)
      setFormData({
        customer_name: review.customer_name,
        branch: review.branch,
        branch_name: review.branch_name,
        rating: review.rating,
        review_text: review.review_text,
        display_on_website: review.display_on_website,
      })
      setShowModal(true)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (review: any) => {
    if (confirm(`Delete review from ${review.customer_name}?`)) {
      try {
        setLoading(true)
        await branchReviewsAPI.deleteReview(review.id)
        setReviews(reviews.filter((r) => r.id !== review.id))
      } catch (err: any) {
        console.error('Error deleting review:', err)
        setError('Failed to delete review')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.customer_name.trim() || !formData.review_text.trim()) return

    try {
      setLoading(true)
      setError('')

      if (editingReview) {
        await branchReviewsAPI.updateReview(editingReview.id, formData)
      } else {
        await branchReviewsAPI.createReview(formData)
      }

      await loadReviews(1, '')
      setShowModal(false)
    } catch (err: any) {
      console.error('Error saving review:', err)
      setError('Failed to save review')
    } finally {
      setLoading(false)
    }
  }

  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage)

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Branch Reviews</h1>
            <p className="text-sm text-gray-600 mt-1">Manage customer reviews for branches</p>
          </div>
          <button 
            onClick={handleAddNew}
            disabled={loading || branches.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
            <Plus size={20} />
            Add Review
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900">Error</h3>
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="flex items-center gap-2 bg-white border-2 border-primary/30 rounded-lg px-4 py-2 hover:border-primary transition-all">
          <Search size={18} className="text-primary" />
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={loading}
            className="flex-1 outline-none text-gray-900 bg-transparent"
          />
        </div>

        {/* Loading State */}
        {loading && reviews.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <div className="inline-block">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            </div>
            <p className="mt-4 text-gray-600">Loading reviews...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-gray-600">
              {searchTerm ? 'No reviews found matching your search' : 'No reviews added yet'}
            </p>
          </div>
        ) : (
          <>
            {/* Reviews Grid */}
            <div className="grid grid-cols-1 gap-4">
              {paginatedReviews.map((review) => (
                <div key={review.id} className="bg-white border-2 border-primary/20 rounded-lg p-4 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-bold text-gray-900">{review.customer_name}</p>
                      <p className="text-sm text-gray-600">{review.branch_name || review.branch}</p>
                      {review.display_on_website && <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">Display on Website</span>}
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm mb-3">{review.review_text}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{review.created_at}</span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEdit(review)}
                        disabled={loading}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors disabled:opacity-50">
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(review)}
                        disabled={loading}
                        className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors disabled:opacity-50">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={filteredReviews.length}
                itemsPerPage={itemsPerPage}
              />
            )}
          </>
        )}
      </div>

      <CRUDModal 
        isOpen={showModal} 
        title="Review" 
        isEditing={!!editingReview} 
        onClose={() => {
          setShowModal(false)
          setEditingReview(null)
        }} 
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Customer Name <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              placeholder="Customer name" 
              value={formData.customer_name} 
              onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })} 
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-gray-900" 
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Branch <span className="text-red-500">*</span></label>
            <select 
              value={formData.branch} 
              onChange={(e) => setFormData({ ...formData, branch: e.target.value })} 
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-gray-900 bg-white"
              required
            >
              <option value="">Select a branch</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Rating <span className="text-red-500">*</span></label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" onClick={() => setFormData({ ...formData, rating: star })} className="text-2xl transition-colors">
                  <Star size={28} className={star <= formData.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Review <span className="text-red-500">*</span></label>
            <textarea 
              placeholder="Write your review..." 
              value={formData.review_text} 
              onChange={(e) => setFormData({ ...formData, review_text: e.target.value })} 
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-gray-900 resize-none" 
              rows={4} 
              required 
            />
          </div>

          <div className="flex items-center gap-3">
            <input 
              type="checkbox" 
              id="website" 
              checked={formData.display_on_website} 
              onChange={(e) => setFormData({ ...formData, display_on_website: e.target.checked })} 
              className="w-4 h-4 rounded" 
            />
            <label htmlFor="website" className="text-sm font-medium text-gray-900">Display this review on website</label>
          </div>
        </div>
      </CRUDModal>
    </AdminLayout>
  )
}
