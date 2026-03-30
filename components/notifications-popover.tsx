'use client'

import { useEffect, useRef, useState } from 'react'
import { Bell, X, Trash2 } from 'lucide-react'
import { Notification, getInitialNotifications, saveNotifications } from '@/lib/notifications'

export function NotificationsPopover() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load initial notifications
    const initial = getInitialNotifications()
    setNotifications(initial)

    // Listen for updates
    const handleNotificationsUpdated = () => {
      const updated = getInitialNotifications()
      setNotifications(updated)
    }

    window.addEventListener('notificationsUpdated', handleNotificationsUpdated)
    return () => window.removeEventListener('notificationsUpdated', handleNotificationsUpdated)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleMarkAsRead = (id: string) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    )
    setNotifications(updated)
    saveNotifications(updated)
  }

  const handleClearAll = () => {
    setNotifications([])
    saveNotifications([])
  }

  const handleDeleteNotification = (id: string) => {
    const updated = notifications.filter((n) => n.id !== id)
    setNotifications(updated)
    saveNotifications(updated)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-l-4 border-green-500'
      case 'error':
        return 'bg-red-50 border-l-4 border-red-500'
      case 'warning':
        return 'bg-yellow-50 border-l-4 border-yellow-500'
      default:
        return 'bg-blue-50 border-l-4 border-blue-500'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✓'
      case 'error':
        return '✕'
      case 'warning':
        return '⚠'
      default:
        return 'ℹ'
    }
  }

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-primary/15 active:bg-primary/25 rounded-lg transition-all text-primary border-2 border-primary/40 hover:border-primary/60"
        title="Notifications"
      >
        <Bell size={22} strokeWidth={2} fill="currentColor" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white transform translate-x-0.5 -translate-y-0.5 bg-primary rounded-full min-w-max">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed sm:absolute bottom-0 sm:bottom-auto left-1 right-0 sm:left-1 sm:right-auto sm:mt-2 w-[calc(100%-8px)] sm:w-80 bg-white rounded-t-lg sm:rounded-lg shadow-2xl border border-gray-200 z-50 max-h-96 flex flex-col sm:max-h-96 max-h-[80vh]">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
            <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
            {notifications.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-xs text-primary hover:text-primary/80 font-semibold hover:bg-primary/10 px-2 py-1 rounded transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                No notifications yet
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 flex gap-3 hover:bg-gray-50 transition-colors ${
                      !notif.read ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                        notif.type === 'success'
                          ? 'bg-green-500'
                          : notif.type === 'error'
                            ? 'bg-red-500'
                            : notif.type === 'warning'
                              ? 'bg-yellow-500'
                              : 'bg-blue-500'
                      }`}
                    >
                      {getTypeIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 break-words">
                        {notif.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notif.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteNotification(notif.id)}
                      className="flex-shrink-0 text-gray-400 hover:text-primary transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
