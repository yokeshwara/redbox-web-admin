'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { DataTable } from '@/components/admin/data-table'
import { Pagination } from '@/components/admin/pagination'
import { Plus, Search, Edit2 } from 'lucide-react'
import { CRUDModal } from '@/components/admin/crud-modal'
import { seoAPI } from '@/lib/api/seo'
import { useToast } from '@/hooks/use-toast'

export default function SEOSettingsPage() {
  const { toast } = useToast()
  const [pages, setPages] = useState<any[]>([])
  const [filteredPages, setFilteredPages] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingPage, setEditingPage] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    page_name: '',
    meta_title: '',
    meta_description: '',
    keywords: '',
  })

  const itemsPerPage = 10

  useEffect(() => {
    loadSEOPages()
  }, [])

  const loadSEOPages = async () => {
    setLoading(true)
    try {
      const data = await seoAPI.list(1, 100)
      const pagesList = Array.isArray(data) ? data : data.results || []
      setPages(pagesList)
      setFilteredPages(pagesList)
    } catch (error: any) {
      console.error('Error loading SEO pages:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to load SEO pages',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const filtered = pages.filter((page) =>
      page.page_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.meta_title?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredPages(filtered)
    setCurrentPage(1)
  }, [searchTerm, pages])

  const handleAddNew = () => {
    setEditingPage(null)
    setFormData({
      page_name: '',
      meta_title: '',
      meta_description: '',
      keywords: '',
    })
    setShowModal(true)
  }

  const handleEdit = (page: any) => {
    setEditingPage(page)
    setFormData({
      page_name: page.page_name,
      meta_title: page.meta_title,
      meta_description: page.meta_description,
      keywords: page.keywords,
    })
    setShowModal(true)
  }

  const handleDelete = async (page: any) => {
    if (confirm('Delete this SEO page?')) {
      try {
        await seoAPI.delete(page.id)
        setPages(pages.filter((p) => p.id !== page.id))
        toast({
          title: 'Success',
          description: 'SEO page deleted successfully',
        })
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to delete SEO page',
          variant: 'destructive',
        })
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.page_name.trim() || !formData.meta_title.trim()) {
      toast({
        title: 'Error',
        description: 'Page name and meta title are required',
        variant: 'destructive',
      })
      return
    }

    setSubmitting(true)
    try {
      if (editingPage) {
        const updated = await seoAPI.update(editingPage.id, formData)
        setPages(pages.map((p) => (p.id === editingPage.id ? updated : p)))
        toast({
          title: 'Success',
          description: 'SEO page updated successfully',
        })
      } else {
        const newPage = await seoAPI.create(formData)
        setPages([...pages, newPage])
        toast({
          title: 'Success',
          description: 'SEO page created successfully',
        })
      }
      setShowModal(false)
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save SEO page',
        variant: 'destructive',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const paginatedPages = filteredPages.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const totalPages = Math.ceil(filteredPages.length / itemsPerPage)

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">SEO Settings</h1>
          <p className="text-sm text-gray-600 mt-1">Manage page metadata and SEO settings</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-white border-2 border-primary/30 rounded-lg px-4 py-2 flex-1">
            <Search size={18} className="text-primary" />
            <input type="text" placeholder="Search pages..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-1 outline-none text-gray-900 bg-transparent" />
          </div>
          <button onClick={handleAddNew} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors ml-2">
            <Plus size={18} />
            Add SEO Page
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-gray-500">Loading SEO pages...</p>
          </div>
        ) : (
          <>
            <DataTable
              columns={[
                { header: 'Page Name', accessor: 'page_name' },
                { header: 'Meta Title', accessor: 'meta_title' },
                { header: 'Meta Description', accessor: 'meta_description', width: '300px', render: (val) => <span className="line-clamp-2 text-sm">{val}</span> },
                { header: 'Keywords', accessor: 'keywords' },
              ]}
              data={paginatedPages}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />

            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={filteredPages.length} itemsPerPage={itemsPerPage} />}
          </>
        )}
      </div>

      <CRUDModal isOpen={showModal} title="Page SEO" isEditing={!!editingPage} onClose={() => setShowModal(false)} onSubmit={handleSubmit} isLoading={submitting}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Page Name *</label>
            <input type="text" placeholder="Page name (e.g., home, menu)" value={formData.page_name} onChange={(e) => setFormData({ ...formData, page_name: e.target.value })} className="w-full px-3 py-2 border-2 border-primary/30 rounded-lg focus:outline-none focus:border-primary text-gray-900" required />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Meta Title *</label>
            <input type="text" placeholder="Meta title for search engines" value={formData.meta_title} onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })} className="w-full px-3 py-2 border-2 border-primary/30 rounded-lg focus:outline-none focus:border-primary text-gray-900" required />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Meta Description</label>
            <textarea placeholder="Meta description for search engines" value={formData.meta_description} onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })} className="w-full px-3 py-2 border-2 border-primary/30 rounded-lg focus:outline-none focus:border-primary text-gray-900" rows={2} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Keywords</label>
            <input type="text" placeholder="Comma separated keywords" value={formData.keywords} onChange={(e) => setFormData({ ...formData, keywords: e.target.value })} className="w-full px-3 py-2 border-2 border-primary/30 rounded-lg focus:outline-none focus:border-primary text-gray-900" />
          </div>
        </div>
      </CRUDModal>
    </AdminLayout>
  )
}
