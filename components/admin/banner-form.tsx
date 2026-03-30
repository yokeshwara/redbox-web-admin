'use client'

import { useState, useEffect } from 'react'
import { X, Upload } from 'lucide-react'

interface Banner {
  id: string
  title: string
  subtitle: string
  image?: string | null
  image_url?: string | null
  isActive: boolean
  createdAt: string
}

interface BannerFormProps {
  banner?: Banner | null
  onSubmit: (data: { title: string; subtitle: string; image: File | null }) => void
  onClose: () => void
}

export function BannerForm({ banner, onSubmit, onClose }: BannerFormProps) {

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>('') 
  const [error, setError] = useState('')

  useEffect(() => {

    if (banner) {
      setFormData({
        title: banner.title || '',
        subtitle: banner.subtitle || '',
      })

      // FIX: Use a proper URL for preview
      const existingImage = banner.image || banner.image_url || ''
      
      // If the API returns relative path, prepend base URL
      const imageUrl = existingImage.startsWith('http') ? existingImage : `${process.env.NEXT_PUBLIC_API_BASE_URL || ''}${existingImage}`

      setPreview(imageUrl)
      setImageFile(null)

    } else {
      setFormData({ title: '', subtitle: '' })
      setPreview('')
      setImageFile(null)
    }

  }, [banner])

  // =========================
  // Handle Image Upload
  // =========================
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {

    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file')
      return
    }

    setImageFile(file)

    const reader = new FileReader()
    reader.onloadend = () => setPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  // =========================
  // Submit
  // =========================
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.title.trim()) {
      setError('Banner title is required')
      return
    }

    if (!formData.subtitle.trim()) {
      setError('Banner subtitle is required')
      return
    }

    if (!banner && !imageFile) {
      setError('Banner image is required')
      return
    }

    onSubmit({ title: formData.title, subtitle: formData.subtitle, image: imageFile })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-500 px-6 py-4 flex items-center justify-between sticky top-0">
          <h2 className="text-xl font-bold text-white">{banner ? 'Edit Banner' : 'Create New Banner'}</h2>
          <button onClick={onClose} className="text-white hover:bg-red-700 p-1 rounded transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          {error && (
            <div className="p-4 bg-red-100 border-2 border-red-300 rounded-lg text-red-700 text-sm font-semibold">{error}</div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Banner Title <span className="text-red-500">*</span></label>
            <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-500" />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Banner Subtitle <span className="text-red-500">*</span></label>
            <input type="text" value={formData.subtitle} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-500" />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Banner Image <span className="text-red-500">*</span></label>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-red-500 transition-colors">
              <Upload className="text-gray-400 mb-2" size={28} />
              <span className="text-sm text-gray-600 font-medium">Click to upload banner image</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>

          {/* Preview */}
          {preview ? (
            <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
              <img src={preview} alt="Preview" className="w-full h-40 object-cover" />
            </div>
          ) : null}

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 hover:bg-gray-50 font-bold">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg hover:shadow-lg font-bold">{banner ? 'Update Banner' : 'Create Banner'}</button>
          </div>

        </form>
      </div>
    </div>
  )
}