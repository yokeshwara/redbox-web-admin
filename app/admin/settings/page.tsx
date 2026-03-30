'use client'

import { useState } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Save, Bell, Shield, Eye, EyeOff, LogOut, Lock } from 'lucide-react'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [showPassword, setShowPassword] = useState(false)
  const [saved, setSaved] = useState(false)

  // General Settings
  const [general, setGeneral] = useState({
    restaurantName: 'Redbox Restaurant',
    phoneNumber: '+91 98765 43210',
    email: 'info@redbox.com',
    address: '123 Main Street, City, State',
    timezone: 'IST',
  })

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    dailyReport: true,
    orderAlerts: true,
    franchiseUpdates: true,
  })

  // Security Settings
  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorAuth: false,
  })

  // Display Settings
  const [display, setDisplay] = useState({
    theme: 'red',
    language: 'english',
    itemsPerPage: '10',
    dateFormat: 'DD/MM/YYYY',
  })

  // System Settings
  const [system, setSystem] = useState({
    autoBackup: true,
    backupFrequency: 'daily',
    dataRetention: '365',
    apiKey: 'sk_live_xxxxxxxxxxxxxxx',
  })

  const handleGeneralChange = (field: string, value: string) => {
    setGeneral({ ...general, [field]: value })
    setSaved(false)
  }

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotifications({ ...notifications, [field]: value })
    setSaved(false)
  }

  const handleSecurityChange = (field: string, value: string) => {
    setSecurity({ ...security, [field]: value })
    setSaved(false)
  }

  const handleDisplayChange = (field: string, value: string) => {
    setDisplay({ ...display, [field]: value })
    setSaved(false)
  }

  const handleSystemChange = (field: string, value: string | boolean) => {
    setSystem({ ...system, [field]: value })
    setSaved(false)
  }

  const handleSave = () => {
    setSaved(true)
    localStorage.setItem('adminSettings', JSON.stringify({
      general,
      notifications,
      display,
      system,
    }))
    setTimeout(() => setSaved(false), 3000)
  }

  const handleChangePassword = () => {
    if (security.newPassword !== security.confirmPassword) {
      alert('Passwords do not match!')
      return
    }
    if (security.newPassword.length < 8) {
      alert('Password must be at least 8 characters long!')
      return
    }
    setSaved(true)
    setSecurity({ currentPassword: '', newPassword: '', confirmPassword: '', twoFactorAuth: false })
    setTimeout(() => setSaved(false), 3000)
  }

  const tabs = [
    { id: 'general', label: 'General Settings', icon: '⚙️' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'security', label: 'Security', icon: '🔐' },
  ]

  return (
    <AdminLayout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-lg p-6 shadow-lg text-white">
          <h1 className="text-4xl font-bold">Settings</h1>
          <p className="text-red-100 mt-1">Configure your admin panel and system preferences</p>
        </div>

        {/* Success Message */}
        {saved && (
          <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 text-green-700 font-semibold">
            ✓ Settings saved successfully!
          </div>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 bg-white border-2 border-red-200 rounded-lg p-3 shadow-md">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-red-100'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white border-2 border-red-200 rounded-lg p-8 shadow-md">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-red-200 pb-4">General Settings</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2 whitespace-nowrap">Restaurant Name</label>
                  <input
                    type="text"
                    value={general.restaurantName}
                    onChange={(e) => handleGeneralChange('restaurantName', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 border-2 border-red-200 rounded-lg text-black focus:outline-none focus:border-red-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2 whitespace-nowrap">Phone Number</label>
                  <input
                    type="text"
                    value={general.phoneNumber}
                    onChange={(e) => handleGeneralChange('phoneNumber', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 border-2 border-red-200 rounded-lg text-black focus:outline-none focus:border-red-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2 whitespace-nowrap">Email</label>
                  <input
                    type="email"
                    value={general.email}
                    onChange={(e) => handleGeneralChange('email', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 border-2 border-red-200 rounded-lg text-black focus:outline-none focus:border-red-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2 whitespace-nowrap">Timezone</label>
                  <select
                    value={general.timezone}
                    onChange={(e) => handleGeneralChange('timezone', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 border-2 border-red-200 rounded-lg text-black focus:outline-none focus:border-red-400"
                  >
                    <option value="IST">IST (India Standard Time)</option>
                    <option value="UTC">UTC</option>
                    <option value="EST">EST</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-900 mb-2 whitespace-nowrap">Address</label>
                  <textarea
                    value={general.address}
                    onChange={(e) => handleGeneralChange('address', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 border-2 border-red-200 rounded-lg text-black focus:outline-none focus:border-red-400 resize-none"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-red-200 pb-4">Notification Preferences</h2>

              <div className="space-y-4">
                {[
                  { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive updates via email' },
                  { key: 'smsNotifications', label: 'SMS Notifications', description: 'Receive alerts via SMS' },
                  { key: 'pushNotifications', label: 'Push Notifications', description: 'Browser push notifications' },
                  { key: 'dailyReport', label: 'Daily Report', description: 'Send daily summary reports' },
                  { key: 'orderAlerts', label: 'Order Alerts', description: 'Real-time order notifications' },
                  { key: 'franchiseUpdates', label: 'Franchise Updates', description: 'Franchise enquiry notifications' },
                ].map((item) => (
                  <div key={item.key} className="flex items-start justify-between p-4 bg-gray-50 border-2 border-red-100 rounded-lg hover:border-red-200 transition-colors">
                    <div>
                      <p className="font-semibold text-gray-900 whitespace-nowrap">{item.label}</p>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications[item.key as keyof typeof notifications] as boolean}
                      onChange={(e) => handleNotificationChange(item.key, e.target.checked)}
                      className="w-5 h-5 accent-red-600 cursor-pointer flex-shrink-0 mt-1"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-red-200 pb-4">Security Settings</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Lock size={20} className="text-red-600" />
                    Change Password
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2 whitespace-nowrap">Current Password</label>
                      <input
                        type="password"
                        value={security.currentPassword}
                        onChange={(e) => handleSecurityChange('currentPassword', e.target.value)}
                        placeholder="Enter current password"
                        className="w-full px-4 py-2 bg-gray-50 border-2 border-red-200 rounded-lg text-black focus:outline-none focus:border-red-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2 whitespace-nowrap">New Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={security.newPassword}
                          onChange={(e) => handleSecurityChange('newPassword', e.target.value)}
                          placeholder="Enter new password"
                          className="w-full px-4 py-2 bg-gray-50 border-2 border-red-200 rounded-lg text-black focus:outline-none focus:border-red-400"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-red-600 hover:text-red-700"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2 whitespace-nowrap">Confirm Password</label>
                      <input
                        type="password"
                        value={security.confirmPassword}
                        onChange={(e) => handleSecurityChange('confirmPassword', e.target.value)}
                        placeholder="Confirm new password"
                        className="w-full px-4 py-2 bg-gray-50 border-2 border-red-200 rounded-lg text-black focus:outline-none focus:border-red-400"
                      />
                    </div>

                    <button
                      onClick={handleChangePassword}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all"
                    >
                      Update Password
                    </button>
                  </div>
                </div>


              </div>
            </div>
          )}

          {/* Display Settings */}
          {activeTab === 'display' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-red-200 pb-4">Display & Language</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2 whitespace-nowrap">Theme Color</label>
                  <select
                    value={display.theme}
                    onChange={(e) => handleDisplayChange('theme', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 border-2 border-red-200 rounded-lg text-black focus:outline-none focus:border-red-400"
                  >
                    <option value="red">Red (Default)</option>
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                    <option value="purple">Purple</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2 whitespace-nowrap">Language</label>
                  <select
                    value={display.language}
                    onChange={(e) => handleDisplayChange('language', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 border-2 border-red-200 rounded-lg text-black focus:outline-none focus:border-red-400"
                  >
                    <option value="english">English</option>
                    <option value="hindi">Hindi</option>
                    <option value="spanish">Spanish</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2 whitespace-nowrap">Items Per Page</label>
                  <select
                    value={display.itemsPerPage}
                    onChange={(e) => handleDisplayChange('itemsPerPage', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 border-2 border-red-200 rounded-lg text-black focus:outline-none focus:border-red-400"
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2 whitespace-nowrap">Date Format</label>
                  <select
                    value={display.dateFormat}
                    onChange={(e) => handleDisplayChange('dateFormat', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 border-2 border-red-200 rounded-lg text-black focus:outline-none focus:border-red-400"
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* System Settings */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-red-200 pb-4">System Settings</h2>

              <div className="space-y-6">
                <div className="flex items-start justify-between p-4 bg-gray-50 border-2 border-red-100 rounded-lg hover:border-red-200 transition-colors">
                  <div>
                    <p className="font-semibold text-gray-900 whitespace-nowrap">Auto Backup</p>
                    <p className="text-sm text-gray-600">Automatically backup your data</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={system.autoBackup}
                    onChange={(e) => handleSystemChange('autoBackup', e.target.checked)}
                    className="w-5 h-5 accent-red-600 cursor-pointer flex-shrink-0 mt-1"
                  />
                </div>

                {system.autoBackup && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2 whitespace-nowrap">Backup Frequency</label>
                    <select
                      value={system.backupFrequency}
                      onChange={(e) => handleSystemChange('backupFrequency', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-50 border-2 border-red-200 rounded-lg text-black focus:outline-none focus:border-red-400"
                    >
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2 whitespace-nowrap">Data Retention (Days)</label>
                  <input
                    type="number"
                    value={system.dataRetention}
                    onChange={(e) => handleSystemChange('dataRetention', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 border-2 border-red-200 rounded-lg text-black focus:outline-none focus:border-red-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2 whitespace-nowrap">API Key</label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={system.apiKey}
                      readOnly
                      className="flex-1 px-4 py-2 bg-gray-50 border-2 border-red-200 rounded-lg text-black focus:outline-none min-w-0"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(system.apiKey)
                        alert('API Key copied!')
                      }}
                      className="px-3 md:px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all text-xs md:text-sm flex-shrink-0"
                    >
                      <span className="hidden sm:inline">Copy</span>
                      <span className="sm:hidden">📋</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="flex gap-4 justify-end">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-8 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-all shadow-lg hover:shadow-xl"
          >
            <Save size={20} />
            Save Settings
          </button>
        </div>
      </div>
    </AdminLayout>
  )
}
