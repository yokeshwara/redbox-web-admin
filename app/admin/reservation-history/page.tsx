'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { DataTable } from '@/components/admin/data-table'
import { Pagination } from '@/components/admin/pagination'
import { Search } from 'lucide-react'

export default function ReservationHistoryPage() {
  const [history, setHistory] = useState<any[]>([])
  const [filteredHistory, setFilteredHistory] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 10

  useEffect(() => {
    const mockHistory = [
      { id: 1, reservationId: 'RES001', customerName: 'Rajesh Kumar', previousStatus: 'pending', currentStatus: 'confirmed', changedAt: '2024-03-05 14:30', changedBy: 'Admin' },
      { id: 2, reservationId: 'RES002', customerName: 'Priya Sharma', previousStatus: 'pending', currentStatus: 'confirmed', changedAt: '2024-03-04 10:15', changedBy: 'Admin' },
      { id: 3, reservationId: 'RES003', customerName: 'Amit Patel', previousStatus: 'confirmed', currentStatus: 'completed', changedAt: '2024-03-03 22:45', changedBy: 'System' },
    ]
    setHistory(mockHistory)
    setFilteredHistory(mockHistory)
  }, [])

  useEffect(() => {
    let filtered = history.filter((h) =>
      h.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.reservationId.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (statusFilter !== 'All') {
      filtered = filtered.filter((h) => h.currentStatus === statusFilter)
    }

    setFilteredHistory(filtered)
    setCurrentPage(1)
  }, [searchTerm, statusFilter, history])

  const paginatedHistory = filteredHistory.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage)

  const getStatusColor = (status: string) => {
    const colorMap: any = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-green-100 text-green-700',
      completed: 'bg-blue-100 text-blue-700',
      cancelled: 'bg-red-100 text-red-700',
    }
    return colorMap[status] || colorMap.pending
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reservation Status History</h1>
          <p className="text-sm text-gray-600 mt-1">Track all reservation status changes</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 flex items-center gap-2 bg-white border-2 border-primary/30 rounded-lg px-4 py-2">
            <Search size={18} className="text-primary" />
            <input type="text" placeholder="Search history..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-1 outline-none text-gray-900 bg-transparent" />
          </div>

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 border-2 border-primary/30 rounded-lg text-gray-900 bg-white">
            <option value="All">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <DataTable
          columns={[
            { header: 'Reservation ID', accessor: 'reservationId' },
            { header: 'Customer', accessor: 'customerName' },
            { header: 'Previous Status', accessor: 'previousStatus', render: (val) => <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(val)}`}>{val}</span> },
            { header: 'Current Status', accessor: 'currentStatus', render: (val) => <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(val)}`}>{val}</span> },
            { header: 'Changed At', accessor: 'changedAt' },
            { header: 'Changed By', accessor: 'changedBy' },
          ]}
          data={paginatedHistory}
          actions={false}
        />

        {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={filteredHistory.length} itemsPerPage={itemsPerPage} />}
      </div>
    </AdminLayout>
  )
}
