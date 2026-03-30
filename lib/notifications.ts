export interface Notification {
  id: string
  message: string
  timestamp: Date
  read: boolean
  type: 'info' | 'warning' | 'success' | 'error'
}

// Initialize with some sample notifications
export const getInitialNotifications = (): Notification[] => {
  const stored = typeof window !== 'undefined' ? localStorage.getItem('notifications') : null
  if (stored) {
    try {
      return JSON.parse(stored).map((n: any) => ({
        ...n,
        timestamp: new Date(n.timestamp),
      }))
    } catch {
      return getDefaultNotifications()
    }
  }
  return getDefaultNotifications()
}

const getDefaultNotifications = (): Notification[] => {
  return [
    {
      id: '1',
      message: 'New order received from Downtown Branch',
      timestamp: new Date(),
      read: false,
      type: 'info',
    },
    {
      id: '2',
      message: 'Menu item "Paneer Tikka" updated successfully',
      timestamp: new Date(Date.now() - 300000),
      read: true,
      type: 'success',
    },
  ]
}

export const saveNotifications = (notifications: Notification[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('notifications', JSON.stringify(notifications))
  }
}

export const addNotification = (message: string, type: Notification['type'] = 'info') => {
  if (typeof window !== 'undefined') {
    const notifications = getInitialNotifications()
    const newNotification: Notification = {
      id: Date.now().toString(),
      message,
      timestamp: new Date(),
      read: false,
      type,
    }
    notifications.unshift(newNotification)
    saveNotifications(notifications)
    // Dispatch custom event to update components
    window.dispatchEvent(new Event('notificationsUpdated'))
  }
}
