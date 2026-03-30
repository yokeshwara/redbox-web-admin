'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Save, Upload, Eye, EyeOff, Lock, Shield, Bell, Mail, Loader2 } from 'lucide-react'
import { profileAPI } from '@/lib/api/profile'
import { useToast } from '@/hooks/use-toast'

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [showPassword, setShowPassword] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const [profile, setProfile] = useState({
    full_name: 'Admin User',
    email: 'admin@redbox.com',
    role: 'Administrator',
    phone: '+91 98765 43210',
    profile_image: '',
    bio: 'Restaurant Management Administrator',
  })

  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
  })

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    dailyReports: true,
    newAlerts: true,
  })

  const [activityLog, setActivityLog] = useState([
    { date: '2024-01-15 10:30 AM', action: 'Logged in', status: 'success' },
    { date: '2024-01-15 09:15 AM', action: 'Updated branch settings', status: 'success' },
    { date: '2024-01-14 08:45 PM', action: 'Added new menu item', status: 'success' },
    { date: '2024-01-14 03:20 PM', action: 'Exported franchise report', status: 'success' },
    { date: '2024-01-14 11:00 AM', action: 'Failed login attempt', status: 'warning' },
  ])

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const data = await profileAPI.getProfile()
      console.log('[v0] Profile data:', data)
      setProfile({
        full_name: data.full_name || data.name || 'Admin User',
        email: data.email || '',
        role: data.role || 'Administrator',
        phone: data.phone || '',
        profile_image: data.profile_image || '',
        bio: data.bio || '',
      })
    } catch (error) {
      console.error('[v0] Error fetching profile:', error)
      toast({
        title: 'Error',
        description: 'Failed to load profile data',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleProfileChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  const handleSecurityChange = (field: string, value: string | boolean) => {
    setSecurity((prev) => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  const handlePreferenceChange = (field: string, value: boolean) => {
    setPreferences((prev) => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  const handleSaveProfile = async () => {
    try {
      setSaving(true)
      await profileAPI.updateProfile({
        full_name: profile.full_name,
      })
      console.log('[v0] Profile saved successfully')
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('[v0] Error saving profile:', error)
      toast({
        title: 'Error',
        description: 'Failed to save profile',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = () => {
    if (security.newPassword !== security.confirmPassword) {
      alert('Passwords do not match!')
      return
    }
    if (security.newPassword.length < 8) {
      alert('Password must be at least 8 characters!')
      return
    }
    setSecurity({ currentPassword: '', newPassword: '', confirmPassword: '', twoFactorEnabled: false })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-lg p-6 shadow-lg text-white flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-3xl">{profile.full_name.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold">{profile.full_name}</h1>
              <p className="text-red-100">{profile.role} • {profile.email}</p>
            </div>
          </div>
          {saved && (
            <div className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold">
              ✓ Changes saved
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 bg-white border-2 border-red-200 rounded-lg p-3 shadow-md">
          {[
            { id: 'profile', label: 'Profile', icon: '👤' },
            { id: 'security', label: 'Security', icon: '🔐' },
            { id: 'preferences', label: 'Preferences', icon: '⚙️' },
            { id: 'activity', label: 'Activity Log', icon: '📊' },
          ].map((tab) => (
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
        <div className="bg-white border-2 border-red-200 rounded-lg p-6 md:p-8 shadow-md">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-red-200 pb-4">Profile Information</h2>

              {/* Avatar Upload */}
              <div className="flex flex-col sm:flex-row gap-6 p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border-2 border-red-200">
                <div className="flex-shrink-0">
                  {profile.profile_image ? (
                    <img
                      src={profile.profile_image}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover shadow-lg border-2 border-red-200"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-4xl">{profile.full_name.charAt(0).toUpperCase()}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900 mb-3">Profile Picture</h3>
                  <p className="text-sm text-gray-700 mb-4">Upload a professional photo (JPG, PNG, max 5MB)</p>
                  <label className="inline-block">
                    <div className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold cursor-pointer hover:bg-red-700 transition-colors">
                      <Upload size={18} />
                      Choose Photo
                    </div>
                    <input type="file" accept="image/*" className="hidden" />
                  </label>
                </div>
              </div>

              {/* Profile Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={profile.full_name}
                    onChange={(e) => handleProfileChange('full_name', e.target.value)}
                    disabled={saving || loading}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-red-200 rounded-lg text-gray-900 focus:outline-none focus:border-red-400 transition-colors disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Role/Title</label>
                  <input
                    type="text"
                    value={profile.role}
                    onChange={(e) => handleProfileChange('role', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-red-200 rounded-lg text-gray-900 focus:outline-none focus:border-red-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-red-200 rounded-lg text-gray-900 focus:outline-none focus:border-red-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => handleProfileChange('phone', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-red-200 rounded-lg text-gray-900 focus:outline-none focus:border-red-400 transition-colors"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Bio</label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => handleProfileChange('bio', e.target.value)}
                    placeholder="Tell us about yourself..."
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-red-200 rounded-lg text-gray-900 focus:outline-none focus:border-red-400 transition-colors resize-none"
                    rows={4}
                  />
                </div>
              </div>

              <button
                onClick={handleSaveProfile}
                disabled={saving || loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Save Profile Changes
                  </>
                )}
              </button>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-red-200 pb-4">Security Settings</h2>

              <div className="space-y-6">
                {/* Change Password */}
                <div className="border-2 border-red-100 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Lock size={20} className="text-red-600" />
                    Change Password
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Current Password</label>
                      <input
                        type="password"
                        value={security.currentPassword}
                        onChange={(e) => handleSecurityChange('currentPassword', e.target.value)}
                        placeholder="Enter current password"
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-red-200 rounded-lg text-gray-900 focus:outline-none focus:border-red-400 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">New Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={security.newPassword}
                          onChange={(e) => handleSecurityChange('newPassword', e.target.value)}
                          placeholder="Enter new password"
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-red-200 rounded-lg text-gray-900 focus:outline-none focus:border-red-400 transition-colors pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-3 text-red-600 hover:text-red-700"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Confirm Password</label>
                      <input
                        type="password"
                        value={security.confirmPassword}
                        onChange={(e) => handleSecurityChange('confirmPassword', e.target.value)}
                        placeholder="Confirm new password"
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-red-200 rounded-lg text-gray-900 focus:outline-none focus:border-red-400 transition-colors"
                      />
                    </div>

                    <button
                      onClick={handleChangePassword}
                      className="w-full px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-all"
                    >
                      Update Password
                    </button>
                  </div>
                </div>

                {/* Two-Factor Authentication */}
                <div className="border-2 border-blue-100 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Shield size={20} className="text-blue-600" />
                    Two-Factor Authentication
                  </h3>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">Enable 2FA</p>
                      <p className="text-sm text-gray-600 mt-1">Add an extra layer of security to your account</p>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={security.twoFactorEnabled}
                        onChange={(e) => handleSecurityChange('twoFactorEnabled', e.target.checked)}
                        className="w-5 h-5 accent-blue-600 cursor-pointer"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-red-200 pb-4">Notification Preferences</h2>

              <div className="space-y-3">
                {[
                  { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive important updates via email' },
                  { key: 'smsNotifications', label: 'SMS Notifications', description: 'Get critical alerts via SMS' },
                  { key: 'pushNotifications', label: 'Push Notifications', description: 'Browser push notifications' },
                  { key: 'dailyReports', label: 'Daily Reports', description: 'Receive daily summary reports' },
                  { key: 'newAlerts', label: 'New Alerts', description: 'Be notified of new orders and franchises' },
                ].map((item) => (
                  <div key={item.key} className="flex items-start justify-between p-4 bg-gray-50 border-2 border-red-100 rounded-lg hover:border-red-200 transition-colors">
                    <div>
                      <p className="font-semibold text-gray-900">{item.label}</p>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={preferences[item.key as keyof typeof preferences] as boolean}
                        onChange={(e) => handlePreferenceChange(item.key, e.target.checked)}
                        className="w-5 h-5 accent-red-600 cursor-pointer"
                      />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activity Log Tab */}
          {activeTab === 'activity' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-red-200 pb-4">Activity Log</h2>

              <div className="space-y-2">
                {activityLog.map((log, index) => (
                  <div key={index} className="flex items-start justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{log.action}</p>
                      <p className="text-sm text-gray-600 mt-1">{log.date}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap flex-shrink-0 ml-4 ${
                      log.status === 'success'
                        ? 'bg-green-100 text-green-700'
                        : log.status === 'warning'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {log.status === 'success' ? '✓ Success' : log.status === 'warning' ? '⚠ Warning' : '✗ Failed'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
