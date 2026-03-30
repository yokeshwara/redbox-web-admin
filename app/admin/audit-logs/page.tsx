'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { DataTable } from '@/components/admin/data-table'
import { Pagination } from '@/components/admin/pagination'
import { Search, Plus, Edit2, Trash2 } from 'lucide-react'
import { CRUDModal } from '@/components/admin/crud-modal'

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [filteredLogs, setFilteredLogs] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [actionFilter, setActionFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [editingLog, setEditingLog] = useState<any>(null)
  const [formData, setFormData] = useState({
    user: '',
    action: 'CREATE',
    module: '',
    details: '',
  })

  const itemsPerPage = 20

  useEffect(() => {
    const mockLogs = [
      { id: 1, user: 'Admin User', action: 'CREATE', module: 'Menu', timestamp: '2024-03-05 14:30:22', details: 'Added new menu item' },
      { id: 2, user: 'Admin User', action: 'UPDATE', module: 'Branch', timestamp: '2024-03-05 13:15:00', details: 'Updated branch details' },
      { id: 3, user: 'Manager', action: 'DELETE', module: 'Promotion', timestamp: '2024-03-04 10:45:30', details: 'Deleted expired promotion' },
      { id: 4, user: 'Admin User', action: 'CREATE', module: 'Reservation', timestamp: '2024-03-04 09:20:15', details: 'Created manual reservation' },
    ]
    setLogs(mockLogs)
    setFilteredLogs(mockLogs)
  }, [])

  useEffect(() => {
    let filtered = logs.filter((log) =>
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (actionFilter !== 'All') {
      filtered = filtered.filter((log) => log.action === actionFilter)
    }

    setFilteredLogs(filtered)
    setCurrentPage(1)
  }, [searchTerm, actionFilter, logs])

  const handleAddNew = () => {
    setEditingLog(null)
    setFormData({
      user: '',
      action: 'CREATE',
      module: '',
      details: '',
    })
    setShowModal(true)
  }

  const handleEdit = (log: any) => {
    setEditingLog(log)
    setFormData({
      user: log.user,
      action: log.action,
      module: log.module,
      details: log.details,
    })
    setShowModal(true)
  }

  const handleDelete = (log: any) => {
    if (confirm('Delete log entry?')) {
      setLogs(logs.filter((l) => l.id !== log.id))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.user.trim() || !formData.module.trim() || !formData.details.trim()) return

    if (editingLog) {
      setLogs(logs.map((l) => (l.id === editingLog.id ? { ...l, ...formData } : l)))
    } else {
      const newLog = {
        id: Math.max(...logs.map((l) => l.id), 0) + 1,
        ...formData,
        timestamp: new Date().toLocaleString('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\//g, '-').split('-').reverse().join('-') + ' ' + new Date().toLocaleTimeString(),
      }
      setLogs([newLog, ...logs])
    }
    setShowModal(false)
  }

  const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage)

  const getActionColor = (action: string) => {
    const colorMap: any = {
      CREATE: 'bg-green-100 text-green-700',
      UPDATE: 'bg-blue-100 text-blue-700',
      DELETE: 'bg-red-100 text-red-700',
      VIEW: 'bg-gray-100 text-gray-700',
    }
    return colorMap[action] || colorMap.VIEW
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
            <p className="text-sm text-gray-600 mt-1">Track and manage all administrative activities</p>
          </div>
          <button onClick={handleAddNew} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all font-semibold">
            <Plus size={20} />
            Add Log
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 flex items-center gap-2 bg-white border-2 border-primary/30 rounded-lg px-4 py-2">
            <Search size={18} className="text-primary" />
            <input type="text" placeholder="Search logs..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-1 outline-none text-gray-900 bg-transparent" />
          </div>

          <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} className="px-4 py-2 border-2 border-primary/30 rounded-lg text-gray-900 bg-white">
            <option value="All">All Actions</option>
            <option value="CREATE">Create</option>
            <option value="UPDATE">Update</option>
            <option value="DELETE">Delete</option>
            <option value="VIEW">View</option>
          </select>
        </div>

        <div className="space-y-3">
          {paginatedLogs.map((log) => (
            <div key={log.id} className="bg-white border-2 border-primary/20 rounded-lg p-4 hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-bold text-gray-900">{log.user}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getActionColor(log.action)}`}>{log.action}</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">{log.module}</span>
                  </div>
                  <p className="text-gray-700 text-sm">{log.details}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(log)} className="p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(log)} className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-500">{log.timestamp}</p>
            </div>
          ))}
        </div>

        {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={filteredLogs.length} itemsPerPage={itemsPerPage} />}
      </div>

      <CRUDModal isOpen={showModal} title="Audit Log" isEditing={!!editingLog} onClose={() => setShowModal(false)} onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">User *</label>
            <input type="text" placeholder="Admin User" value={formData.user} onChange={(e) => setFormData({ ...formData, user: e.target.value })} className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-gray-900" required />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Action</label>
            <select value={formData.action} onChange={(e) => setFormData({ ...formData, action: e.target.value })} className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-gray-900 bg-white">
              <option value="CREATE">Create</option>
              <option value="UPDATE">Update</option>
              <option value="DELETE">Delete</option>
              <option value="VIEW">View</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Module *</label>
            <input type="text" placeholder="Menu, Branch, Promotion, etc." value={formData.module} onChange={(e) => setFormData({ ...formData, module: e.target.value })} className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-gray-900" required />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Details *</label>
            <textarea placeholder="What was done..." value={formData.details} onChange={(e) => setFormData({ ...formData, details: e.target.value })} className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-gray-900 resize-none" rows={3} required />
          </div>
        </div>
      </CRUDModal>
    </AdminLayout>
  )
}
