'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { DataTable } from '@/components/admin/data-table'
import { Pagination } from '@/components/admin/pagination'
import { Plus, Search, MapPin, Image as ImageIcon, Star, Clock, Phone, Mail, Map, AlertCircle } from 'lucide-react'
import { BranchFormModal } from '@/components/admin/branch-form-modal'
import { BranchMapModal } from '@/components/admin/branch-map-modal'
import { BranchDetailMapModal } from '@/components/admin/branch-detail-map-modal'
import { BranchMapShareModal } from '@/components/admin/branch-map-share-modal'
import { BranchGalleryModal } from '@/components/admin/branch-gallery-modal'
import { BranchPremiumCard } from '@/components/admin/branch-premium-card'
import { branchesAPI } from '@/lib/api/branches'
import { isAuthenticated } from '@/lib/auth'

export default function BranchesPage() {
  const [branches, setBranches] = useState<any[]>([])
  const [filteredBranches, setFilteredBranches] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showMapModal, setShowMapModal] = useState(false)
  const [showDetailMapModal, setShowDetailMapModal] = useState(false)
  const [showMapShareModal, setShowMapShareModal] = useState(false)
  const [showGalleryModal, setShowGalleryModal] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState<any>(null)
  const [editingBranch, setEditingBranch] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<'table' | 'gallery'>('table')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [authenticated, setAuthenticated] = useState(false)
  const itemsPerPage = 5

  // Check authentication and load data
  useEffect(() => {
    const isAuth = isAuthenticated()
    setAuthenticated(isAuth)

    if (!isAuth) {
      setError('Please log in to access branch data')
      return
    }

    loadBranches()
  }, [])

  const loadBranches = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await branchesAPI.listBranches(currentPage, itemsPerPage, searchTerm)
      
      if (data.results) {
        setBranches(data.results)
        setFilteredBranches(data.results)
      } else if (Array.isArray(data)) {
        setBranches(data)
        setFilteredBranches(data)
      }
    } catch (err) {
      console.error('Failed to load branches:', err)
      setError('Failed to load branches. Please ensure you are logged in.')
      // Fallback to mock data for demonstration
 
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const filtered = branches.filter(
      (branch) =>
        branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.address.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredBranches(filtered)
  }, [searchTerm, branches])

  const handleAddBranch = async (formData: any) => {
    try {
      setLoading(true)
      if (editingBranch) {
        // Update existing branch
        await branchesAPI.updateBranch(editingBranch.id, formData)
        setEditingBranch(null)
      } else {
        // Create new branch
        await branchesAPI.createBranch(formData)
      }
      await loadBranches()
      setShowModal(false)
    } catch (err) {
      console.error('Error saving branch:', err)
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
    } catch (err) {
      console.error('Error loading branch:', err)
      setError('Failed to load branch details')
      // Fallback: use the branch data from table
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
        setBranches(branches.filter((b) => b.id !== branch.id))
      } catch (err) {
        console.error('Error deleting branch:', err)
        setError('Failed to delete branch')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleOpenGallery = (branch: any) => {
    setSelectedBranch(branch)
    setShowGalleryModal(true)
  }

  const handleUpdateBranchGallery = (updatedBranch: any) => {
    setBranches(branches.map((b) => (b.id === updatedBranch.id ? updatedBranch : b)))
    if (editingBranch && editingBranch.id === updatedBranch.id) {
      setEditingBranch(updatedBranch)
    }
  }



  const columns = [
    {
      header: 'Gallery',
      accessor: 'gallery_id',
      width: '80px',
      render: (value: number, row: any) => (
        <a
          href={`/admin/gallery/${row.id}`}
          className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-semibold"
        >
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
        <button
          onClick={() => {
            setSelectedBranch(row)
            setShowMapShareModal(true)
          }}
          className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-semibold"
        >
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
    let reviewCount = 0

    if (Array.isArray(value)) {
      reviewCount = value.length
    } else if (value && typeof value === 'object') {
      reviewCount = 1
    } else if (typeof value === 'number') {
      reviewCount = value
    }

    return (
      <span className="text-sm font-semibold text-gray-600">
        {reviewCount} reviews
      </span>
    )
  },
},
    { header: 'Phone', accessor: 'phone', width: '140px' },
    { header: 'Email', accessor: 'email', width: '200px' },
    { header: 'Status', accessor: 'status', width: '100px', render: (value: string) => (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
        value === 'Active' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
      }`}>
        {value}
      </span>
    ) },
  ]

  return (
    <AdminLayout>
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary via-primary/95 to-secondary rounded-lg p-4 md:p-6 shadow-lg flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4 text-white">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold whitespace-nowrap">Branch Management</h1>
            <p className="text-xs md:text-base text-white/80 mt-1">Manage all restaurant branches and locations</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={() => setShowMapModal(true)}
              className="flex items-center justify-center gap-2 flex-1 md:flex-none px-4 md:px-6 py-2 md:py-3 bg-white/20 text-white rounded-lg font-bold hover:bg-white/30 transition-all"
            >
              <Map size={18} className="md:block hidden" />
              <Map size={16} className="md:hidden flex-shrink-0" />
              <span className="text-sm md:text-base">Maps</span>
            </button>
            <button
              onClick={() => {
                setEditingBranch(null)
                setShowModal(true)
              }}
              className="flex items-center justify-center gap-2 flex-1 md:flex-none px-4 md:px-6 py-2 md:py-3 bg-white text-primary rounded-lg font-bold hover:bg-white/90 transition-all shadow-md"
            >
              <Plus size={18} className="md:block hidden" />
              <Plus size={16} className="md:hidden flex-shrink-0" />
              <span className="text-sm md:text-base">Add</span>
            </button>
          </div>
        </div>

        {/* Alerts */}
        {!authenticated && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-start gap-3">
            <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900">Authentication Required</h3>
              <p className="text-sm text-red-800">Please log in to access branch data</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-start gap-3">
            <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900">Error</h3>
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        {loading && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
            <p className="text-sm text-blue-800">Loading...</p>
          </div>
        )}

        {/* Search Bar */}
        <div className="flex items-center gap-2 bg-white border-2 border-primary/30 rounded-lg px-4 py-3 hover:border-primary hover:shadow-md transition-all">
          <Search size={18} className="text-primary flex-shrink-0" />
          <input
            type="text"
            placeholder="Search by branch name, city, or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent outline-none text-foreground placeholder-muted-foreground"
          />
        </div>

        {/* Data Table */}
        <div className="border-2 border-primary/20 rounded-lg overflow-hidden shadow-sm">
          <DataTable
            columns={columns}
            data={filteredBranches.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredBranches.length / itemsPerPage)}
            onPageChange={setCurrentPage}
            totalItems={filteredBranches.length}
            itemsPerPage={itemsPerPage}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatBox label="Total Branches" value={branches.length.toString()} color="black" />
          <StatBox label="Active Branches" value={branches.filter((b) => b.status === 'Active').length.toString()} color="black" />
          <StatBox label="Cities Covered" value={new Set(branches.map((b) => b.city)).size.toString()} color="black" />
        </div>
      </div>

      {/* Modals */}
      {showModal && (
        <BranchFormModal
          branch={editingBranch}
          onSubmit={handleAddBranch}
          onClose={() => {
            setShowModal(false)
            setEditingBranch(null)
          }}
          onOpenGallery={handleOpenGallery}
        />
      )}

      {showMapModal && (
        <BranchMapModal
          branches={branches}
          onClose={() => setShowMapModal(false)}
        />
      )}

      {showDetailMapModal && selectedBranch && (
        <BranchDetailMapModal
          branch={selectedBranch}
          onClose={() => {
            setShowDetailMapModal(false)
            setSelectedBranch(null)
          }}
        />
      )}

      {showMapShareModal && selectedBranch && (
        <BranchMapShareModal
          branch={selectedBranch}
          onClose={() => {
            setShowMapShareModal(false)
            setSelectedBranch(null)
          }}
        />
      )}

      {showGalleryModal && selectedBranch && (
        <BranchGalleryModal
          branch={selectedBranch}
          onClose={() => {
            setShowGalleryModal(false)
            setSelectedBranch(null)
          }}
          onUpdateBranch={handleUpdateBranchGallery}
        />
      )}
    </AdminLayout>
  )
}

function StatBox({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="bg-white border border-border rounded-lg p-4">
      <p className="text-muted-foreground text-sm mb-2">{label}</p>
      <p className="text-3xl font-bold text-black">{value}</p>
    </div>
  )
}
