'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Bell, Trash2, CheckCircle } from 'lucide-react'
import { Pagination } from '@/components/admin/pagination'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 10

  useEffect(() => {
    const mockNotifications = [
      { id: 1, title: 'New Reservation', message: 'Rajesh Kumar booked a table for 4 guests', type: 'reservation', timestamp: '2024-03-05 14:30', read: false },
      { id: 2, title: 'New Contact Inquiry', message: 'Priya Sharma submitted contact form', type: 'inquiry', timestamp: '2024-03-05 13:15', read: false },
      { id: 3, title: 'New Review', message: 'Amit Patel left a 5-star review', type: 'review', timestamp: '2024-03-04 10:45', read: true },
      { id: 4, title: 'Franchise Enquiry', message: 'New franchise application received', type: 'franchise', timestamp: '2024-03-04 09:20', read: true },
    ]
    setNotifications(mockNotifications)
  }, [])

  const handleMarkAsRead = (notification: any) => {
    setNotifications(
      notifications.map((n) =>
        n.id === notification.id ? { ...n, read: true } : n
      )
    )
  }

  const handleDelete = (notification: any) => {
    if (confirm('Delete notification?')) {
      setNotifications(notifications.filter((n) => n.id !== notification.id))
    }
  }

  const paginatedNotifications = notifications.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const totalPages = Math.ceil(notifications.length / itemsPerPage)

  const getTypeColor = (type: string) => {
    const colorMap: any = {
      reservation: 'bg-blue-100 text-blue-700',
      inquiry: 'bg-green-100 text-green-700',
      review: 'bg-yellow-100 text-yellow-700',
      franchise: 'bg-purple-100 text-purple-700',
    }
    return colorMap[type] || colorMap.inquiry
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notification Center</h1>
          <p className="text-sm text-gray-600 mt-1">Manage system notifications</p>
        </div>

        <div className="space-y-3">
          {paginatedNotifications.map((notification) => (
            <div key={notification.id} className={`border-2 rounded-lg p-4 transition-all ${notification.read ? 'border-gray-200 bg-gray-50' : 'border-primary/30 bg-primary/5'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}>
                    <Bell size={16} />
                  </div>

                  <div className="flex-1">
                    <p className={`font-bold ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>{notification.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-2">{notification.timestamp}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!notification.read && (
                    <button
                      onClick={() => handleMarkAsRead(notification)}
                      className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                      title="Mark as read"
                    >
                      <CheckCircle size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notification)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={notifications.length}
            itemsPerPage={itemsPerPage}
          />
        )}
      </div>
    </AdminLayout>
  )
}
