'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Pagination } from '@/components/admin/pagination'
import { Plus, Search, Tag, Calendar, X, Check, Trash2, Edit2 } from 'lucide-react'
import { promotionsAPI } from '@/lib/api/promotions'

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<any[]>([])
  const [filteredPromotions, setFilteredPromotions] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [editingPromotion, setEditingPromotion] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const itemsPerPage = 5
  const [formData, setFormData] = useState<any>({
    promo_code: '',
    discount_type: 'percentage',
    discount_value: '',
    description: '',
    min_order_amount: '',
    max_discount_amount: '',
    start_date: '',
    end_date: '',
    usage_limit: '',
    status: 'active',
  })

  // Load promotions on mount
  useEffect(() => {
    loadPromotions()
  }, [])

  const loadPromotions = async () => {
    setIsLoading(true)
    try {
      // In production, call the API
      // const response = await promotionsAPI.listPromotions(searchTerm, statusFilter, currentPage)
      
      const mockPromotions = [
        {
          id: '1',
          promo_code: 'WELCOME20',
          discount_type: 'percentage',
          discount_value: 20,
          description: 'Welcome discount for first-time customers',
          min_order_amount: 300,
          max_discount_amount: 200,
          start_date: '2024-01-01',
          end_date: '2024-12-31',
          usage_limit: 1000,
          status: 'active',
        },
      ]
      setPromotions(mockPromotions)
      setFilteredPromotions(mockPromotions)
    } catch (error) {
      console.error('Error loading promotions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let filtered = promotions.filter((p) =>
      p.promo_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    if (statusFilter !== 'All') {
      filtered = filtered.filter((p) => p.status === statusFilter)
    }
    setFilteredPromotions(filtered)
  }, [searchTerm, statusFilter, promotions])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      if (editingPromotion) {
        // In production, call the API
        // await promotionsAPI.updatePromotion(editingPromotion.id, formData)
        setPromotions(
          promotions.map((p) =>
            p.id === editingPromotion.id ? { ...p, ...formData } : p
          )
        )
        setSuccessMessage(`${formData.promo_code} updated successfully`)
      } else {
        // In production, call the API
        // const result = await promotionsAPI.createPromotion(formData)
        const newPromotion = {
          id: Date.now().toString(),
          ...formData,
        }
        setPromotions([...promotions, newPromotion])
        setSuccessMessage(`${formData.promo_code} created successfully`)
      }
      setTimeout(() => setSuccessMessage(''), 3000)
      resetForm()
    } catch (error) {
      console.error('Error saving promotion:', error)
      alert('Failed to save promotion')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditClick = async (promotion: any) => {
    setIsLoading(true)
    try {
      // In production, fetch the promotion details
      // const details = await promotionsAPI.getPromotion(promotion.id)
      setEditingPromotion(promotion)
      setFormData(promotion)
      setShowModal(true)
    } catch (error) {
      console.error('Error loading promotion:', error)
      alert('Failed to load promotion')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (promotion: any) => {
    if (!confirm(`Delete promotion ${promotion.promo_code}?`)) return

    setIsLoading(true)
    try {
      // In production, call the API
      // await promotionsAPI.deletePromotion(promotion.id)
      
      setPromotions(promotions.filter((p) => p.id !== promotion.id))
      setSuccessMessage(`${promotion.promo_code} deleted successfully`)
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      console.error('Error deleting promotion:', error)
      alert('Failed to delete promotion')
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setShowModal(false)
    setEditingPromotion(null)
    setFormData({
      promo_code: '',
      discount_type: 'percentage',
      discount_value: '',
      description: '',
      min_order_amount: '',
      max_discount_amount: '',
      start_date: '',
      end_date: '',
      usage_limit: '',
      status: 'active',
    })
  }

  const handleOpenNew = () => {
    resetForm()
    setShowModal(true)
  }

  // Status color mapping
  const getStatusColor = (status: string) => {
    return status === 'active'
      ? 'bg-green-100 text-green-700'
      : 'bg-gray-100 text-gray-700'
  }

  return (
    <AdminLayout>
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-lg p-4 md:p-6 shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-white">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold whitespace-nowrap">Promotions & Offers</h1>
            <p className="text-xs md:text-base text-red-100 mt-1">Manage discounts and promotional codes</p>
          </div>
          <button
            onClick={handleOpenNew}
            className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-white text-red-600 rounded-lg font-bold hover:bg-red-50 transition-all shadow-md whitespace-nowrap"
          >
            <Plus size={18} className="md:block hidden" />
            <Plus size={16} className="md:hidden" />
            <span className="text-sm md:text-base">Add Promotion</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex items-center gap-2 bg-white border-2 border-red-200 rounded-lg px-4 py-3 hover:border-red-400 transition-colors">
            <Search size={20} className="text-red-600" />
            <input
              type="text"
              placeholder="Search by code or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent outline-none text-foreground placeholder-muted-foreground"
            />
          </div>
          <div className="flex items-center gap-2 bg-white border-2 border-red-200 rounded-lg px-4 py-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent outline-none text-foreground cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="border-2 border-red-200 rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-red-50 border-b-2 border-red-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Code</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Description</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Discount</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Min Order</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Valid Period</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-red-200">
                {filteredPromotions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((promo) => (
                  <tr key={promo.id} className="hover:bg-red-50">
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{promo.promo_code}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{promo.description}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {promo.discount_type === 'percentage' ? `${promo.discount_value}%` : `₹${promo.discount_value}`}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">₹{promo.min_order_amount}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{promo.start_date} to {promo.end_date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(promo.status)}`}>
                        {promo.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditClick(promo)}
                          disabled={isLoading}
                          className="px-3 py-1 text-xs bg-amber-100 text-amber-700 rounded hover:bg-amber-200 transition-colors font-semibold flex items-center gap-1 disabled:opacity-50"
                        >
                          <Edit2 size={14} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(promo)}
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

        {/* Pagination */}
        {Math.ceil(filteredPromotions.length / itemsPerPage) > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredPromotions.length / itemsPerPage)}
            onPageChange={setCurrentPage}
            totalItems={filteredPromotions.length}
            itemsPerPage={itemsPerPage}
          />
        )}

      {/* Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">{editingPromotion ? 'Edit Promotion' : 'Create Promotion'}</h2>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Promo Code *</label>
                  <input
                    type="text"
                    value={formData.promo_code}
                    onChange={(e) => setFormData({ ...formData, promo_code: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-600 text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Discount Type *</label>
                  <select
                    value={formData.discount_type}
                    onChange={(e) => setFormData({ ...formData, discount_type: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-600 text-gray-900"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="flat">Flat Amount</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Discount Value *</label>
                  <input
                    type="number"
                    value={formData.discount_value}
                    onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-600 text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Max Discount Amount</label>
                  <input
                    type="number"
                    value={formData.max_discount_amount}
                    onChange={(e) => setFormData({ ...formData, max_discount_amount: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-600 text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-600 text-gray-900"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Min Order Amount</label>
                  <input
                    type="number"
                    value={formData.min_order_amount}
                    onChange={(e) => setFormData({ ...formData, min_order_amount: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-600 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Usage Limit</label>
                  <input
                    type="number"
                    value={formData.usage_limit}
                    onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-600 text-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Start Date *</label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-600 text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">End Date *</label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-600 text-gray-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-600 text-gray-900"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button type="button" onClick={resetForm} className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-semibold">
                  Cancel
                </button>
                <button type="submit" disabled={isLoading} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                  {isLoading ? 'Saving...' : <>
                    <Check size={18} />
                    {editingPromotion ? 'Update' : 'Create'}
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
      </div>
    </AdminLayout>
  )
}
