'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { DataTable } from '@/components/admin/data-table'
import { Pagination } from '@/components/admin/pagination'
import { Plus, Search, MapPin, Image as ImageIcon, Star, Map, AlertCircle } from 'lucide-react'
import { BranchFormModal } from '@/components/admin/branch-form-modal'
import { BranchMapModal } from '@/components/admin/branch-map-modal'
import { BranchDetailMapModal } from '@/components/admin/branch-detail-map-modal'
import { BranchMapShareModal } from '@/components/admin/branch-map-share-modal'
import { BranchGalleryModal } from '@/components/admin/branch-gallery-modal'
import { branchesAPI } from '@/lib/api/branches'
import { isAuthenticated } from '@/lib/auth'

export default function BranchesPage() {
  const [branches, setBranches] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showMapModal, setShowMapModal] = useState(false)
  const [showDetailMapModal, setShowDetailMapModal] = useState(false)
  const [showMapShareModal, setShowMapShareModal] = useState(false)
  const [showGalleryModal, setShowGalleryModal] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState<any>(null)
  const [editingBranch, setEditingBranch] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [authenticated, setAuthenticated] = useState(false)

  // ✅ FIX: add totalPages + totalItems from API
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  const itemsPerPage = 5

  // Auth check
  useEffect(() => {
    const isAuth = isAuthenticated()
    setAuthenticated(isAuth)

    if (!isAuth) {
      setError('Please log in to access branch data')
    }
  }, [])

  // Load when page/search changes
  useEffect(() => {
    if (authenticated) {
      loadBranches()
    }
  }, [currentPage, searchTerm, authenticated])

  const loadBranches = async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await branchesAPI.listBranches(currentPage, itemsPerPage, searchTerm)

      // ✅ FIX: correct response mapping
      const data = res?.data || res

      if (data?.results) {
        setBranches(data.results)

        // ✅ IMPORTANT FIX
        setTotalItems(data.pagination?.total_items || 0)
        setTotalPages(data.pagination?.total_pages || 1)

      } else if (Array.isArray(data)) {
        setBranches(data)
        setTotalItems(data.length)
        setTotalPages(Math.ceil(data.length / itemsPerPage))
      }

    } catch (err) {
      console.error('Failed to load branches:', err)
      setError('Failed to load branches')
    } finally {
      setLoading(false)
    }
  }

  const handleAddBranch = async (formData: any) => {
    try {
      setLoading(true)
      if (editingBranch) {
        await branchesAPI.updateBranch(editingBranch.id, formData)
        setEditingBranch(null)
      } else {
        await branchesAPI.createBranch(formData)
      }
      await loadBranches()
      setShowModal(false)
    } catch {
      setError('Failed to save branch')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async (branch: any) => {
    try {
      setLoading(true)
      const fullData = await branchesAPI.getBranch(branch.id)
      setEditingBranch(fullData)
      setShowModal(true)
    } catch {
      setEditingBranch(branch)
      setShowModal(true)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (branch: any) => {
    if (confirm(`Are you sure you want to delete ${branch.name}?`)) {
      try {
        setLoading(true)
        await branchesAPI.deleteBranch(branch.id)
        await loadBranches()
      } catch {
        setError('Failed to delete branch')
      } finally {
        setLoading(false)
      }
    }
  }

  const columns = [
    {
      header: 'Gallery',
      accessor: 'gallery_id',
      width: '80px',
      render: (value: number, row: any) => (
        <a href={`/admin/gallery/${row.id}`} className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm font-semibold">
          <ImageIcon size={16} />
          View
        </a>
      ),
    },
    {
      header: 'Map',
      accessor: 'map_id',
      width: '80px',
      render: (value: number, row: any) => (
        <button onClick={() => { setSelectedBranch(row); setShowMapShareModal(true) }}
          className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm font-semibold">
          <MapPin size={16} />
          View
        </button>
      ),
    },
    { header: 'Branch Name', accessor: 'name', width: '180px' },
    { header: 'City', accessor: 'city', width: '120px' },
    { header: 'Operating Hours', accessor: 'operating_hours', width: '160px' },
    { header: 'Delivery Time', accessor: 'delivery_time', width: '140px' },
    {
      header: 'Rating',
      accessor: 'rating',
      width: '100px',
      render: (value: number) => (
        <div className="flex items-center gap-1">
          <Star size={16} className="text-yellow-500 fill-yellow-500" />
          <span className="font-semibold">{value}</span>
        </div>
      ),
    },
    {
      header: 'Reviews',
      accessor: 'reviews',
      width: '100px',
      render: (value: any) => {
        let count = Array.isArray(value) ? value.length : value || 0
        return <span className="text-sm font-semibold text-gray-600">{count} reviews</span>
      },
    },
    { header: 'Phone', accessor: 'phone', width: '140px' },
    { header: 'Email', accessor: 'email', width: '200px' },
    {
      header: 'Status',
      accessor: 'status',
      width: '100px',
      render: (value: string) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          value === 'ACTIVE' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
        }`}>
          {value}
        </span>
      ),
    },
  ]

  return (
    <AdminLayout>
      <div className="space-y-4 md:space-y-6">

        {/* Search */}
        <div className="flex items-center gap-2 bg-white border-2 border-primary/30 rounded-lg px-4 py-3">
          <Search size={18} className="text-primary" />
          <input
            value={searchTerm}
            onChange={(e) => {
              setCurrentPage(1)
              setSearchTerm(e.target.value)
            }}
            className="flex-1 bg-transparent outline-none"
          />
        </div>

        {/* Table */}
        <div className="border-2 border-primary/20 rounded-lg overflow-hidden shadow-sm">
          <DataTable
            columns={columns}
            data={branches}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}   // ✅ FIXED
            onPageChange={setCurrentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
          />
        </div>

      </div>
    </AdminLayout>
  )
}