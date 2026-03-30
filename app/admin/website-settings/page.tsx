'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Save, Upload, Loader2 } from 'lucide-react'
import { settingsAPI } from '@/lib/api/settings'
import { useToast } from '@/hooks/use-toast'

export default function WebsiteSettingsPage() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    restaurant_name: 'RedBox',
    address: '123 Main Street, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    postal_code: '400001',
    country: 'India',
    contact_email: 'contact@redbox.com',
    support_email: 'support@redbox.com',
    phone: '9876543210',
    facebook: 'https://facebook.com/redbox',
    instagram: 'https://instagram.com/redbox',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    footer_text: 'Copyright © 2024 RedBox Restaurants. All rights reserved.',
    maintenance_mode: false,
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [logoData, setLogoData] = useState({
    title: 'RedBox',
    subtitle: 'Admin Panel',
    logo: null as File | null,
    logoPreview: '',
  })
  const [uploadingLogo, setUploadingLogo] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    setLoading(true)
    try {
      const data = await settingsAPI.list()
      const settings = Array.isArray(data) ? data[0] : data
      if (settings) {
        setFormData(settings)
      }
    } catch (error: any) {
      console.error('Error loading settings:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to load settings',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    })
  }

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Error',
          description: 'Please select a valid image file',
          variant: 'destructive',
        })
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'Error',
          description: 'Image size must be less than 5MB',
          variant: 'destructive',
        })
        return
      }

      setLogoData(prev => ({ ...prev, logo: file }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoData(prev => ({ ...prev, logoPreview: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLogoDataChange = (field: string, value: string) => {
    setLogoData(prev => ({ ...prev, [field]: value }))
  }

  const handleLogoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!logoData.title.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter logo title',
        variant: 'destructive',
      })
      return
    }

    try {
      setUploadingLogo(true)
      const data: any = {
        title: logoData.title,
        subtitle: logoData.subtitle,
      }

      if (logoData.logo) {
        data.logo = logoData.logo
      }

      const result = await settingsAPI.updateLogo(data)
      console.log('[v0] Logo updated:', result)

      toast({
        title: 'Success',
        description: 'Logo updated successfully',
      })

      // Reset logo form
      setLogoData({
        title: 'RedBox',
        subtitle: 'Admin Panel',
        logo: null,
        logoPreview: '',
      })
    } catch (error: any) {
      console.error('[v0] Error updating logo:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to update logo',
        variant: 'destructive',
      })
    } finally {
      setUploadingLogo(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await settingsAPI.update(formData)
      toast({
        title: 'Success',
        description: 'Settings saved successfully',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save settings',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Website Settings</h1>
          <p className="text-sm text-gray-600 mt-1">Manage global website configuration</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-gray-500">Loading settings...</p>
          </div>
        ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Logo Settings */}
          <div className="bg-white border-2 border-primary/20 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Logo & Branding</h2>
            <form onSubmit={handleLogoSubmit} className="space-y-4">
              {/* Logo Preview */}
              {logoData.logoPreview && (
                <div className="flex justify-center mb-4">
                  <img
                    src={logoData.logoPreview}
                    alt="Logo preview"
                    className="max-h-32 object-contain border-2 border-gray-200 rounded-lg p-2"
                  />
                </div>
              )}

              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Logo Image</label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoFileChange}
                    disabled={uploadingLogo}
                    className="hidden"
                    id="logo-input"
                  />
                  <label
                    htmlFor="logo-input"
                    className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Upload size={18} className="text-gray-600" />
                    <span className="text-sm font-medium text-gray-600">
                      {logoData.logo ? 'Change Logo' : 'Choose Logo'}
                    </span>
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">Max 5MB. PNG, JPG, or GIF.</p>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Logo Title</label>
                <input
                  type="text"
                  value={logoData.title}
                  onChange={(e) => handleLogoDataChange('title', e.target.value)}
                  placeholder="e.g., RedBox"
                  disabled={uploadingLogo}
                  className="w-full px-3 py-2 border-2 border-primary/30 rounded-lg focus:outline-none focus:border-primary disabled:opacity-50 text-gray-900"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Logo Subtitle</label>
                <input
                  type="text"
                  value={logoData.subtitle}
                  onChange={(e) => handleLogoDataChange('subtitle', e.target.value)}
                  placeholder="e.g., Admin Panel"
                  disabled={uploadingLogo}
                  className="w-full px-3 py-2 border-2 border-primary/30 rounded-lg focus:outline-none focus:border-primary disabled:opacity-50 text-gray-900"
                />
              </div>

              {/* Logo Submit Button */}
              <button
                type="submit"
                disabled={uploadingLogo}
                className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors font-semibold w-full justify-center"
              >
                {uploadingLogo ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Updating Logo...
                  </>
                ) : (
                  <>
                    <Upload size={18} />
                    Update Logo
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Restaurant Info */}
          <div className="bg-white border-2 border-primary/20 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Restaurant Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Restaurant Name *</label>
                <input type="text" name="restaurant_name" value={formData.restaurant_name} onChange={handleChange} className="w-full px-3 py-2 border-2 border-primary/30 rounded-lg focus:outline-none focus:border-primary text-gray-900" required />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Full Address</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full px-3 py-2 border-2 border-primary/30 rounded-lg focus:outline-none focus:border-primary text-gray-900" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} className="w-full px-3 py-2 border-2 border-primary/30 rounded-lg focus:outline-none focus:border-primary text-gray-900" />
                <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} className="w-full px-3 py-2 border-2 border-primary/30 rounded-lg focus:outline-none focus:border-primary text-gray-900" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input type="text" name="postal_code" placeholder="Postal Code" value={formData.postal_code} onChange={handleChange} className="w-full px-3 py-2 border-2 border-primary/30 rounded-lg focus:outline-none focus:border-primary text-gray-900" />
                <input type="text" name="country" placeholder="Country" value={formData.country} onChange={handleChange} className="w-full px-3 py-2 border-2 border-primary/30 rounded-lg focus:outline-none focus:border-primary text-gray-900" />
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white border-2 border-primary/20 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="email" name="contact_email" placeholder="Contact Email" value={formData.contact_email} onChange={handleChange} className="w-full px-3 py-2 border-2 border-primary/30 rounded-lg focus:outline-none focus:border-primary text-gray-900" />
                <input type="tel" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 border-2 border-primary/30 rounded-lg focus:outline-none focus:border-primary text-gray-900" />
              </div>

              <div>
                <input type="email" name="support_email" placeholder="Support Email" value={formData.support_email} onChange={handleChange} className="w-full px-3 py-2 border-2 border-primary/30 rounded-lg focus:outline-none focus:border-primary text-gray-900" />
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-white border-2 border-primary/20 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Social Media Links</h2>
            <div className="space-y-4">
              <input type="url" name="facebook" placeholder="Facebook URL" value={formData.facebook} onChange={handleChange} className="w-full px-3 py-2 border-2 border-primary/30 rounded-lg focus:outline-none focus:border-primary text-gray-900" />
              <input type="url" name="instagram" placeholder="Instagram URL" value={formData.instagram} onChange={handleChange} className="w-full px-3 py-2 border-2 border-primary/30 rounded-lg focus:outline-none focus:border-primary text-gray-900" />
            </div>
          </div>

          {/* Other Settings */}
          <div className="bg-white border-2 border-primary/20 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Other Settings</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <select name="currency" value={formData.currency} onChange={handleChange} className="w-full px-3 py-2 border-2 border-primary/30 rounded-lg focus:outline-none focus:border-primary text-gray-900">
                  <option value="INR">Indian Rupee (₹)</option>
                  <option value="USD">US Dollar ($)</option>
                </select>

                <select name="timezone" value={formData.timezone} onChange={handleChange} className="w-full px-3 py-2 border-2 border-primary/30 rounded-lg focus:outline-none focus:border-primary text-gray-900">
                  <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Footer Text</label>
                <textarea name="footer_text" value={formData.footer_text} onChange={handleChange} className="w-full px-3 py-2 border-2 border-primary/30 rounded-lg focus:outline-none focus:border-primary text-gray-900" rows={2} />
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="maintenance_mode" name="maintenance_mode" checked={formData.maintenance_mode} onChange={handleChange} className="w-4 h-4" />
                <label htmlFor="maintenance_mode" className="text-sm font-semibold text-gray-900">Enable Maintenance Mode</label>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all font-bold text-lg disabled:opacity-50">
            <Save size={20} />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
        )}
      </div>
    </AdminLayout>
  )
}
