'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { DataTable } from '@/components/admin/data-table'
import { Pagination } from '@/components/admin/pagination'
import { Plus, Search, Eye, Trash2, Edit2, BookOpen } from 'lucide-react'
import { BlogFormModal } from '@/components/admin/blog-form-modal'

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([])
  const [filteredBlogs, setFilteredBlogs] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [editingBlog, setEditingBlog] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    const mockBlogs = [
      {
        id: 1,
        title: 'Top 5 Indo-Chinese Dishes You Must Try',
        category: 'Food',
        author: 'Admin User',
        excerpt: 'Discover the best Indo-Chinese dishes that blend tradition with innovation.',
        content: 'Lorem ipsum dolor sit amet...',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop',
        status: 'Published',
        readTime: 5,
        views: 1250,
        publishedDate: '2024-03-05',
      },
      {
        id: 2,
        title: 'Health Benefits of Our Special Recipe',
        category: 'Nutrition',
        author: 'John Doe',
        excerpt: 'Learn about the nutritional value and health benefits.',
        content: 'Lorem ipsum dolor sit amet...',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop',
        status: 'Published',
        readTime: 4,
        views: 890,
        publishedDate: '2024-03-04',
      },
      {
        id: 3,
        title: 'Planning Your Next Event with Red Box',
        category: 'Events',
        author: 'Admin User',
        excerpt: 'Perfect tips for hosting an unforgettable event.',
        content: 'Lorem ipsum dolor sit amet...',
        image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=600&h=400&fit=crop',
        status: 'Draft',
        readTime: 6,
        views: 450,
        publishedDate: '2024-03-03',
      },
    ]
    setBlogs(mockBlogs)
    setFilteredBlogs(mockBlogs)
  }, [])

  useEffect(() => {
    let filtered = blogs.filter((blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (statusFilter !== 'All') {
      filtered = filtered.filter((blog) => blog.status === statusFilter)
    }

    if (categoryFilter !== 'All') {
      filtered = filtered.filter((blog) => blog.category === categoryFilter)
    }

    setFilteredBlogs(filtered)
    setCurrentPage(1)
  }, [searchTerm, statusFilter, categoryFilter, blogs])

  const handleAddNew = () => {
    setEditingBlog(null)
    setShowModal(true)
  }

  const handleEdit = (blog: any) => {
    setEditingBlog(blog)
    setShowModal(true)
  }

  const handleDelete = (blog: any) => {
    if (confirm('Delete this blog post?')) {
      setBlogs(blogs.filter((b) => b.id !== blog.id))
    }
  }

  const handleSubmit = (data: any) => {
    if (editingBlog) {
      setBlogs(blogs.map((b) => (b.id === editingBlog.id ? { ...editingBlog, ...data } : b)))
    } else {
      const newBlog = {
        id: Math.max(...blogs.map((b) => b.id), 0) + 1,
        ...data,
        views: 0,
        publishedDate: new Date().toISOString().split('T')[0],
      }
      setBlogs([newBlog, ...blogs])
    }
    setShowModal(false)
  }

  const paginatedBlogs = filteredBlogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage)

  const columns = [
    {
      header: 'Title',
      accessor: 'title',
      render: (val: any, row: any) => (
        <div className="flex items-start gap-3">
          <img src={row.image} alt={val} className="w-12 h-12 rounded object-cover" />
          <div>
            <p className="font-semibold text-gray-900">{val}</p>
            <p className="text-xs text-gray-600">{row.author}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Category',
      accessor: 'category',
      render: (val: any) => <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">{val}</span>,
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (val: any) => (
        <span
          className={`px-2 py-1 rounded text-xs font-semibold ${val === 'Published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
        >
          {val}
        </span>
      ),
    },
    {
      header: 'Views',
      accessor: 'views',
      render: (val: any) => <span className="text-sm font-medium text-gray-900">{val.toLocaleString()}</span>,
    },
    {
      header: 'Read Time',
      accessor: 'readTime',
      render: (val: any) => <span className="text-sm text-gray-600">{val} min read</span>,
    },
    {
      header: 'Date',
      accessor: 'publishedDate',
      render: (val: any) => <span className="text-sm text-gray-600">{new Date(val).toLocaleDateString()}</span>,
    },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
            <p className="text-sm text-gray-600 mt-1">Manage and publish blog content</p>
          </div>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all font-semibold"
          >
            <Plus size={20} />
            Write Post
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 flex items-center gap-2 bg-white border-2 border-primary/30 rounded-lg px-4 py-2">
            <Search size={18} className="text-primary" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 outline-none text-gray-900 bg-transparent"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border-2 border-primary/30 rounded-lg text-gray-900 bg-white"
          >
            <option value="All">All Status</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border-2 border-primary/30 rounded-lg text-gray-900 bg-white"
          >
            <option value="All">All Categories</option>
            <option value="Food">Food</option>
            <option value="Nutrition">Nutrition</option>
            <option value="Events">Events</option>
            <option value="Recipes">Recipes</option>
            <option value="Tips & Tricks">Tips & Tricks</option>
            <option value="Customer Stories">Customer Stories</option>
          </select>
        </div>

        <DataTable columns={columns} data={paginatedBlogs} actions={false} />

        <div className="space-y-3">
          {paginatedBlogs.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-primary/20">
              <BookOpen size={48} className="mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600 font-medium">No blog posts found</p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredBlogs.length}
            itemsPerPage={itemsPerPage}
          />
        )}
      </div>

      {showModal && <BlogFormModal item={editingBlog} onSubmit={handleSubmit} onClose={() => setShowModal(false)} />}
    </AdminLayout>
  )
}
