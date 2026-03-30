'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { DataTable } from '@/components/admin/data-table'
import { Pagination } from '@/components/admin/pagination'
import { Search, Star, Trash2, Plus, Edit2 } from 'lucide-react'
import { CRUDModal } from '@/components/admin/crud-modal'

export default function CustomerReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([])
  const [filteredReviews, setFilteredReviews] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [ratingFilter, setRatingFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [editingReview, setEditingReview] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 5,
    text: '',
    website: true,
  })

  const itemsPerPage = 10

  useEffect(() => {
    const mockReviews = [
      { id: 1, name: 'John Doe', email: 'john@example.com', rating: 5, text: 'Excellent service and food quality', date: '2024-03-05', website: true },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', rating: 4, text: 'Good experience overall', date: '2024-03-04', website: true },
      { id: 3, name: 'Bob Wilson', email: 'bob@example.com', rating: 3, text: 'Average food', date: '2024-03-03', website: false },
    ]
    setReviews(mockReviews)
    setFilteredReviews(mockReviews)
  }, [])

  useEffect(() => {
    let filtered = reviews.filter((rev) =>
      rev.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rev.text.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (ratingFilter !== 'All') {
      filtered = filtered.filter((rev) => rev.rating === parseInt(ratingFilter))
    }

    setFilteredReviews(filtered)
    setCurrentPage(1)
  }, [searchTerm, ratingFilter, reviews])

  const handleAddNew = () => {
    setEditingReview(null)
    setFormData({
      name: '',
      email: '',
      rating: 5,
      text: '',
      website: true,
    })
    setShowModal(true)
  }

  const handleEdit = (review: any) => {
    setEditingReview(review)
    setFormData({
      name: review.name,
      email: review.email,
      rating: review.rating,
      text: review.text,
      website: review.website,
    })
    setShowModal(true)
  }

  const handleDelete = (review: any) => {
    if (confirm('Delete review?')) {
      setReviews(reviews.filter((r) => r.id !== review.id))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.text.trim()) return

    if (editingReview) {
      setReviews(reviews.map((r) => (r.id === editingReview.id ? { ...r, ...formData } : r)))
    } else {
      const newReview = {
        id: Math.max(...reviews.map((r) => r.id), 0) + 1,
        ...formData,
        date: new Date().toISOString().split('T')[0],
      }
      setReviews([...reviews, newReview])
    }
    setShowModal(false)
  }

  const paginatedReviews = filteredReviews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage)

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Customer Reviews</h1>
            <p className="text-sm text-gray-600 mt-1">Manage customer reviews</p>
          </div>
          <button onClick={handleAddNew} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all font-semibold">
            <Plus size={20} />
            Add Review
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 flex items-center gap-2 bg-white border-2 border-primary/30 rounded-lg px-4 py-2">
            <Search size={18} className="text-primary" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 outline-none text-gray-900 bg-transparent"
            />
          </div>

          <select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)} className="px-4 py-2 border-2 border-primary/30 rounded-lg text-gray-900 bg-white">
            <option value="All">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>

        <div className="space-y-3">
          {paginatedReviews.map((review) => (
            <div key={review.id} className="bg-white border-2 border-primary/20 rounded-lg p-4 hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold text-gray-900">{review.name}</p>
                  <p className="text-xs text-gray-600">{review.email}</p>
                  {review.website && <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">Display on Website</span>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(review)} className="p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(review)} className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="flex gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
                ))}
              </div>
              <p className="text-gray-700 text-sm mb-2">{review.text}</p>
              <p className="text-xs text-gray-500">{review.date}</p>
            </div>
          ))}
        </div>

        {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={filteredReviews.length} itemsPerPage={itemsPerPage} />}
      </div>

      <CRUDModal isOpen={showModal} title="Review" isEditing={!!editingReview} onClose={() => setShowModal(false)} onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Name *</label>
              <input type="text" placeholder="Customer name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-gray-900" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Email *</label>
              <input type="email" placeholder="Email address" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-gray-900" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setFormData({ ...formData, rating: star })} className="text-2xl transition-colors">
                  <Star size={28} className={star <= formData.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Review *</label>
            <textarea placeholder="Write your review..." value={formData.text} onChange={(e) => setFormData({ ...formData, text: e.target.value })} className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-gray-900 resize-none" rows={4} required />
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" id="website" checked={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.checked })} className="w-4 h-4 rounded" />
            <label htmlFor="website" className="text-sm font-medium text-gray-900">Display this review on website</label>
          </div>
        </div>
      </CRUDModal>
    </AdminLayout>
  )
}
