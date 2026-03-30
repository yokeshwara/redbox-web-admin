'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Pagination } from '@/components/admin/pagination'
import { Plus, Search, X, Check, Trash2, Edit2 } from 'lucide-react'
import { campaignsAPI } from '@/lib/api/campaigns'

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [filteredCampaigns, setFilteredCampaigns] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    banner_url: '',
    status: 'active',
  })

  const itemsPerPage = 10

  useEffect(() => {
    loadCampaigns()
  }, [])

  const loadCampaigns = async () => {
    setIsLoading(true)
    try {
      // In production: const response = await campaignsAPI.listCampaigns(searchTerm)
      const mockCampaigns = [
        {
          id: '1',
          title: 'Summer Sale 2024',
          description: '30% off on all items',
          start_date: '2024-03-01',
          end_date: '2024-05-31',
          banner_url: 'https://images.unsplash.com/photo-1556821552-5c5b80c0c3f8?w=300&h=100&fit=crop&q=80',
          status: 'active',
        },
      ]
      setCampaigns(mockCampaigns)
      setFilteredCampaigns(mockCampaigns)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const filtered = campaigns.filter((campaign) =>
      campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredCampaigns(filtered)
    setCurrentPage(1)
  }, [searchTerm, campaigns])

  const resetForm = () => {
    setShowModal(false)
    setEditingCampaign(null)
    setFormData({
      title: '',
      description: '',
      start_date: '',
      end_date: '',
      banner_url: '',
      status: 'active',
    })
  }

  const handleOpenNew = () => {
    resetForm()
    setShowModal(true)
  }

  const handleEditClick = async (campaign: any) => {
    setIsLoading(true)
    try {
      // In production: const details = await campaignsAPI.getCampaign(campaign.id)
      setEditingCampaign(campaign)
      setFormData(campaign)
      setShowModal(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (campaign: any) => {
    if (!confirm(`Delete campaign "${campaign.title}"?`)) return

    setIsLoading(true)
    try {
      // In production: await campaignsAPI.deleteCampaign(campaign.id)
      setCampaigns(campaigns.filter((c) => c.id !== campaign.id))
      setSuccessMessage(`${campaign.title} deleted successfully`)
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
      if (editingCampaign) {
        // In production: await campaignsAPI.updateCampaign(editingCampaign.id, formData)
        setCampaigns(
          campaigns.map((c) =>
            c.id === editingCampaign.id ? { ...c, ...formData } : c
          )
        )
        setSuccessMessage(`${formData.title} updated successfully`)
      } else {
        // In production: const result = await campaignsAPI.createCampaign(formData)
        const newCampaign = {
          id: Date.now().toString(),
          ...formData,
        }
        setCampaigns([...campaigns, newCampaign])
        setSuccessMessage(`${formData.title} created successfully`)
      }
      setTimeout(() => setSuccessMessage(''), 3000)
      resetForm()
    } finally {
      setIsLoading(false)
    }
  }

  const paginatedCampaigns = filteredCampaigns.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage)

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Homepage Campaigns</h1>
            <p className="text-sm text-gray-600 mt-1">Manage homepage promotional campaigns</p>
          </div>
          <button
            onClick={handleOpenNew}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all font-semibold"
          >
            <Plus size={20} />
            New Campaign
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-2 bg-white border-2 border-primary/30 rounded-lg px-4 py-2 hover:border-primary transition-all">
          <Search size={18} className="text-primary" />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 outline-none text-gray-900 bg-transparent"
          />
        </div>

        {/* Table */}
        <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Title</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Description</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Period</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedCampaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{campaign.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{campaign.description}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{campaign.start_date} to {campaign.end_date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${campaign.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {campaign.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditClick(campaign)}
                          disabled={isLoading}
                          className="px-3 py-1 text-xs bg-amber-100 text-amber-700 rounded hover:bg-amber-200 transition-colors font-semibold flex items-center gap-1 disabled:opacity-50"
                        >
                          <Edit2 size={14} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(campaign)}
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
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredCampaigns.length}
            itemsPerPage={itemsPerPage}
          />
        )}
      </div>

      {/* Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">{editingCampaign ? 'Edit Campaign' : 'Create Campaign'}</h2>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Campaign Title *</label>
                <input
                  type="text"
                  placeholder="e.g., Summer Sale 2024"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Description</label>
                <textarea
                  placeholder="Campaign description..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-gray-900"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Start Date *</label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">End Date *</label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-gray-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Banner URL</label>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.banner_url}
                  onChange={(e) => setFormData({ ...formData, banner_url: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-gray-900"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button type="button" onClick={resetForm} className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-semibold">
                  Cancel
                </button>
                <button type="submit" disabled={isLoading} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                  {isLoading ? 'Saving...' : <>
                    <Check size={18} />
                    {editingCampaign ? 'Update' : 'Create'}
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
