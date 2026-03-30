'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { DataTable } from '@/components/admin/data-table'
import { Pagination } from '@/components/admin/pagination'
import { Search, Calendar, Users, DollarSign } from 'lucide-react'

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [filteredEvents, setFilteredEvents] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Load initial data with localStorage persistence
  useEffect(() => {
    const stored = localStorage.getItem('redbox_events')
    if (stored) {
      try {
        const data = JSON.parse(stored)
        setEvents(data)
        setFilteredEvents(data)
      } catch {
        initializeDefaultData()
      }
    } else {
      initializeDefaultData()
    }
  }, [])

  const initializeDefaultData = () => {
    const mockEvents = [
      {
        id: 1,
        title: 'Corporate Events & Team Parties',
        category: 'Corporate Events',
        description: 'Impress your colleagues with a fun, flavorful Red Box experience. Custom menus and group packages available.',
        maxGuests: 500,
        minPrice: 5000,
        maxPrice: 50000,
        image: 'https://images.unsplash.com/photo-1540575467063-178f50002c4b?w=600&h=400&fit=crop',
        features: 'Custom Menus, Group Packages, Dedicated Staff, Audio/Visual Setup',
        bookings: 15,
        status: 'Active',
      },
      {
        id: 2,
        title: 'Birthday Parties & Family Celebrations',
        category: 'Birthday Parties',
        description: 'Make your special day unforgettable with customized menus and a festive atmosphere.',
        maxGuests: 300,
        minPrice: 3000,
        maxPrice: 25000,
        image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=600&h=400&fit=crop',
        features: 'Birthday Decorations, Customized Menu, Festive Ambiance, Cake Cutting Service',
        bookings: 24,
        status: 'Active',
      },
      {
        id: 3,
        title: 'Private Dining & Special Occasions',
        category: 'Private Dining',
        description: 'Create memorable moments with intimate dining experiences tailored to your needs.',
        maxGuests: 100,
        minPrice: 10000,
        maxPrice: 60000,
        image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&h=400&fit=crop',
        features: 'Private Space, Personalized Menu, Premium Ambiance, Photography Setup',
        bookings: 18,
        status: 'Active',
      },
      {
        id: 4,
        title: 'Wedding Receptions',
        category: 'Wedding',
        description: 'Celebrate your special day with authentic Indo-Chinese cuisine and premium service.',
        maxGuests: 1000,
        minPrice: 100000,
        maxPrice: 500000,
        image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=600&h=400&fit=crop',
        features: 'Grand Setup, Multi-course Menu, Live Service, Wedding Coordination',
        bookings: 8,
        status: 'Active',
      },
    ]
    setEvents(mockEvents)
    setFilteredEvents(mockEvents)
    localStorage.setItem('redbox_events', JSON.stringify(mockEvents))
  }

  useEffect(() => {
    let filtered = events.filter((e) =>
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    if (categoryFilter !== 'All') {
      filtered = filtered.filter((e) => e.category === categoryFilter)
    }
    setFilteredEvents(filtered)
    setCurrentPage(1)
  }, [searchTerm, categoryFilter, events])

  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage)

  const categories = ['All', ...new Set(events.map((e) => e.category))]



  const columns = [
    {
      header: 'Event Title',
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
            <p className="text-xs text-gray-600">{row.category}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Max Guests',
      accessor: 'maxGuests',
      width: '120px',
      render: (value: number) => (
        <div className="flex items-center gap-2">
          <Users size={16} className="text-blue-600" />
          <span className="font-semibold text-gray-900">{value}</span>
        </div>
      ),
    },
    {
      header: 'Price Range',
      accessor: 'minPrice',
      width: '180px',
      render: (value: number, row: any) => (
        <div className="flex items-center gap-2">
          <DollarSign size={16} className="text-green-600" />
          <span className="font-semibold text-gray-900">₹{value} - ₹{row.maxPrice}</span>
        </div>
      ),
    },
    {
      header: 'Bookings',
      accessor: 'bookings',
      width: '100px',
      render: (value: number) => (
        <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 font-semibold text-sm">
          {value} bookings
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      width: '100px',
      render: (value: string) => (
        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-sm">
          {value}
        </span>
      ),
    },
  ]

  return (
    <AdminLayout>
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-lg p-4 md:p-6 shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-white">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold whitespace-nowrap">Event Management</h1>
            <p className="text-xs md:text-base text-red-100 mt-1">View all available events and packages</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex items-center gap-2 bg-white border-2 border-red-200 rounded-lg px-4 py-3 hover:border-red-400 transition-colors">
            <Search size={20} className="text-red-600" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent outline-none text-foreground placeholder-muted-foreground"
            />
          </div>
          <div className="flex items-center gap-2 bg-white border-2 border-red-200 rounded-lg px-4 py-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent outline-none text-foreground cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-white text-foreground">
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="border-2 border-red-200 rounded-lg overflow-hidden shadow-sm">
          <DataTable
            columns={columns}
            data={paginatedEvents}
          />
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsCount={paginatedEvents.length}
            totalItems={filteredEvents.length}
            onPageChange={setCurrentPage}
          />
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatBox label="Total Events" value={events.length.toString()} />
          <StatBox label="Total Bookings" value={events.reduce((sum, e) => sum + e.bookings, 0).toString()} />
          <StatBox label="Avg Price" value={`₹${Math.round(events.reduce((sum, e) => sum + ((e.minPrice + e.maxPrice) / 2), 0) / events.length)}`} />
          <StatBox label="Max Capacity" value={events.reduce((sum, e) => sum + e.maxGuests, 0).toString()} />
        </div>


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
