'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Pagination } from '@/components/admin/pagination'
import { Plus, Search, X, Check, Trash2, Edit2 } from 'lucide-react'
import { offersAPI } from '@/lib/api/offers'

export default function FeaturedOffersPage() {
  const [offers, setOffers] = useState<any[]>([])
  const [filteredOffers, setFilteredOffers] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingOffer, setEditingOffer] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [formData, setFormData] = useState({ title: '', description: '', discount_percentage: '', valid_until: '', status: 'active' })

  const itemsPerPage = 10

  useEffect(() => {
    loadOffers()
  }, [])

  const loadOffers = async () => {
    setIsLoading(true)
    try {
      // In production: const response = await offersAPI.listOffers(searchTerm)
      const mockOffers = [
        { id: '1', title: '30% Off - Weekend Special', description: 'Valid on weekends only', discount_percentage: 30, valid_until: '2024-04-15', status: 'active' },
      ]
      setOffers(mockOffers)
      setFilteredOffers(mockOffers)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const filtered = offers.filter((off) => off.title.toLowerCase().includes(searchTerm.toLowerCase()))
    setFilteredOffers(filtered)
    setCurrentPage(1)
  }, [searchTerm, offers])

  const resetForm = () => {
    setShowModal(false)
    setEditingOffer(null)
    setFormData({ title: '', description: '', discount_percentage: '', valid_until: '', status: 'active' })
  }

  const handleOpenNew = () => {
    resetForm()
    setShowModal(true)
  }

  const handleEditClick = async (offer: any) => {
    setIsLoading(true)
    try {
      // In production: const details = await offersAPI.getOffer(offer.id)
      setEditingOffer(offer)
      setFormData(offer)
      setShowModal(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (offer: any) => {
    if (!confirm('Delete offer?')) return

    setIsLoading(true)
    try {
      // In production: await offersAPI.deleteOffer(offer.id)
      setOffers(offers.filter((o) => o.id !== offer.id))
      setSuccessMessage(`${offer.title} deleted successfully`)
      setTimeout(() => setSuccessMessage(''), 3000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) return

    setIsLoading(true)
    try {
      if (editingOffer) {
        // In production: await offersAPI.updateOffer(editingOffer.id, formData)
        setOffers(offers.map((o) => (o.id === editingOffer.id ? { ...o, ...formData, discount_percentage: parseFloat(formData.discount_percentage) || 0 } : o)))
        setSuccessMessage(`${formData.title} updated successfully`)
      } else {
        // In production: const result = await offersAPI.createOffer(formData)
        const newOffer = {
          id: Date.now().toString(),
          ...formData,
          discount_percentage: parseFloat(formData.discount_percentage) || 0,
        }
        setOffers([...offers, newOffer])
        setSuccessMessage(`${formData.title} created successfully`)
      }
      setTimeout(() => setSuccessMessage(''), 3000)
      resetForm()
    } finally {
      setIsLoading(false)
    }
  }

  const paginatedOffers = filteredOffers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const totalPages = Math.ceil(filteredOffers.length / itemsPerPage)

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Featured Offers</h1>
            <p className="text-sm text-gray-600 mt-1">Manage promotional offers</p>
          </div>
          <button onClick={handleOpenNew} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg font-semibold">
            <Plus size={20} />
            New Offer
          </button>
        </div>

        <div className="flex items-center gap-2 bg-white border-2 border-primary/30 rounded-lg px-4 py-2">
          <Search size={18} className="text-primary" />
          <input type="text" placeholder="Search offers..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-1 outline-none text-gray-900 bg-transparent" />
        </div>

        {/* Table */}
        <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Title</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Description</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Discount</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Valid Until</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedOffers.map((offer) => (
                  <tr key={offer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{offer.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{offer.description}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{offer.discount_percentage}%</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{offer.valid_until}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditClick(offer)}
                          disabled={isLoading}
                          className="px-3 py-1 text-xs bg-amber-100 text-amber-700 rounded hover:bg-amber-200 transition-colors font-semibold flex items-center gap-1 disabled:opacity-50"
                        >
                          <Edit2 size={14} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(offer)}
                          disabled={isLoading}
                          className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors font-semibold flex items-center gap-1 disabled:opacity-50"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={filteredOffers.length} itemsPerPage={itemsPerPage} />}
      </div>

      {/* Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">{editingOffer ? 'Edit Offer' : 'Create Offer'}</h2>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Offer Title *</label>
                <input
                  type="text"
                  placeholder="e.g., 30% Off Weekend Special"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Description</label>
                <textarea
                  placeholder="Offer description..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-gray-900"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Discount (%) *</label>
                  <input
                    type="number"
                    placeholder="30"
                    value={formData.discount_percentage}
                    onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value })}
                    min="0"
                    max="100"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Valid Until *</label>
                  <input
                    type="date"
                    value={formData.valid_until}
                    onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-gray-900"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button type="button" onClick={resetForm} className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-semibold">
                  Cancel
                </button>
                <button type="submit" disabled={isLoading} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                  {isLoading ? 'Saving...' : <>
                    <Check size={18} />
                    {editingOffer ? 'Update' : 'Create'}
                  </>}
                </button>
              </div>
            </form>
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
