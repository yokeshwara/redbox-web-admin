'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { DataTable } from '@/components/admin/data-table'
import { Pagination } from '@/components/admin/pagination'
import { TestimonialFormModal } from '@/components/admin/testimonial-form-modal'
import { Plus, Search, Star, Trash2, Eye, Check, X, Pencil } from 'lucide-react'
import { testimonialsAPI } from '@/lib/api/testimonials'
import { useToast } from '@/hooks/use-toast'

export default function TestimonialsPage() {
  const { toast } = useToast()
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [filteredTestimonials, setFilteredTestimonials] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [ratingFilter, setRatingFilter] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedTestimonial, setSelectedTestimonial] = useState<any>(null)
  const [editingTestimonial, setEditingTestimonial] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const itemsPerPage = 5

  // Load testimonials from API
  useEffect(() => {
    loadTestimonials()
  }, [])

  const loadTestimonials = async () => {
    setLoading(true)
    try {
      const data = await testimonialsAPI.list(1, 100)
      const testimonialsList = Array.isArray(data) ? data : data.results || []
      setTestimonials(testimonialsList)
      setFilteredTestimonials(testimonialsList)
    } catch (error: any) {
      console.error('Error loading testimonials:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to load testimonials',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let filtered = testimonials.filter((t) =>
      t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    if (ratingFilter !== 'All') {
      filtered = filtered.filter((t) => t.rating === parseInt(ratingFilter))
    }
    setFilteredTestimonials(filtered)
    setCurrentPage(1)
  }, [searchTerm, ratingFilter, testimonials])

  const paginatedTestimonials = filteredTestimonials.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  const totalPages = Math.ceil(filteredTestimonials.length / itemsPerPage)

  const handleDelete = async (testimonial: any) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      setActionLoading(testimonial.id)
      try {
        await testimonialsAPI.delete(testimonial.id)
        const updated = testimonials.filter((t) => t.id !== testimonial.id)
        setTestimonials(updated)
        toast({
          title: 'Success',
          description: 'Testimonial deleted successfully',
        })
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to delete testimonial',
          variant: 'destructive',
        })
      } finally {
        setActionLoading(null)
      }
    }
  }

  const handleApprove = async (testimonial: any) => {
    setActionLoading(`approve-${testimonial.id}`)
    try {
      const updated = await testimonialsAPI.approve(testimonial.id, true)
      setTestimonials(testimonials.map((t) => (t.id === testimonial.id ? updated : t)))
      toast({
        title: 'Success',
        description: 'Testimonial approved successfully',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to approve testimonial',
        variant: 'destructive',
      })
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (testimonial: any) => {
    setActionLoading(`reject-${testimonial.id}`)
    try {
      const updated = await testimonialsAPI.approve(testimonial.id, false)
      setTestimonials(testimonials.map((t) => (t.id === testimonial.id ? updated : t)))
      toast({
        title: 'Success',
        description: 'Testimonial rejected successfully',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to reject testimonial',
        variant: 'destructive',
      })
    } finally {
      setActionLoading(null)
    }
  }

  const handleViewTestimonial = (testimonial: any) => {
    setSelectedTestimonial(testimonial)
    setShowViewModal(true)
  }

  const openCreateModal = () => {
    setShowModal(true)
    setEditingTestimonial(null)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingTestimonial(null)
  }

  const handleEdit = async (testimonial: any) => {
    setActionLoading(`edit-${testimonial.id}`)
    try {
      const detail = await testimonialsAPI.get(testimonial.id)
      setEditingTestimonial(detail)
      setShowModal(true)
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load testimonial details',
        variant: 'destructive',
      })
    } finally {
      setActionLoading(null)
    }
  }

  const handleSubmit = async (data: any) => {
    try {
      if (editingTestimonial?.id) {
        await testimonialsAPI.update(editingTestimonial.id, data)
      } else {
        await testimonialsAPI.create(data)
      }
      await loadTestimonials()
      handleCloseModal()
      toast({
        title: 'Success',
        description: editingTestimonial ? 'Testimonial updated successfully' : 'Testimonial created successfully',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save testimonial',
        variant: 'destructive',
      })
      throw error
    }
  }

  const columns = [
    {
      header: 'Customer',
      accessor: 'name',
      width: '200px',
      render: (value: string, row: any) => (
        <div className="flex items-center gap-3">
          {row.image && (
            <img
              src={row.image}
              alt={value}
              className="w-10 h-10 rounded-full object-cover"
            />
          )}
          <div>
            <p className="font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-600">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Rating',
      accessor: 'rating',
      width: '120px',
      render: (value: number) => (
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              className={i < value ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
            />
          ))}
        </div>
      ),
    },
    {
      header: 'Review',
      accessor: 'review',
      width: '300px',
      render: (value: string) => (
        <p className="text-sm text-gray-700 line-clamp-2">{value}</p>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      width: '120px',
      render: (value: string) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
            value === 'Approved' || value === 'approved'
              ? 'bg-green-500/20 text-green-600'
              : 'bg-yellow-500/20 text-yellow-600'
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: 'id',
      width: '80px',
      render: (value: string, row: any) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewTestimonial(row)}
            disabled={actionLoading === value}
            className="p-2 hover:bg-blue-100 rounded text-blue-600 transition-colors disabled:opacity-50"
            title="View"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => handleEdit(row)}
            disabled={actionLoading !== null}
            className="p-2 hover:bg-gray-100 rounded text-gray-700 transition-colors disabled:opacity-50"
            title="Edit"
          >
            <Pencil size={18} />
          </button>
          <button
            onClick={() => handleApprove(row)}
            disabled={actionLoading !== null}
            className="p-2 hover:bg-green-100 rounded text-green-600 transition-colors disabled:opacity-50"
            title="Approve"
          >
            <Check size={18} />
          </button>
          <button
            onClick={() => handleReject(row)}
            disabled={actionLoading !== null}
            className="p-2 hover:bg-orange-100 rounded text-orange-600 transition-colors disabled:opacity-50"
            title="Reject"
          >
            <X size={18} />
          </button>
          <button
            onClick={() => handleDelete(row)}
            disabled={actionLoading !== null}
            className="p-2 hover:bg-red-100 rounded text-red-600 transition-colors disabled:opacity-50"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <AdminLayout>
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-lg p-4 md:p-6 shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-white">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold whitespace-nowrap">Testimonials</h1>
            <p className="text-xs md:text-base text-red-100 mt-1">Manage customer reviews and testimonials</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-white/20 text-white rounded-lg font-bold hover:bg-white/30 transition-all shadow-md whitespace-nowrap"
            >
              <Plus size={18} />
              <span className="text-sm md:text-base">Add</span>
            </button>
            <button
              onClick={() => loadTestimonials()}
              className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-white text-red-600 rounded-lg font-bold hover:bg-red-50 transition-all shadow-md whitespace-nowrap"
            >
              <Search size={18} className="md:block hidden" />
              <Search size={16} className="md:hidden" />
              <span className="text-sm md:text-base">Refresh</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex items-center gap-2 bg-white border-2 border-red-200 rounded-lg px-4 py-3 hover:border-red-400 transition-colors">
            <Search size={20} className="text-red-600" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent outline-none text-foreground placeholder-muted-foreground"
            />
          </div>
          <div className="flex items-center gap-2 bg-white border-2 border-red-200 rounded-lg px-4 py-3">
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="bg-transparent outline-none text-foreground cursor-pointer"
            >
              <option value="All">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-gray-500">Loading testimonials...</p>
          </div>
        ) : (
          <div className="border-2 border-red-200 rounded-lg overflow-hidden shadow-sm">
            <DataTable
              columns={columns}
              data={paginatedTestimonials}
            
            />
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsCount={paginatedTestimonials.length}
            totalItems={filteredTestimonials.length}
            onPageChange={setCurrentPage}
          />
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatBox label="Total Reviews" value={testimonials.length.toString()} />
          <StatBox
            label="Approved"
            value={testimonials.filter((t) => t.status === 'Approved' || t.status === 'approved').length.toString()}
          />
          <StatBox
            label="Pending"
            value={testimonials.filter((t) => t.status === 'Pending' || t.status === 'pending').length.toString()}
          />
          <StatBox
            label="Avg Rating"
            value={
              testimonials.length > 0
                ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
                : '0'
            }
          />
        </div>

        {/* View Modal */}
        {showViewModal && selectedTestimonial && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full shadow-xl">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Testimonial Details</h2>
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    {selectedTestimonial.image && (
                      <img
                        src={selectedTestimonial.image}
                        alt={selectedTestimonial.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <p className="font-bold text-lg text-gray-900">{selectedTestimonial.name}</p>
                      <p className="text-sm text-gray-600">{selectedTestimonial.email}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Rating</p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={20}
                          className={i < selectedTestimonial.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Review</p>
                      <p className="text-gray-700 leading-relaxed">{selectedTestimonial.review || selectedTestimonial.text}</p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Status</p>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-bold ${
                        selectedTestimonial.status === 'Approved' || selectedTestimonial.status === 'approved'
                          ? 'bg-green-500/20 text-green-600'
                          : 'bg-yellow-500/20 text-yellow-600'
                      }`}
                    >
                      {selectedTestimonial.status}
                    </span>
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <button
                      onClick={() => {
                        handleApprove(selectedTestimonial)
                        setShowViewModal(false)
                      }}
                      disabled={actionLoading !== null}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50"
                    >
                      <Check size={18} />
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        handleReject(selectedTestimonial)
                        setShowViewModal(false)
                      }}
                      disabled={actionLoading !== null}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors disabled:opacity-50"
                    >
                      <X size={18} />
                      Reject
                    </button>
                    <button
                      onClick={() => {
                        handleDelete(selectedTestimonial)
                        setShowViewModal(false)
                      }}
                      disabled={actionLoading !== null}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={18} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <TestimonialFormModal
          item={editingTestimonial}
          onSubmit={handleSubmit}
          onClose={handleCloseModal}
        />
      )}
    </AdminLayout>
  )
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <p className="text-red-700 text-sm mb-2 font-medium">{label}</p>
      <p className="text-3xl font-bold text-red-900">{value}</p>
    </div>
  )
}
