'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { DataTable } from '@/components/admin/data-table'
import { Pagination } from '@/components/admin/pagination'
import { Plus, Search } from 'lucide-react'
import { CRUDModal } from '@/components/admin/crud-modal'
import { bannersAPI } from '@/lib/api/banners'
import { useToast } from '@/hooks/use-toast'

export default function BannersPage() {
  const { toast } = useToast()
  const [banners, setBanners] = useState<any[]>([])
  const [filteredBanners, setFilteredBanners] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingBanner, setEditingBanner] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    button_text: '',
    button_link: '',
    status: 'inactive',
    order: 1,
  })

  const itemsPerPage = 10

  useEffect(() => {
    loadBanners()
  }, [])

  const loadBanners = async () => {
    setLoading(true)
    try {
      const data = await bannersAPI.list(1, 100)
      const bannerList = Array.isArray(data) ? data : data.results || []
      setBanners(bannerList)
      setFilteredBanners(bannerList)
    } catch (error: any) {
      console.error('Error loading banners:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to load banners',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const filtered = banners.filter((banner) =>
      banner.title?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredBanners(filtered)
    setCurrentPage(1)
  }, [searchTerm, banners])

  const handleAddNew = () => {
    setEditingBanner(null)
    setFormData({
      title: '',
      subtitle: '',
      button_text: '',
      button_link: '',
      status: 'inactive',
      order: 1,
    })
    setShowModal(true)
  }

  const handleEdit = (banner: any) => {
    setEditingBanner(banner)
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle,
      button_text: banner.button_text,
      button_link: banner.button_link,
      status: banner.status,
      order: banner.order || 1,
    })
    setShowModal(true)
  }

  const handleDelete = async (banner: any) => {
    if (confirm('Delete banner?')) {
      try {
        await bannersAPI.delete(banner.id)
        setBanners(banners.filter((b) => b.id !== banner.id))
        toast({
          title: 'Success',
          description: 'Banner deleted successfully',
        })
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to delete banner',
          variant: 'destructive',
        })
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      toast({
        title: 'Error',
        description: 'Title is required',
        variant: 'destructive',
      })
      return
    }

    setSubmitting(true)
    try {
      if (editingBanner) {
        const updated = await bannersAPI.update(editingBanner.id, formData)
        setBanners(banners.map((b) => (b.id === editingBanner.id ? updated : b)))
        toast({
          title: 'Success',
          description: 'Banner updated successfully',
        })
      } else {
        const newBanner = await bannersAPI.create(formData)
        setBanners([...banners, newBanner])
        toast({
          title: 'Success',
          description: 'Banner created successfully',
        })
      }
      setShowModal(false)
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save banner',
        variant: 'destructive',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const paginatedBanners = filteredBanners.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const totalPages = Math.ceil(filteredBanners.length / itemsPerPage)

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Banners</h1>
            <p className="text-sm text-gray-600 mt-1">Manage website banners</p>
          </div>
          <button onClick={handleAddNew} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all font-semibold">
            <Plus size={20} />
            Add Banner
          </button>
        </div>

        <div className="flex items-center gap-2 bg-white border-2 border-primary/30 rounded-lg px-4 py-2">
          <Search size={18} className="text-primary" />
          <input type="text" placeholder="Search banners..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-1 outline-none text-gray-900 bg-transparent" />
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-gray-500">Loading banners...</p>
          </div>
        ) : (
          <DataTable
            columns={[
              {
                header: 'Title',
                accessor: 'title',
              },
              { header: 'Subtitle', accessor: 'subtitle' },
              { header: 'Button Text', accessor: 'button_text' },
              {
                header: 'Status',
                accessor: 'status',
                render: (val) => (
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      val === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {val === 'active' ? 'Active' : 'Inactive'}
                  </span>
                ),
              },
              { header: 'Order', accessor: 'order' },
            ]}
            data={paginatedBanners}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={filteredBanners.length} itemsPerPage={itemsPerPage} />}
      </div>

      <CRUDModal isOpen={showModal} title="Banner" isEditing={!!editingBanner} onClose={() => setShowModal(false)} onSubmit={handleSubmit} isLoading={submitting}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Title *</label>
            <input type="text" placeholder="Banner title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-gray-900" required />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Subtitle</label>
            <input type="text" placeholder="Banner subtitle" value={formData.subtitle} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-gray-900" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Button Text</label>
              <input type="text" placeholder="Click here" value={formData.button_text} onChange={(e) => setFormData({ ...formData, button_text: e.target.value })} className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-gray-900" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Button Link</label>
              <input type="url" placeholder="/page" value={formData.button_link} onChange={(e) => setFormData({ ...formData, button_link: e.target.value })} className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-gray-900" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Status</label>
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-gray-900 bg-white">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Order</label>
              <input type="number" min="1" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })} className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-gray-900" />
            </div>
          </div>
        </div>
      </CRUDModal>
    </AdminLayout>
  )
}
