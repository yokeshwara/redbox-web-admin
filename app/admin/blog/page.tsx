'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { DataTable } from '@/components/admin/data-table'
import { Pagination } from '@/components/admin/pagination'
import { BlogFormModal } from '@/components/admin/blog-form-modal'
import { Plus, Search, Calendar, Eye } from 'lucide-react'

export default function BlogPage() {
  const [blogs, setBlogs] = useState<any[]>([])
  const [filteredBlogs, setFilteredBlogs] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [editingBlog, setEditingBlog] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const [formData, setFormData] = useState<any>({
    title: '',
    category: 'Food',
    author: '',
    content: '',
    excerpt: '',
    image: '',
    status: 'Draft',
  })

  // Load initial data with localStorage persistence
  useEffect(() => {
    const stored = localStorage.getItem('redbox_blogs')
    if (stored) {
      try {
        const data = JSON.parse(stored)
        setBlogs(data)
        setFilteredBlogs(data)
      } catch {
        initializeDefaultData()
      }
    } else {
      initializeDefaultData()
    }
  }, [])

  const initializeDefaultData = () => {
    const mockBlogs = [
      {
        id: 1,
        title: '5 Secrets to Cooking the Perfect Chilli Chicken',
        category: 'Food',
        author: 'Chef Rahul',
        content: 'Learn the secrets behind making the perfect chilli chicken that will impress your guests...',
        excerpt: 'Discover the 5 essential secrets that make our chilli chicken stand out.',
        image: 'https://images.unsplash.com/photo-1565937539825-682bc35bfa10?w=600&h=400&fit=crop',
        status: 'Published',
        date: '2024-02-15',
        views: 1245,
        readTime: 5,
      },
      {
        id: 2,
        title: 'From Wok to Plate How We Prepare Our Hakka Noodles',
        category: 'Food',
        author: 'Chef Priya',
        content: 'An in-depth look at our cooking process and the techniques we use to create perfect hakka noodles...',
        excerpt: 'Discover our step-by-step process for making authentic hakka noodles.',
        image: 'https://images.unsplash.com/photo-1571407970349-bc1dc8935e6e?w=600&h=400&fit=crop',
        status: 'Published',
        date: '2024-02-10',
        views: 980,
        readTime: 6,
      },
      {
        id: 3,
        title: 'Hosting Events at Our Place - A Guide to Private Dining',
        category: 'Events',
        author: 'Chef Amit',
        content: 'Everything you need to know about hosting your special events at Red Box...',
        excerpt: 'A comprehensive guide to booking and hosting events at our restaurants.',
        image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=600&h=400&fit=crop',
        status: 'Published',
        date: '2024-02-05',
        views: 750,
        readTime: 8,
      },
      {
        id: 4,
        title: 'The Health Benefits of Indo-Chinese Cuisine',
        category: 'Nutrition',
        author: 'Nutritionist Sarah',
        content: 'Explore the nutritional aspects and health benefits of Indo-Chinese cuisine...',
        excerpt: 'Learn why Indo-Chinese food can be part of a healthy diet.',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop',
        status: 'Draft',
        date: '2024-02-01',
        views: 0,
        readTime: 7,
      },
    ]
    setBlogs(mockBlogs)
    setFilteredBlogs(mockBlogs)
    localStorage.setItem('redbox_blogs', JSON.stringify(mockBlogs))
  }

  useEffect(() => {
    let filtered = blogs.filter((b) =>
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.author.toLowerCase().includes(searchTerm.toLowerCase())
    )
    if (statusFilter !== 'All') {
      filtered = filtered.filter((b) => b.status === statusFilter)
    }
    setFilteredBlogs(filtered)
    setCurrentPage(1)
  }, [searchTerm, statusFilter, blogs])

  const paginatedBlogs = filteredBlogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    let updated: any[] = []
    if (editingBlog) {
      updated = blogs.map((b) =>
        b.id === editingBlog.id ? { ...b, ...formData } : b
      )
    } else {
      const newBlog = {
        id: Math.max(...blogs.map((b) => b.id), 0) + 1,
        ...formData,
        date: new Date().toISOString().split('T')[0],
        views: 0,
        readTime: Math.ceil(formData.content.split(' ').length / 200),
      }
      updated = [...blogs, newBlog]
    }
    setBlogs(updated)
    localStorage.setItem('redbox_blogs', JSON.stringify(updated))
    resetForm()
  }

  const handleEdit = (blog: any) => {
    setEditingBlog(blog)
    setFormData(blog)
    setShowModal(true)
  }

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      const updated = blogs.filter((b) => b.id !== id)
      setBlogs(updated)
      localStorage.setItem('redbox_blogs', JSON.stringify(updated))
    }
  }

  const resetForm = () => {
    setShowModal(false)
    setEditingBlog(null)
    setFormData({
      title: '',
      category: 'Food',
      author: '',
      content: '',
      excerpt: '',
      image: '',
      status: 'Draft',
    })
  }

  const columns = [
    {
      header: 'Blog Title',
      accessor: 'title',
      width: '250px',
      render: (value: string, row: any) => (
        <div className="flex items-start gap-3">
          {row.image && (
            <img
              src={row.image}
              alt={value}
              className="w-12 h-12 rounded object-cover flex-shrink-0"
            />
          )}
          <div>
            <p className="font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-600">By {row.author}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Category',
      accessor: 'category',
      width: '120px',
      render: (value: string) => (
        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
          {value}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      width: '100px',
      render: (value: string) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
            value === 'Published'
              ? 'bg-green-500/20 text-green-600'
              : 'bg-gray-500/20 text-gray-600'
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      header: 'Views',
      accessor: 'views',
      width: '100px',
      render: (value: number) => (
        <div className="flex items-center gap-2">
          <Eye size={16} className="text-blue-600" />
          <span className="font-semibold text-gray-900">{value}</span>
        </div>
      ),
    },
    {
      header: 'Read Time',
      accessor: 'readTime',
      width: '100px',
      render: (value: number) => (
        <span className="text-sm text-gray-700">{value} min read</span>
      ),
    },
    {
      header: 'Date',
      accessor: 'date',
      width: '100px',
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-gray-600" />
          <span className="text-sm text-gray-700">{value}</span>
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
            <h1 className="text-2xl md:text-4xl font-bold whitespace-nowrap">Blog Management</h1>
            <p className="text-xs md:text-base text-red-100 mt-1">Create and manage blog posts</p>
          </div>
          <button
            onClick={() => resetForm()}
            className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-white text-red-600 rounded-lg font-bold hover:bg-red-50 transition-all shadow-md whitespace-nowrap"
          >
            <Plus size={18} className="md:block hidden" />
            <Plus size={16} className="md:hidden" />
            <span className="text-sm md:text-base">Write Post</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex items-center gap-2 bg-white border-2 border-red-200 rounded-lg px-4 py-3 hover:border-red-400 transition-colors">
            <Search size={20} className="text-red-600" />
            <input
              type="text"
              placeholder="Search by title or author..."
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
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="border-2 border-red-200 rounded-lg overflow-hidden shadow-sm">
          <DataTable
            columns={columns}
            data={paginatedBlogs}
            onEdit={handleEdit}
            onDelete={(row) => handleDelete(row.id)}
            actions={true}
          />
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsCount={paginatedBlogs.length}
            totalItems={filteredBlogs.length}
            onPageChange={setCurrentPage}
          />
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatBox label="Total Posts" value={blogs.length.toString()} />
          <StatBox
            label="Published"
            value={blogs.filter((b) => b.status === 'Published').length.toString()}
          />
          <StatBox
            label="Total Views"
            value={blogs.reduce((sum, b) => sum + b.views, 0).toString()}
          />
          <StatBox
            label="Avg Read Time"
            value={
              blogs.length > 0
                ? Math.round(blogs.reduce((sum, b) => sum + b.readTime, 0) / blogs.length) + ' min'
                : '0'
            }
          />
        </div>

        {/* Modal */}
        {showModal && (
          <BlogFormModal
            item={editingBlog}
            onSubmit={handleSubmit}
            onClose={resetForm}
          />
        )}
      </div>
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
